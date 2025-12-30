import { createOpencodeClient } from '@opencode-ai/sdk';
import yaml from 'js-yaml';

const API_BASE = 'http://localhost:3001';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatContext {
  resourceType: string;
  resourcePath: string;
  currentContent: Record<string, unknown>;
}

export interface AIResponse {
  message: string;
  model: string;
  context?: ChatContext;
}

class AIService {
  private client = createOpencodeClient({
    baseUrl: 'http://localhost:4097',
  });

  private currentSessionId: string | null = null;
  private blueprintContent: string | null = null;
  private messageCount: number = 0;

  async initializeSession(resourceType: string, resourcePath: string, blueprintData?: any): Promise<string> {
    try {
      // Create a new session for each chat
      const session = await this.client.session.create({
        body: { title: `Blueprint Chat: ${resourceType}` },
      });

      if (session.error || !session.data?.id) {
        throw new Error('Failed to create session');
      }

      this.currentSessionId = session.data.id;
      console.log('Created OpenCode session:', this.currentSessionId);

      // Use provided blueprint data if available, otherwise try to read file
      if (blueprintData) {
        this.blueprintContent = typeof blueprintData === 'string' ? blueprintData : JSON.stringify(blueprintData, null, 2);
        console.log('Using provided blueprint data, length:', this.blueprintContent.length);
      } else {
        // Load the blueprint file content
        console.log('Attempting to read file:', resourcePath);
        try {
          const content = await this.client.file.read({
            query: { path: resourcePath },
          });

          console.log('File read response:', content);

          if (!content.error && content.data?.content) {
            this.blueprintContent = content.data.content;
            console.log('Loaded blueprint content for session, length:', this.blueprintContent.length);
          } else {
            this.blueprintContent = null;
            console.warn('Failed to load blueprint content, error:', content.error);
          }
        } catch (fileError) {
          console.warn('File read failed, using empty context:', fileError);
          this.blueprintContent = null;
        }
      }

      this.messageCount = 0;
      return this.currentSessionId;
    } catch (error) {
      console.error('Session initialization error:', error);
      throw error;
    }
  }

  async sendMessage(message: string, context: ChatContext): Promise<AIResponse> {
    if (!this.currentSessionId) {
      throw new Error('No active session. Call initializeSession first.');
    }

    try {
      console.log('Sending message to session:', this.currentSessionId);

      // Include blueprint context only in the first message to avoid payload size issues
      const blueprintContext = this.messageCount === 0 && this.blueprintContent ?
        `Blueprint context (refer to this for all questions):\n${this.blueprintContent}\n\n` :
        (this.blueprintContent ? 'Remember the blueprint context provided earlier.\n\n' : '');

      const fullPrompt = `${blueprintContext}User question: ${message}`;
      this.messageCount++;
      console.log('Full prompt length:', fullPrompt.length);

      const result = await this.client.session.prompt({
        path: { id: this.currentSessionId },
        body: {
          model: { providerID: "opencode", modelID: "grok-code" },
          parts: [{ type: "text", text: fullPrompt }],
        },
      });

      console.log('API response received:', result);

      if (result.error) {
        console.error('API returned error:', result.error);
        // If session error, try to recreate session
        if (result.error.toString().includes('session')) {
          console.log('Session error, attempting to recreate session...');
          try {
            const newSession = await this.client.session.create({
              body: { title: `Blueprint Chat: ${context.resourceType} (retry)` },
            });
            if (newSession.data?.id) {
              this.currentSessionId = newSession.data.id;
              console.log('Recreated session:', this.currentSessionId);
              // Retry the prompt with new session
              const retryResult = await this.client.session.prompt({
                path: { id: this.currentSessionId },
                body: {
                  model: { providerID: "opencode", modelID: "grok-code" },
                  parts: [{ type: "text", text: fullPrompt }],
                },
              });
              if (!retryResult.error) {
                const retryParts = (retryResult.data as { parts?: Array<{ type: string; text?: string }> })?.parts || [];
                const retryTextPart = retryParts.find(part => part.type === 'text');
                return {
                  message: retryTextPart?.text || 'Response received after retry',
                  model: 'grok-code',
                  context
                };
              }
            }
          } catch (retryError) {
            console.error('Retry failed:', retryError);
          }
        }
        throw new Error(`OpenCode API error: ${result.error}`);
      }

      // Extract the text part from the response
      const parts = (result.data as { parts?: Array<{ type: string; text?: string }> })?.parts || [];
      console.log('Response parts:', parts.length, 'parts found');

      const textPart = parts.find(part => part.type === 'text');
      const responseMessage = textPart?.text || 'Response received';

      console.log('Extracted response message:', responseMessage.substring(0, 100) + '...');

      return {
        message: responseMessage,
        model: 'grok-code',
        context
      };
    } catch (error) {
      console.error('Message send error:', error);
      throw error;
    }
  }

  async closeSession(): Promise<void> {
    this.currentSessionId = null;
    this.blueprintContent = null;
    this.messageCount = 0;
  }

  // Helper to detect if a message contains modification intent
  detectModificationIntent(message: string): { isModification: boolean; newContent?: string } {
    const lowerMessage = message.toLowerCase();

    // Simple pattern matching for modification requests
    if (lowerMessage.includes('update') || lowerMessage.includes('change') || lowerMessage.includes('modify')) {
      // Try to extract the new content (this is very basic)
      const contentMatch = message.match(/(?:to|with)\s*["']([^"']+)["']/i) ||
                          message.match(/["']([^"']+)["']/);

      return {
        isModification: true,
        newContent: contentMatch ? contentMatch[1] : message
      };
    }

    return { isModification: false };
  }

  async saveFileContent(resourcePath: string, content: string): Promise<{ success: boolean; message: string }> {
    try {
      // Extract productName and filename from resourcePath (e.g., "src/data/blueprint/north-star.yaml")
      const parts = resourcePath.split('/');
      const productName = parts[parts.length - 2];
      const filename = parts[parts.length - 1];

      const response = await fetch(`${API_BASE}/api/yaml/${productName}/${filename}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: content }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, message: error.error || 'Failed to save file' };
      }

      const result = await response.json();
      return { success: true, message: result.message || 'File saved successfully' };
    } catch (error) {
      console.error('Save file error:', error);
      return { success: false, message: 'Network error while saving file' };
    }
  }

  async generateLayer(resourceType: string, resourceData: any): Promise<{ success: boolean; message: string }> {
    try {
      // Schema will be read by AI from path
      const schemaType = resourceType.replace('generate-', '');

      // Initialize a new session for generation
      const session = await this.client.session.create({
        body: { title: `Generate ${resourceType}` },
      });

      if (session.error || !session.data?.id) {
        return { success: false, message: 'Failed to create generation session' };
      }

      const sessionId = session.data.id;
      console.log('Created generation session:', sessionId);

      // Prepare the generation prompt
      let prompt = '';
      const { productName, ...contextData } = resourceData;

      const schemaPath = `src/schemas/${schemaType}.yaml`;
      const schemaInstruction = `\n\nRead the schema from: ./${schemaPath}\n\nGenerate valid YAML that validates against this schema. Ensure all required fields are present and types match. Quote string values that contain colons, special characters, or start with numbers. Use proper YAML syntax. Output ONLY the YAML content, no explanations or additional text.`;

      switch (resourceType) {
        case 'generate-north-star':
          prompt = `Generate a North Star YAML file for a business blueprint. Create a compelling vision, problem statement, solution, and strategic goals. Output only valid YAML.${schemaInstruction}`;
          break;
        case 'generate-lean-canvas':
          prompt = `Generate a Lean Canvas YAML file based on the following North Star data: ${JSON.stringify(contextData, null, 2)}\n\nThe YAML must match the schema structure exactly, with all required fields populated with appropriate content derived from the North Star data. Output only valid YAML.${schemaInstruction}`;
          break;
        case 'generate-architectural-scope':
          prompt = `Generate an Architectural Scope YAML file based on the following Lean Canvas data: ${JSON.stringify(contextData, null, 2)}\n\nThe YAML must match the schema structure exactly, with all required fields populated with appropriate content derived from the Lean Canvas data. Output only valid YAML.${schemaInstruction}`;
          break;
        case 'generate-lean-viability':
          prompt = `Generate a Lean Viability YAML file based on the following Architectural Scope data: ${JSON.stringify(contextData, null, 2)}\n\nThe YAML must match the schema structure exactly, with all required fields populated with appropriate content derived from the Architectural Scope data. Output only valid YAML.${schemaInstruction}`;
          break;
        case 'generate-customers-factory':
          prompt = `Generate a Customers Factory (AAARR Metrics) YAML file based on the following Lean Viability data: ${JSON.stringify(contextData, null, 2)}\n\nThe YAML must match the schema structure exactly, with all required fields populated with appropriate content derived from the Lean Viability data. Output only valid YAML.${schemaInstruction}`;
          break;
        case 'generate-policy-charter':
          prompt = `Generate a Policy Charter YAML file based on the following Customers Factory data: ${JSON.stringify(contextData, null, 2)}\n\nThe YAML must match the schema structure exactly, with all required fields populated with appropriate content derived from the Customers Factory data. Output only valid YAML.${schemaInstruction}`;
          break;
        default:
          return { success: false, message: 'Unknown resource type' };
      }

      // Send the generation prompt
      const result = await this.client.session.prompt({
        path: { id: sessionId },
        body: {
          model: { providerID: "opencode", modelID: "grok-code" },
          parts: [{ type: "text", text: prompt }],
        },
      });

      if (result.error) {
        console.error('Generation prompt error:', result.error);
        return { success: false, message: `Generation failed: ${result.error}` };
      }

      // Extract the generated YAML
      const parts = (result.data as { parts?: Array<{ type: string; text?: string }> })?.parts || [];
      const textPart = parts.find(part => part.type === 'text');
      const generatedYaml = textPart?.text || '';

      if (!generatedYaml) {
        return { success: false, message: 'No content generated' };
      }

      console.log('Generated YAML:', generatedYaml.substring(0, 200) + '...');

      // Validate the YAML can be parsed
      try {
        yaml.load(generatedYaml);
      } catch (error) {
        console.error('Generated YAML is invalid:', error);
        return { success: false, message: `Generated YAML is invalid: ${(error as Error).message}` };
      }

      // Save the generated content
      let fileName = '';
      switch (resourceType) {
        case 'generate-north-star': fileName = 'north-star.yaml'; break;
        case 'generate-lean-canvas': fileName = 'lean-canvas.yaml'; break;
        case 'generate-architectural-scope': fileName = 'architectural-scope.yaml'; break;
        case 'generate-lean-viability': fileName = 'lean-viability.yaml'; break;
        case 'generate-customers-factory': fileName = 'aaarr-metrics.yaml'; break;
        case 'generate-policy-charter': fileName = 'policy-charter.yaml'; break;
      }

      const filePath = `src/data/${productName}/${fileName}`;
      const saveResult = await this.saveFileContent(filePath, generatedYaml);

      return saveResult;
    } catch (error) {
      console.error('Generate layer error:', error);
      return { success: false, message: `Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async requestModification(
    _resourceType: string,
    resourcePath: string,
    newContent: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Attempting to modify file:', resourcePath, 'with content:', newContent);

      // For now, since file.write may not be available, let's use a different approach
      // We'll ask the AI to suggest the modification through the session
      if (!this.currentSessionId) {
        return {
          success: false,
          message: 'No active session for modification'
        };
      }

      try {
        const modificationPrompt = `Please modify the blueprint file at ${resourcePath} with the following content:\n\n${newContent}\n\nConfirm when the modification is complete.`;

        const result = await this.client.session.prompt({
          path: { id: this.currentSessionId },
          body: {
            model: { providerID: "opencode", modelID: "grok-code" },
            parts: [{ type: "text", text: modificationPrompt }],
          },
        });

        if (result.error) {
          console.error('Modification prompt error:', result.error);
          return {
            success: false,
            message: `Failed to request modification: ${result.error}`
          };
        }

        // Extract the response
        const parts = (result.data as { parts?: Array<{ type: string; text?: string }> })?.parts || [];
        const textPart = parts.find(part => part.type === 'text');
        const responseMessage = textPart?.text || 'Modification request sent';

        return {
          success: true,
          message: responseMessage
        };
      } catch (error) {
        console.error('Modification request error:', error);
        return {
          success: false,
          message: `Modification request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    } catch (error) {
      console.error('File modification error:', error);
      return {
        success: false,
        message: `File modification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export const aiService = new AIService();