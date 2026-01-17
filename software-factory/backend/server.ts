import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
const PORT = process.env.PORT || 3005;
const WS_PORT = process.env.WS_PORT || 8085;

// Middleware
app.use(cors());
app.use(express.json());

// Data directories
const dataDir = path.join(__dirname, 'src', 'data');
const workflowsDir = path.join(dataDir, 'workflows');

// Ensure directories exist
if (!fs.existsSync(workflowsDir)) {
  fs.mkdirSync(workflowsDir, { recursive: true });
}

// ===========================================
// Types
// ===========================================

interface Position {
  x: number;
  y: number;
}

interface AgentNode {
  id: string;
  type: 'start' | 'end' | 'agent' | 'condition';
  label: string;
  position: Position;
  provider?: 'claudeCode' | 'openCode' | 'claudeCodeWithFallback';
  prompt?: string;
  config?: Record<string, unknown>;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: string;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
  updated_at: string;
  nodes: AgentNode[];
  edges: WorkflowEdge[];
}

interface ExecutionEvent {
  type: string;
  workflowId: string;
  executionId?: string;
  nodeId?: string;
  status?: string;
  output?: string;
  error?: string;
  timestamp: string;
}

// ===========================================
// WebSocket Server
// ===========================================

const wss = new WebSocketServer({ port: Number(WS_PORT) });
const clients: Set<WebSocket> = new Set();

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected to Factory WebSocket');
  clients.add(ws);

  ws.on('close', () => {
    console.log('Client disconnected from Factory WebSocket');
    clients.delete(ws);
  });

  ws.on('error', (error: Error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

const broadcast = (event: ExecutionEvent) => {
  const message = JSON.stringify(event);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// ===========================================
// Helper Functions
// ===========================================

const getWorkflowPath = (id: string) => path.join(workflowsDir, `${id}.yaml`);

const loadWorkflow = (id: string): Workflow | null => {
  const filePath = getWorkflowPath(id);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.load(content) as Workflow;
};

const saveWorkflow = (workflow: Workflow) => {
  const filePath = getWorkflowPath(workflow.id);
  fs.writeFileSync(filePath, yaml.dump(workflow), 'utf8');
};

const listWorkflows = (): Workflow[] => {
  if (!fs.existsSync(workflowsDir)) {
    return [];
  }
  const files = fs.readdirSync(workflowsDir).filter((f) => f.endsWith('.yaml'));
  return files.map((file) => {
    const content = fs.readFileSync(path.join(workflowsDir, file), 'utf8');
    return yaml.load(content) as Workflow;
  });
};

// ===========================================
// Workflow CRUD API
// ===========================================

// List all workflows
app.get('/api/workflows', (_req, res) => {
  try {
    const workflows = listWorkflows();
    res.json({ data: workflows });
  } catch (error) {
    console.error('Error listing workflows:', error);
    res.status(500).json({ error: 'Failed to list workflows' });
  }
});

// Get a specific workflow
app.get('/api/workflows/:id', (req, res) => {
  try {
    const workflow = loadWorkflow(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json({ data: workflow });
  } catch (error) {
    console.error('Error reading workflow:', error);
    res.status(500).json({ error: 'Failed to read workflow' });
  }
});

// Create a new workflow
app.post('/api/workflows', (req, res) => {
  try {
    const { name, description, nodes, edges } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Workflow name is required' });
    }

    const id = `workflow-${Date.now()}`;
    const now = new Date().toISOString();

    const workflow: Workflow = {
      id,
      name,
      description: description || '',
      version: '1.0',
      status: 'draft',
      created_at: now,
      updated_at: now,
      nodes: nodes || [
        { id: 'start', type: 'start', label: 'Start', position: { x: 250, y: 0 } },
        { id: 'end', type: 'end', label: 'End', position: { x: 250, y: 300 } },
      ],
      edges: edges || [],
    };

    saveWorkflow(workflow);
    res.status(201).json({ data: workflow });
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// Update a workflow
app.put('/api/workflows/:id', (req, res) => {
  try {
    const existing = loadWorkflow(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const updated: Workflow = {
      ...existing,
      ...req.body,
      id: existing.id, // Prevent ID change
      created_at: existing.created_at, // Prevent creation date change
      updated_at: new Date().toISOString(),
    };

    saveWorkflow(updated);

    // Broadcast update event
    broadcast({
      type: 'workflow_updated',
      workflowId: updated.id,
      timestamp: updated.updated_at,
    });

    res.json({ data: updated });
  } catch (error) {
    console.error('Error updating workflow:', error);
    res.status(500).json({ error: 'Failed to update workflow' });
  }
});

// Delete a workflow
app.delete('/api/workflows/:id', (req, res) => {
  try {
    const filePath = getWorkflowPath(req.params.id);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Workflow deleted' });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
});

// ===========================================
// Workflow Execution API
// ===========================================

// Execute a workflow (placeholder - actual execution engine not implemented)
app.post('/api/workflows/:id/execute', (req, res) => {
  try {
    const workflow = loadWorkflow(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const executionId = `exec-${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Broadcast execution started
    broadcast({
      type: 'execution_started',
      workflowId: workflow.id,
      executionId,
      timestamp,
    });

    // Simulate step execution (placeholder)
    const agentNodes = workflow.nodes.filter((n) => n.type === 'agent');

    agentNodes.forEach((node, index) => {
      setTimeout(() => {
        broadcast({
          type: 'node_started',
          workflowId: workflow.id,
          executionId,
          nodeId: node.id,
          timestamp: new Date().toISOString(),
        });

        // Simulate node completion
        setTimeout(() => {
          broadcast({
            type: 'node_completed',
            workflowId: workflow.id,
            executionId,
            nodeId: node.id,
            status: 'success',
            output: `Simulated output from ${node.label}`,
            timestamp: new Date().toISOString(),
          });

          // If last node, send execution completed
          if (index === agentNodes.length - 1) {
            setTimeout(() => {
              broadcast({
                type: 'execution_completed',
                workflowId: workflow.id,
                executionId,
                status: 'success',
                timestamp: new Date().toISOString(),
              });
            }, 500);
          }
        }, 1000);
      }, index * 2000);
    });

    res.json({
      data: {
        executionId,
        workflowId: workflow.id,
        workflowName: workflow.name,
        status: 'started',
        startedAt: timestamp,
        message: 'Workflow execution started (simulated)',
      },
    });
  } catch (error) {
    console.error('Error executing workflow:', error);
    res.status(500).json({ error: 'Failed to execute workflow' });
  }
});

// List executions (placeholder)
app.get('/api/executions', (_req, res) => {
  res.json({
    data: [],
    message: 'Execution history not implemented yet'
  });
});

// ===========================================
// Agent Templates API
// ===========================================

const defaultTemplates = [
  {
    id: 'analyze-requirements',
    name: 'Analyze Requirements',
    description: 'Analyze user story and extract technical requirements',
    provider: 'claudeCode',
    prompt: 'Analyze the following user story and extract technical requirements:\n\n{{input}}',
    category: 'analysis',
  },
  {
    id: 'generate-code',
    name: 'Generate Code',
    description: 'Generate implementation code based on requirements',
    provider: 'claudeCode',
    prompt: 'Generate implementation code for the following requirements:\n\n{{input}}',
    category: 'implementation',
  },
  {
    id: 'write-tests',
    name: 'Write Tests',
    description: 'Write unit and integration tests for the code',
    provider: 'claudeCode',
    prompt: 'Write comprehensive tests for the following code:\n\n{{input}}',
    category: 'testing',
  },
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Review code for quality, security, and best practices',
    provider: 'claudeCodeWithFallback',
    prompt: 'Review the following code for quality, security issues, and suggest improvements:\n\n{{input}}',
    category: 'review',
  },
  {
    id: 'refactor-code',
    name: 'Refactor Code',
    description: 'Refactor code for better readability and maintainability',
    provider: 'claudeCode',
    prompt: 'Refactor the following code for better readability and maintainability:\n\n{{input}}',
    category: 'refactoring',
  },
  {
    id: 'fix-bug',
    name: 'Fix Bug',
    description: 'Analyze and fix a bug in the code',
    provider: 'claudeCodeWithFallback',
    prompt: 'Analyze and fix the following bug:\n\nBug description: {{bug_description}}\n\nCode:\n{{input}}',
    category: 'debugging',
  },
];

app.get('/api/templates', (_req, res) => {
  res.json({ data: defaultTemplates });
});

app.get('/api/templates/:id', (req, res) => {
  const template = defaultTemplates.find((t) => t.id === req.params.id);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json({ data: template });
});

// ===========================================
// Provider Configuration API
// ===========================================

const providers = [
  {
    id: 'claudeCode',
    name: 'Claude Code',
    description: 'Anthropic Claude Code CLI agent',
    status: 'available',
    config: {
      command: 'claude',
      flags: ['-p'],
    },
  },
  {
    id: 'openCode',
    name: 'OpenCode',
    description: 'OpenCode AI coding agent',
    status: 'available',
    config: {
      sdk: '@opencode-ai/sdk',
    },
  },
  {
    id: 'claudeCodeWithFallback',
    name: 'Claude Code + Fallback',
    description: 'Claude Code with OpenCode fallback on rate limits',
    status: 'available',
    config: {
      primary: 'claudeCode',
      fallback: 'openCode',
    },
  },
];

app.get('/api/providers', (_req, res) => {
  res.json({ data: providers });
});

// ===========================================
// Health Check
// ===========================================

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'software-factory',
    port: PORT,
    wsPort: WS_PORT,
    timestamp: new Date().toISOString(),
  });
});

// ===========================================
// Start Server
// ===========================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           Software Factory Backend                            ║
╠═══════════════════════════════════════════════════════════════╣
║  REST API:    http://localhost:${PORT}                          ║
║  WebSocket:   ws://localhost:${WS_PORT}                           ║
║  Workflows:   ${workflowsDir}
╚═══════════════════════════════════════════════════════════════╝
  `);
});
