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



// ==================
// C4 Architecture Files API
// ==================

// GET /api/c4/:productName - List all C4 files for a product
app.get('/api/c4/:productName', (req, res) => {
  try {
    const { productName } = req.params;
    const c4Dir = path.join(yamlDir, productName, 'c4');

    if (!fs.existsSync(c4Dir)) {
      // Create directory if it doesn't exist
      fs.mkdirSync(c4Dir, { recursive: true });
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(c4Dir)
      .filter(file => file.endsWith('.likec4') || file.endsWith('.c4'))
      .map(file => ({
        name: file,
        path: `/api/c4/${productName}/${file}`
      }));

    res.json({ files });
  } catch (error) {
    console.error('Error listing C4 files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// GET /api/c4/:productName/:filename - Read a C4 file
app.get('/api/c4/:productName/:filename', (req, res) => {
  try {
    const { productName, filename } = req.params;
    const c4Dir = path.join(yamlDir, productName, 'c4');
    const filePath = path.join(c4Dir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(c4Dir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ filename, content });
  } catch (error) {
    console.error('Error reading C4 file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// PUT /api/c4/:productName/:filename - Update a C4 file
app.put('/api/c4/:productName/:filename', (req, res) => {
  try {
    const { productName, filename } = req.params;
    const { content } = req.body;

    if (content === undefined) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const c4Dir = path.join(yamlDir, productName, 'c4');
    const filePath = path.join(c4Dir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(c4Dir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Ensure directory exists
    if (!fs.existsSync(c4Dir)) {
      fs.mkdirSync(c4Dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf8');
    res.json({ success: true, message: 'File updated successfully' });
  } catch (error) {
    console.error('Error writing C4 file:', error);
    res.status(500).json({ error: 'Failed to write file' });
  }
});

// POST /api/c4/:productName/:filename - Create a new C4 file
app.post('/api/c4/:productName/:filename', (req, res) => {
  try {
    const { productName, filename } = req.params;
    const { content } = req.body;

    if (!filename.endsWith('.likec4') && !filename.endsWith('.c4')) {
      return res.status(400).json({ error: 'Filename must end with .likec4 or .c4' });
    }

    const c4Dir = path.join(yamlDir, productName, 'c4');
    const filePath = path.join(c4Dir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(c4Dir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Ensure directory exists
    if (!fs.existsSync(c4Dir)) {
      fs.mkdirSync(c4Dir, { recursive: true });
    }

    if (fs.existsSync(filePath)) {
      return res.status(409).json({ error: 'File already exists' });
    }

    fs.writeFileSync(filePath, content || '', 'utf8');
    res.json({ success: true, message: 'File created successfully' });
  } catch (error) {
    console.error('Error creating C4 file:', error);
    res.status(500).json({ error: 'Failed to create file' });
  }
});

// DELETE /api/c4/:productName/:filename - Delete a C4 file
app.delete('/api/c4/:productName/:filename', (req, res) => {
  try {
    const { productName, filename } = req.params;
    const c4Dir = path.join(yamlDir, productName, 'c4');
    const filePath = path.join(c4Dir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(c4Dir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting C4 file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Serve schemas
app.get('/schemas/:type.yaml', (req, res) => {
  try {
    const { type } = req.params;
    const filePath = path.join(__dirname, 'src/schemas', `${type}.yaml`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Schema not found' });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Schema serve error:', error);
    res.status(500).json({ error: 'Failed to serve schema' });
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

// Function to broadcast C4 file updates
const broadcastC4Update = (productName, filename, content) => {
  const message = JSON.stringify({
    type: 'c4_update',
    productName,
    filename,
    content,
    timestamp: new Date().toISOString()
  });

  clients.forEach((client: any) => {
    if (client.readyState === 1) {
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

    // Handle YAML files
    if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContent);

      console.log(`File ${filename} changed externally, broadcasting update`);
      broadcastUpdate(filename, data);
    }

    // Handle LikeC4 files
    if (filename.endsWith('.likec4')) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      // Extract productName from path: yamlDir/productName/c4/filename.likec4
      const relativePath = path.relative(yamlDir, filePath);
      const parts = relativePath.split(path.sep);
      if (parts.length >= 3 && parts[1] === 'c4') {
        const productName = parts[0];
        console.log(`C4 file ${filename} changed externally, broadcasting update for ${productName}`);
        broadcastC4Update(productName, filename, fileContent);
      }
    }
  } catch (error) {
    console.error('Error processing file change:', error);
  }
});

watcher.on('add', (filePath) => {
  try {
    const filename = path.basename(filePath);

    // Handle YAML files
    if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContent);

      console.log(`File ${filename} added, broadcasting update`);
      broadcastUpdate(filename, data);
    }

    // Handle LikeC4 files
    if (filename.endsWith('.likec4')) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(yamlDir, filePath);
      const parts = relativePath.split(path.sep);
      if (parts.length >= 3 && parts[1] === 'c4') {
        const productName = parts[0];
        console.log(`C4 file ${filename} added, broadcasting update for ${productName}`);
        broadcastC4Update(productName, filename, fileContent);
      }
    }
  } catch (error) {
    console.error('Error processing file add:', error);
  }
});

watcher.on('unlink', (filePath) => {
  const filename = path.basename(filePath);

  // Handle YAML files
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

  // Handle LikeC4 files
  if (filename.endsWith('.likec4')) {
    const relativePath = path.relative(yamlDir, filePath);
    const parts = relativePath.split(path.sep);
    if (parts.length >= 3 && parts[1] === 'c4') {
      const productName = parts[0];
      console.log(`C4 file ${filename} deleted, broadcasting removal for ${productName}`);
      const message = JSON.stringify({
        type: 'c4_delete',
        productName,
        filename,
        timestamp: new Date().toISOString()
      });

      clients.forEach((client: any) => {
        if (client.readyState === 1) {
          client.send(message);
        }
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`YAML CRUD server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:8080`);
});