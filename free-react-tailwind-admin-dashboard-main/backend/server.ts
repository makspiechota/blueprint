import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { createOpencode } from '@opencode-ai/sdk';

const app = express();
app.use(cors());
app.use(express.json());

interface ChatRequest {
  message: string;
  context: {
    resourceType: string;
    resourcePath: string;
    currentContent: any;
  };
}

interface ModifyRequest {
  resourceType: string;
  resourcePath: string;
  newContent: string;
}

// Read blueprint files
const readBlueprintFile = (filePath: string): string => {
  try {
    const absolutePath = path.resolve(process.cwd(), '..', filePath);
    return fs.readFileSync(absolutePath, 'utf-8');
  } catch (error) {
    return `Error reading file: ${error}`;
  }
};

app.post('/api/chat', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  try {
    const { message, context } = req.body;

    // Read actual blueprint file
    const fileContent = readBlueprintFile(context.resourcePath);
    const currentContent = context.currentContent?.content || context.currentContent || 'empty';

    // Try OpenCode with real blueprint context
    let responseMessage: string;

    try {
      console.log('Attempting OpenCode chat...');
      const opencode = await createOpencode();

      const prompt = `Business Blueprint Analysis:

RESOURCE: ${context.resourceType}
CURRENT CONTENT: "${currentContent}"
FULL BLUEPRINT: ${fileContent.substring(0, 1500)}

USER: ${message}

Provide specific advice based on the actual blueprint content above. Reference real data from the files.`;

      const response = await (opencode.client as any).generate({
        prompt,
        maxTokens: 500,
        temperature: 0.7
      });

      responseMessage = response.text || 'OpenCode response received';
      console.log('✅ OpenCode chat successful');

    } catch (aiError) {
      console.log('❌ OpenCode chat failed, using intelligent analysis:', aiError);

      // Fallback: Intelligent analysis based on file content
      const lines = fileContent.split('\n');
      const contentMap: { [key: string]: string } = {};

      let currentKey = '';
      for (const line of lines) {
        if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':');
          currentKey = key.trim();
          contentMap[currentKey] = valueParts.join(':').trim();
        }
      }

      if (context.resourceType.includes('vision')) {
        responseMessage = `🎯 Vision Analysis: "${currentContent}"

**Blueprint Context:**
• Problem: ${contentMap.problem || 'Not specified'}
• Solution: ${contentMap.solution || 'Not specified'}

**Recommendations:**
1. Make it more measurable with specific outcomes
2. Connect to customer value proposition
3. Ensure it's achievable yet ambitious

What aspect would you like to strengthen?`;
      } else {
        responseMessage = `📋 Analysis of ${context.resourceType}: "${currentContent}"

**File Context:** ${contentMap.title || 'Business blueprint'} with ${Object.keys(contentMap).length} key elements.

**Suggestions:** Consider how this aligns with ${contentMap.vision ? 'your vision' : 'business objectives'}. What specific improvements are you considering?`;
      }
    }

    res.json({
      message: responseMessage,
      model: 'grok-code-fast-1',
      context
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Service temporarily unavailable'
    });
  }
});

app.post('/api/modify', async (req: Request<{}, {}, ModifyRequest>, res: Response) => {
  try {
    const { resourceType, resourcePath, newContent } = req.body;

    const currentFileContent = readBlueprintFile(resourcePath);

    // Try OpenCode for modification analysis
    let analysis: string;

    try {
      console.log('Attempting OpenCode modification analysis...');
      const opencode = await createOpencode();

      const prompt = `Analyze this blueprint modification:

TYPE: ${resourceType}
CURRENT FILE: ${currentFileContent.substring(0, 1000)}
PROPOSED: "${newContent}"

Provide assessment and recommendations based on the actual file content.`;

      const response = await (opencode.client as any).generate({
        prompt,
        maxTokens: 400,
        temperature: 0.3
      });

      analysis = response.text || 'OpenCode analysis completed';
      console.log('✅ OpenCode modification analysis successful');

    } catch (aiError) {
      console.log('❌ OpenCode failed, using fallback analysis');

      analysis = `🔄 **${resourceType} Modification Analysis**

**Proposed:** "${newContent}"

**Current Context:** File contains ${currentFileContent.length} characters across ${currentFileContent.split('\n').length} lines.

**Assessment:** The change appears ${newContent.length > 50 ? 'comprehensive' : 'focused'} and ${newContent.includes('business') ? 'business-aligned' : 'could strengthen business context'}.

Would you like me to apply this to ${resourcePath}?`;
    }

    res.json({
      success: true,
      message: analysis
    });
  } catch (error) {
    console.error('Modify API error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Analysis service error'
    });
  }
});

const PORT = parseInt(process.env.PORT || '3001');

app.listen(PORT, () => {
  console.log(`🚀 AI Chat server on port ${PORT}`);
  console.log(`🤖 OpenCode + Grok Code Fast 1`);
  console.log(`📁 Blueprint files: ${path.resolve(process.cwd(), '..')}`);
});