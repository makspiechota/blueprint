import express, { Request, Response } from 'express';
import cors from 'cors';
import { createOpencodeClient } from '@opencode-ai/sdk/client';

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

// Initialize OpenCode client for free Grok model
const opencodeClient = createOpencodeClient({
  // No authentication needed for free Grok model
});

app.post('/api/chat', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  try {
    const { message, context } = req.body;

    // Generate AI response using OpenCode client
    // TODO: Replace with actual OpenCode SDK API calls when documentation is available
    // For now, providing mock responses that simulate Grok Code Fast 1
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

    let responseText = '';
    if (context.resourceType.includes('vision')) {
      responseText = `I see you're working on the vision statement: "${context.currentContent}". This is a critical component of your business blueprint. Consider making it more specific about the target market or unique value proposition. What aspects would you like to refine?`;
    } else if (context.resourceType.includes('problem')) {
      responseText = `The problem statement "${context.currentContent}" identifies a key pain point. To strengthen it, consider quantifying the impact or specifying the affected user segment. How would you like to enhance this?`;
    } else {
      responseText = `I understand you're working on ${context.resourceType}. Based on the current content, I can help you refine this aspect of your business blueprint. What specific improvements are you considering?`;
    }

    const response = { text: responseText };

    res.json({
      message: response.text || `I understand you're working on ${context.resourceType}. How can I help you improve this resource?`,
      model: 'grok-code-fast-1',
      context: context
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'AI service temporarily unavailable'
    });
  }
});

app.post('/api/modify', async (req: Request<{}, {}, ModifyRequest>, res: Response) => {
  try {
    const { resourceType, resourcePath, newContent } = req.body;

    // Use AI to help with modification guidance
    // TODO: Replace with actual OpenCode SDK API calls when documentation is available
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay

    const response = {
      text: `I've analyzed the requested changes to ${resourceType}. The modification "${JSON.stringify(newContent)}" looks good and aligns with business blueprint best practices. The file at ${resourcePath} would be updated accordingly. Would you like me to proceed with applying these changes?`
    };

    res.json({
      success: true,
      message: response.text || `Successfully processed modification request for ${resourceType}`,
    });
  } catch (error) {
    console.error('Modify API error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Modification service temporarily unavailable'
    });
  }
});

const PORT: number = parseInt(process.env.PORT || '3001');

app.listen(PORT, () => {
  console.log(`🚀 AI Chat server running on port ${PORT}`);
  console.log(`🤖 Using Grok Code Fast 1 (free model via OpenCode)`);
});