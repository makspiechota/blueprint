const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const WebSocketServer = require('ws');
const chokidar = require('chokidar');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to YAML files
const yamlDir = path.join(process.cwd(), 'src', 'data');

// Path to misc markdown files
const miscDir = path.join(process.cwd(), 'src', 'data', 'misc');

// Ensure directories exist
if (!fs.existsSync(yamlDir)) {
  fs.mkdirSync(yamlDir, { recursive: true });
}
if (!fs.existsSync(miscDir)) {
  fs.mkdirSync(miscDir, { recursive: true });
}

// CRUD Routes for YAML files

// GET /api/yaml/:productName/:filename - Read a YAML file
app.get('/api/yaml/:productName/:filename', (req, res) => {
  try {
    const { productName, filename } = req.params;
    const filePath = path.join(yamlDir, productName, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContent);

    res.json({ data });
  } catch (error) {
    console.error('Error reading YAML file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// PUT /api/yaml/:productName/:filename - Update a YAML file
app.put('/api/yaml/:productName/:filename', (req, res) => {
  try {
    const { productName, filename } = req.params;
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }

    const filePath = path.join(yamlDir, productName, filename);

    // Check if data is already a YAML string or needs to be dumped
    let yamlContent;
    let parsedData;
    if (typeof data === 'string') {
      // Assume it's already YAML content, parse it to get the object
      parsedData = yaml.load(data);
      yamlContent = data;
    } else {
      // Data is already an object
      parsedData = data;
      yamlContent = yaml.dump(data);
    }

    fs.writeFileSync(filePath, yamlContent, 'utf8');

    // Broadcast the update to all connected WebSocket clients
    broadcastUpdate(filename, parsedData);

    res.json({ success: true, message: 'File updated successfully' });
  } catch (error) {
    console.error('Error writing YAML file:', error);
    res.status(500).json({ error: 'Failed to write file' });
  }
});

// POST /api/yaml/:productName/:filename - Create a new YAML file
app.post('/api/yaml/:productName/:filename', (req, res) => {
  try {
    const { productName, filename } = req.params;
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }

    const filePath = path.join(yamlDir, productName, filename);

    if (fs.existsSync(filePath)) {
      return res.status(409).json({ error: 'File already exists' });
    }

    const yamlContent = yaml.dump(data);
    fs.writeFileSync(filePath, yamlContent, 'utf8');

    res.json({ success: true, message: 'File created successfully' });
  } catch (error) {
    console.error('Error creating YAML file:', error);
    res.status(500).json({ error: 'Failed to create file' });
  }
});

// DELETE /api/yaml/:productName/:filename - Delete a YAML file
app.delete('/api/yaml/:productName/:filename', (req, res) => {
  try {
    const { productName, filename } = req.params;
    const filePath = path.join(yamlDir, productName, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlinkSync(filePath);

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting YAML file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// GET /api/yaml/:productName - List all YAML files for a product
app.get('/api/yaml/:productName', (req, res) => {
  try {
    const { productName } = req.params;
    const productDir = path.join(yamlDir, productName);
    if (!fs.existsSync(productDir)) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const files = fs.readdirSync(productDir)
      .filter(file => file.endsWith('.yaml'))
      .map(file => ({
        name: file,
        path: `/api/yaml/${productName}/${file}`
      }));

    res.json({ files });
  } catch (error) {
    console.error('Error listing YAML files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// ==================
// Misc Markdown Files API
// ==================

// GET /api/misc - List all misc markdown files
app.get('/api/misc', (req, res) => {
  try {
    const files = fs.readdirSync(miscDir)
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        name: file,
        path: `/api/misc/${encodeURIComponent(file)}`
      }));

    res.json({ files });
  } catch (error) {
    console.error('Error listing misc files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// GET /api/misc/:filename - Read a misc markdown file
app.get('/api/misc/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(miscDir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(miscDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ filename, content });
  } catch (error) {
    console.error('Error reading misc file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// PUT /api/misc/:filename - Update a misc markdown file
app.put('/api/misc/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const { content } = req.body;

    if (content === undefined) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const filePath = path.join(miscDir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(miscDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    fs.writeFileSync(filePath, content, 'utf8');
    res.json({ success: true, message: 'File updated successfully' });
  } catch (error) {
    console.error('Error writing misc file:', error);
    res.status(500).json({ error: 'Failed to write file' });
  }
});

// POST /api/misc/:filename - Create a new misc markdown file
app.post('/api/misc/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const { content } = req.body;

    if (!filename.endsWith('.md')) {
      return res.status(400).json({ error: 'Filename must end with .md' });
    }

    const filePath = path.join(miscDir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(miscDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (fs.existsSync(filePath)) {
      return res.status(409).json({ error: 'File already exists' });
    }

    fs.writeFileSync(filePath, content || '', 'utf8');
    res.json({ success: true, message: 'File created successfully' });
  } catch (error) {
    console.error('Error creating misc file:', error);
    res.status(500).json({ error: 'Failed to create file' });
  }
});

// DELETE /api/misc/:filename - Delete a misc markdown file
app.delete('/api/misc/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(miscDir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(miscDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting misc file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// POST /api/generate - Generate layer content
app.post('/api/generate', (req, res) => {
  try {
    const { resourceType, resourceData } = req.body;

    if (!resourceType || !resourceData) {
      return res.status(400).json({ error: 'resourceType and resourceData are required' });
    }

    const { productName } = resourceData;

    if (!productName) {
      return res.status(400).json({ error: 'productName is required in resourceData' });
    }

    let fileName = '';
    let dummyContent = '';

    switch (resourceType) {
      case 'generate-north-star':
        fileName = 'north-star.yaml';
        dummyContent = `type: north-star
version: '1.0'
last_updated: '${new Date().toISOString().split('T')[0]}'
title: Generated North Star
vision: A vision generated by AI
problem: A problem generated by AI
solution: A solution generated by AI
strategic_goals:
  - title: Generated Goal
    description: This is a generated strategic goal
`;
        break;
      case 'generate-lean-canvas':
        fileName = 'lean-canvas.yaml';
        dummyContent = `type: lean-canvas
version: '1.0'
last_updated: '${new Date().toISOString().split('T')[0]}'
title: Generated Lean Canvas
key_metrics:
  activities_to_measure:
    - Generated metric
  annual_revenue_3_years_target:
    amount: 750000
    currency: USD
    timeframe: 3 years
problem:
  top_3_problems:
    - Generated problem
solution:
  top_3_features:
    - Generated feature
`;
        break;
      case 'generate-architectural-scope':
        fileName = 'architectural-scope.yaml';
        dummyContent = `type: architectural-scope
version: '1.0'
last_updated: '${new Date().toISOString().split('T')[0]}'
title: Generated Architectural Scope
why:
  mission:
    action: To provide
    service: Generated service
    beneficiary: Users
  goals:
    - title: Generated goal
      description: This is a generated goal
what:
  - title: Generated entity
    description: This is a generated what item
`;
        break;
      case 'generate-lean-viability':
        fileName = 'lean-viability.yaml';
        dummyContent = `type: lean-viability
version: '1.0'
last_updated: '${new Date().toISOString().split('T')[0]}'
title: Generated Lean Viability
time_horizon:
  duration: 3
  unit: years
calculations:
  annual_revenue_per_customer:
    amount: 3000
    currency: USD
  required_customers:
    count: 250
  funnel_targets:
    users_acquisition_target: 1000
    users_target: 100
    users_activation_target: 10
`;
        break;
      case 'generate-customers-factory':
        fileName = 'aaarr-metrics.yaml';
        dummyContent = `type: aaarr-metrics
version: '1.0'
last_updated: '${new Date().toISOString().split('T')[0]}'
title: Generated Customers Factory
stages:
  acquisition:
    stage_goal: Generated acquisition goal
    current:
      rate: 0.05
  activation:
    stage_goal: Generated activation goal
    current:
      rate: 0.1
  retention:
    stage_goal: Generated retention goal
    current:
      rate: 0.05
  revenue:
    stage_goal: Generated revenue goal
    current:
      amount: 750000
`;
        break;
      case 'generate-policy-charter':
        fileName = 'policy-charter.yaml';
        dummyContent = `type: policy-charter
version: '1.0'
last_updated: '${new Date().toISOString().split('T')[0]}'
title: Generated Policy Charter
policies:
  - title: Generated policy
    description: This is a generated policy
`;
        break;
      default:
        return res.status(400).json({ error: 'Unknown resourceType' });
    }

    const filePath = path.join(__dirname, 'src/data', productName, fileName);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, dummyContent, 'utf8');

    // Broadcast update
    broadcastUpdate(path.relative(path.join(__dirname, 'src/data'), filePath), yaml.load(dummyContent));

    res.json({ success: true, message: 'Layer generated successfully' });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Failed to generate layer' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// WebSocket server for real-time updates
const wss = new WebSocketServer.Server({ port: 8080 });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('WebSocket client connected');

  ws.on('close', () => {
    clients.delete(ws);
    console.log('WebSocket client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Function to broadcast updates to all connected clients
const broadcastUpdate = (filename, data) => {
  const message = JSON.stringify({
    type: 'file_update',
    filename,
    data,
    timestamp: new Date().toISOString()
  });

  clients.forEach((client: any) => {
    if (client.readyState === 1) { // OPEN state
      client.send(message);
    }
  });
};

// File watcher for real-time updates when files are changed externally
const watcher = chokidar.watch(yamlDir, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true, // don't trigger on startup
});

watcher.on('change', (filePath) => {
  try {
    const filename = path.basename(filePath);
    if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContent);

      console.log(`File ${filename} changed externally, broadcasting update`);
      broadcastUpdate(filename, data);
    }
  } catch (error) {
    console.error('Error processing file change:', error);
  }
});

watcher.on('add', (filePath) => {
  try {
    const filename = path.basename(filePath);
    if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContent);

      console.log(`File ${filename} added, broadcasting update`);
      broadcastUpdate(filename, data);
    }
  } catch (error) {
    console.error('Error processing file add:', error);
  }
});

watcher.on('unlink', (filePath) => {
  const filename = path.basename(filePath);
  if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
    console.log(`File ${filename} deleted, broadcasting removal`);
    const message = JSON.stringify({
      type: 'file_delete',
      filename,
      timestamp: new Date().toISOString()
    });

    clients.forEach((client: any) => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`YAML CRUD server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:8080`);
});