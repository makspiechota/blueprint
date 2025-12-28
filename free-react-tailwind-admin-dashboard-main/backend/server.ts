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

// Ensure YAML directory exists
if (!fs.existsSync(yamlDir)) {
  fs.mkdirSync(yamlDir, { recursive: true });
}

// CRUD Routes for YAML files

// GET /api/yaml/:filename - Read a YAML file
app.get('/api/yaml/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(yamlDir, filename);

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

// PUT /api/yaml/:filename - Update a YAML file
app.put('/api/yaml/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }

    const filePath = path.join(yamlDir, filename);

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

// POST /api/yaml/:filename - Create a new YAML file
app.post('/api/yaml/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }

    const filePath = path.join(yamlDir, filename);

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

// DELETE /api/yaml/:filename - Delete a YAML file
app.delete('/api/yaml/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(yamlDir, filename);

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

// GET /api/yaml - List all YAML files
app.get('/api/yaml', (req, res) => {
  try {
    const files = fs.readdirSync(yamlDir)
      .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
      .map(file => ({
        name: file,
        path: `/api/yaml/${file}`
      }));

    res.json({ files });
  } catch (error) {
    console.error('Error listing YAML files:', error);
    res.status(500).json({ error: 'Failed to list files' });
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