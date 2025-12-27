const express = require('express');
const cors = require('cors');
const { OpenCodeAI } = require('@opencode-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenCode SDK with Grok Code Fast 1
const aiSDK = new OpenCodeAI({
  model: 'grok-code-fast-1',
  // Add any required API keys or config here
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    const response = await aiSDK.generate(message, { context });
    res.json({
      message: response.text,
      model: 'grok-code-fast-1',
      context: context
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/modify', async (req, res) => {
  try {
    const { resourceType, resourcePath, newContent } = req.body;
    // Use AI to validate and apply changes
    const validation = await aiSDK.generate(`Validate and apply this change to ${resourceType}: ${newContent}`, { file: resourcePath });
    // Here you would actually modify the file
    // For now, return the AI response
    res.json({
      success: true,
      message: validation.text,
      aiResponse: validation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AI Chat server running on port ${PORT}`);
  console.log(`Using model: ${aiSDK.model}`);
});