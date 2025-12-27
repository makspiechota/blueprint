// AI service for communicating with the OpenCode backend
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatContext {
  resourceType: string;
  resourcePath: string;
  currentContent: any;
}

export interface AIResponse {
  message: string;
  model: string;
  context?: ChatContext;
}

class AIService {
  private baseUrl = 'http://localhost:3001/api';

  async sendMessage(message: string, context: ChatContext): Promise<AIResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }

    return response.json();
  }

  async requestModification(
    resourceType: string,
    resourcePath: string,
    newContent: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/modify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resourceType,
        resourcePath,
        newContent,
      }),
    });

    if (!response.ok) {
      throw new Error(`Modification error: ${response.statusText}`);
    }

    const result = await response.json();

    // If modification was successful, trigger hot-reload by updating the file
    if (result.success) {
      // In a real implementation, the file would be modified on the server
      // For now, we'll assume the hot-reload happens automatically
      console.log('File modification requested:', result);
    }

    return result;
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
}

export const aiService = new AIService();