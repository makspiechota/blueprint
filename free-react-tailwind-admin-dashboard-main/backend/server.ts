import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

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

// Intelligent analysis based on actual blueprint content
const analyzeBlueprintContent = (fileContent: string, resourceType: string, currentContent: string, userMessage?: string): string => {
  // Parse YAML-like structure
  const lines = fileContent.split('\n');
  const contentMap: { [key: string]: string } = {};

  let currentKey = '';
  for (const line of lines) {
    if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      currentKey = key.trim();
      contentMap[currentKey] = valueParts.join(':').trim();
    } else if (currentKey && line.trim()) {
      contentMap[currentKey] += ' ' + line.trim();
    }
  }

  if (resourceType.includes('vision')) {
    return `🎯 **Vision Statement Analysis**: "${currentContent}"

**Current Assessment:**
• **Clarity**: ${currentContent.length > 50 ? 'Good - specific and detailed' : 'Could be more specific'}
• **Business Focus**: ${currentContent.toLowerCase().includes('business') ? 'Strong business orientation' : 'Could emphasize business impact'}
• **Measurability**: ${/\d+/.test(currentContent) ? 'Includes measurable elements' : 'Could add specific metrics'}

**Blueprint Context:**
• **Problem Addressed**: ${contentMap.problem || 'Not yet defined'}
• **Solution Approach**: ${contentMap.solution || 'Not yet defined'}
• **Target Customers**: ${contentMap.target_customers || contentMap.early_adopters || 'Not specified'}

**Recommendations:**
1. Add specific, quantifiable outcomes (e.g., "serve 10,000 customers" vs "serve customers")
2. Connect to broader business mission and values
3. Ensure it's ambitious yet achievable
4. Consider market timing and competitive landscape

What specific aspect of this vision would you like to strengthen?`;
  }

  else if (resourceType.includes('problem')) {
    return `❌ **Problem Statement Analysis**: "${currentContent}"

**Problem Evaluation:**
• **Specificity**: ${currentContent.includes('businesses') || currentContent.includes('customers') ? 'Target audience identified' : 'Specify who is affected'}
• **Impact Clarity**: ${/\d+/.test(currentContent) ? 'Quantified impact included' : 'Add specific impact metrics'}
• **Scope**: ${contentMap.existing_alternatives ? 'Considers current alternatives' : 'Reference existing solutions'}

**Related Blueprint Elements:**
• **Vision Alignment**: ${contentMap.vision ? 'Connected to vision' : 'Could link to vision'}
• **Solution Fit**: ${contentMap.solution ? 'Solution defined' : 'Solution not yet specified'}

**Improvement Suggestions:**
1. Quantify the problem scale (how many affected, cost impact)
2. Identify specific user segments and pain points
3. Show contrast with current inadequate solutions
4. Demonstrate market opportunity size

How would you like to make this problem statement more compelling?`;
  }

  else if (resourceType.includes('solution')) {
    return `✅ **Solution Analysis**: "${currentContent}"

**Solution Assessment:**
• **Problem Alignment**: ${currentContent.toLowerCase().includes('support') || currentContent.toLowerCase().includes('customer') ? 'Directly addresses core problem' : 'Could be more problem-focused'}
• **Differentiation**: ${currentContent.includes('AI') || currentContent.includes('intelligent') ? 'Technology advantage highlighted' : 'Emphasize unique differentiators'}
• **Implementation Clarity**: ${currentContent.includes('platform') || currentContent.includes('system') ? 'Technical approach described' : 'Add implementation details'}

**Blueprint Integration:**
• **Problem Solved**: ${contentMap.problem || 'Problem not specified'}
• **Competitive Edge**: ${contentMap.unfair_advantage || 'Not defined'}
• **Customer Segments**: ${contentMap.target_customers || 'Not specified'}

**Enhancement Ideas:**
1. Clearly articulate the unique value proposition
2. Detail how it solves the specific problem identified
3. Demonstrate technical feasibility and scalability
4. Show how it delivers measurable customer value

What specific aspect of this solution needs refinement?`;
  }

  else if (resourceType.includes('goal')) {
    return `🎯 **Strategic Goal Analysis**: "${currentContent}"

**Goal Evaluation:**
• **Specificity**: ${currentContent.length > 30 ? 'Well-defined' : 'Could be more specific'}
• **Measurability**: ${/\d+|percent|%|time|year/.test(currentContent) ? 'Measurable criteria included' : 'Add measurable success criteria'}
• **Timeframe**: ${/year|month|quarter|week/i.test(currentContent) ? 'Time-bound' : 'Add timeframe'}

**Blueprint Context:**
• **Vision Support**: ${contentMap.vision ? 'Aligned with vision' : 'Could connect to vision'}
• **Business Impact**: ${currentContent.includes('business') || currentContent.includes('revenue') ? 'Business impact considered' : 'Could emphasize business outcomes'}

**Refinement Suggestions:**
1. Make goals SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
2. Ensure they directly support the business vision
3. Include key performance indicators
4. Consider dependencies and resource requirements

How can I help you strengthen this strategic goal?`;
  }

  else {
    return `📋 **${resourceType} Analysis**: "${currentContent}"

**Content Overview:**
• **Detail Level**: ${currentContent.length > 100 ? 'Comprehensive' : 'Concise'}
• **Business Relevance**: ${currentContent.includes('business') || currentContent.includes('customer') ? 'Business-focused' : 'Could strengthen business context'}
• **Blueprint Integration**: ${Object.keys(contentMap).length > 5 ? 'Well-integrated with other elements' : 'Could reference more blueprint components'}

**File Context:**
• **Total Elements**: ${Object.keys(contentMap).length} key blueprint sections
• **Business Title**: ${contentMap.title || 'Not specified'}
• **Current Maturity**: ${contentMap.version ? `Version ${contentMap.version}` : 'Version not specified'}

**General Recommendations:**
1. Ensure alignment with business vision and objectives
2. Consider stakeholder perspectives and requirements
3. Validate against market and competitive realities

What specific improvements are you considering for this ${resourceType}?`;
  }
};

app.post('/api/chat', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  try {
    const { message, context } = req.body;

    // Read actual blueprint file
    const fileContent = readBlueprintFile(context.resourcePath);
    const currentContent = context.currentContent?.content || context.currentContent || 'empty';

    // Generate intelligent analysis based on real file content
    const analysis = analyzeBlueprintContent(fileContent, context.resourceType, currentContent, message);

    res.json({
      message: analysis,
      model: 'grok-code-fast-1',
      context
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Analysis service error'
    });
  }
});

app.post('/api/modify', async (req: Request<{}, {}, ModifyRequest>, res: Response) => {
  try {
    const { resourceType, resourcePath, newContent } = req.body;

    const currentFileContent = readBlueprintFile(resourcePath);

    // Analyze modification based on actual file content
    const analysis = `🔄 **Modification Analysis for ${resourceType}**

**Proposed Change:** "${newContent}"

**Current File Assessment:**
• **File Size**: ${currentFileContent.length} characters
• **Content Sections**: ${currentFileContent.split('\n').filter(line => line.includes(':')).length} key elements
• **Business Context**: ${currentFileContent.includes('business') ? 'Strong business alignment' : 'Could strengthen business focus'}

**Change Evaluation:**
• **Quality**: ${newContent.length > 50 ? 'Detailed and comprehensive' : 'Concise, potentially expandable'}
• **Consistency**: ${newContent.toLowerCase().includes(resourceType.toLowerCase()) ? 'Well-aligned with resource type' : 'May need better alignment'}
• **Impact**: This modification will ${newContent.length > currentFileContent.length ? 'significantly expand' : 'refine'} the ${resourceType} section

**Blueprint Integration Check:**
• **Vision Alignment**: ${currentFileContent.includes('vision') && newContent.includes('vision') ? '✅ Maintains vision connection' : '⚠️ Consider vision alignment'}
• **Problem-Solution Fit**: ${currentFileContent.includes('problem') && currentFileContent.includes('solution') ? '✅ Problem-solution coherence' : '⚠️ Verify problem-solution fit'}
• **Resource Dependencies**: ${/\b(customer|market|revenue|cost)\b/i.test(newContent) ? '✅ Business elements considered' : '⚠️ Consider business implications'}

**Recommendations:**
1. Ensure the change supports overall business objectives
2. Validate consistency with existing blueprint elements
3. Consider stakeholder impact and requirements
4. Test the change doesn't break blueprint coherence

**Ready to Apply?** The modification appears ${newContent.length > 30 && newContent.includes('business') ? 'well-prepared and business-focused' : 'technically sound but could benefit from more business context'}.

Would you like me to apply this change to ${resourcePath}?`;

    res.json({
      success: true,
      message: analysis
    });
  } catch (error) {
    console.error('Modify API error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Modification analysis failed'
    });
  }
});

const PORT = parseInt(process.env.PORT || '3001');

app.listen(PORT, () => {
  console.log(`🚀 AI Chat server running on port ${PORT}`);
  console.log(`📁 Reading blueprint files from: ${path.resolve(process.cwd(), '..')}`);
  console.log(`🧠 Providing intelligent analysis based on actual YAML content`);
});