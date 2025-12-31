const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { execSync } = require('child_process');
const WebSocketServer = require('ws');
const chokidar = require('chokidar');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to YAML files
const yamlDir = path.join(process.cwd(), 'src', 'data');

// Helper to get misc directory for a product
const getMiscDir = (productName: string) => path.join(yamlDir, productName, 'misc');

// Ensure directories exist
if (!fs.existsSync(yamlDir)) {
  fs.mkdirSync(yamlDir, { recursive: true });
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

    // Validate YAML against schema
    const tempFile = path.join(__dirname, 'temp.yaml');
    fs.writeFileSync(tempFile, yamlContent, 'utf8');
    const schemaFile = path.join(__dirname, 'src/schemas', filename);
    try {
      execSync(`node validate-yaml.cjs ${tempFile} ${schemaFile}`, { stdio: 'pipe' });
    } catch (error) {
      fs.unlinkSync(tempFile);
      return res.status(400).json({ error: 'YAML validation failed: ' + (error.stderr?.toString() || error.message) });
    }
    fs.unlinkSync(tempFile);

    fs.writeFileSync(filePath, yamlContent, 'utf8');

    // Broadcast the update to all connected WebSocket clients
    broadcastUpdate(filename, parsedData, productName);

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

    // Validate YAML against schema
    const tempFile = path.join(__dirname, 'temp.yaml');
    fs.writeFileSync(tempFile, yamlContent, 'utf8');
    const schemaFile = path.join(__dirname, 'src/schemas', filename);
    try {
      execSync(`node validate-yaml.cjs ${tempFile} ${schemaFile}`, { stdio: 'pipe' });
    } catch (error) {
      fs.unlinkSync(tempFile);
      return res.status(400).json({ error: 'YAML validation failed: ' + (error.stderr?.toString() || error.message) });
    }
    fs.unlinkSync(tempFile);

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

// GET /api/misc/:productName - List all misc markdown files for a product
app.get('/api/misc/:productName', (req, res) => {
  try {
    const { productName } = req.params;
    const miscDir = getMiscDir(productName);

    // Ensure directory exists
    if (!fs.existsSync(miscDir)) {
      fs.mkdirSync(miscDir, { recursive: true });
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(miscDir)
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        name: file,
        path: `/api/misc/${productName}/${encodeURIComponent(file)}`
      }));

    res.json({ files });
  } catch (error) {
    console.error('Error listing misc files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// GET /api/misc/:productName/:filename - Read a misc markdown file
app.get('/api/misc/:productName/:filename', (req, res) => {
  try {
    const { productName, filename } = req.params;
    const miscDir = getMiscDir(productName);
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

// PUT /api/misc/:productName/:filename - Update a misc markdown file
app.put('/api/misc/:productName/:filename', (req, res) => {
  try {
    const { productName, filename } = req.params;
    const { content } = req.body;

    if (content === undefined) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const miscDir = getMiscDir(productName);
    const filePath = path.join(miscDir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(miscDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Ensure directory exists
    if (!fs.existsSync(miscDir)) {
      fs.mkdirSync(miscDir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf8');
    res.json({ success: true, message: 'File updated successfully' });
  } catch (error) {
    console.error('Error writing misc file:', error);
    res.status(500).json({ error: 'Failed to write file' });
  }
});

// POST /api/misc/:productName/:filename - Create a new misc markdown file
app.post('/api/misc/:productName/:filename', (req, res) => {
  try {
    const { productName, filename } = req.params;
    const { content } = req.body;

    if (!filename.endsWith('.md')) {
      return res.status(400).json({ error: 'Filename must end with .md' });
    }

    const miscDir = getMiscDir(productName);
    const filePath = path.join(miscDir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(miscDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Ensure directory exists
    if (!fs.existsSync(miscDir)) {
      fs.mkdirSync(miscDir, { recursive: true });
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

// DELETE /api/misc/:productName/:filename - Delete a misc markdown file
app.delete('/api/misc/:productName/:filename', (req, res) => {
  try {
    const { productName, filename } = req.params;
    const miscDir = getMiscDir(productName);
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

    // Broadcast the update to all connected WebSocket clients
    broadcastC4Update(productName, filename, content);

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

    // Broadcast the update to all connected WebSocket clients
    broadcastC4Update(productName, filename, content || '');

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

// ==================
// Roadmap API (Aggregated Hierarchy)
// ==================

// Helper function to recursively load roadmap hierarchy
const loadRoadmapHierarchy = (productName: string) => {
  const roadmapDir = path.join(yamlDir, productName, 'roadmap');
  const roadmapFile = path.join(roadmapDir, 'roadmap.yaml');

  if (!fs.existsSync(roadmapFile)) {
    return null;
  }

  const roadmapContent = fs.readFileSync(roadmapFile, 'utf8');
  const roadmap = yaml.load(roadmapContent) as any;

  // Load each epic
  if (roadmap.epics) {
    roadmap.epics = roadmap.epics.map((epicRef: any) => {
      if (epicRef.path) {
        const epicPath = path.join(roadmapDir, epicRef.path.replace('./', ''));
        if (fs.existsSync(epicPath)) {
          const epicContent = fs.readFileSync(epicPath, 'utf8');
          const epic = yaml.load(epicContent) as any;
          const epicDir = path.dirname(epicPath);

          // Load each feature within the epic
          if (epic.features) {
            epic.features = epic.features.map((featureRef: any) => {
              if (featureRef.path) {
                const featurePath = path.join(epicDir, featureRef.path.replace('./', ''));
                if (fs.existsSync(featurePath)) {
                  const featureContent = fs.readFileSync(featurePath, 'utf8');
                  const feature = yaml.load(featureContent) as any;
                  const featureDir = path.dirname(featurePath);

                  // Load each user story within the feature
                  if (feature.user_stories) {
                    feature.user_stories = feature.user_stories.map((storyRef: any) => {
                      if (storyRef.path) {
                        const storyPath = path.join(featureDir, storyRef.path.replace('./', ''));
                        if (fs.existsSync(storyPath)) {
                          const storyContent = fs.readFileSync(storyPath, 'utf8');
                          const story = yaml.load(storyContent) as any;
                          const storyDir = path.dirname(storyPath);

                          // Load each task within the user story
                          if (story.tasks) {
                            story.tasks = story.tasks.map((taskRef: any) => {
                              if (taskRef.path) {
                                const taskPath = path.join(storyDir, taskRef.path.replace('./', ''));
                                if (fs.existsSync(taskPath)) {
                                  const taskContent = fs.readFileSync(taskPath, 'utf8');
                                  const task = yaml.load(taskContent) as any;
                                  return { ...taskRef, ...task };
                                }
                              }
                              return taskRef;
                            });
                          }
                          return { ...storyRef, ...story };
                        }
                      }
                      return storyRef;
                    });
                  }
                  return { ...featureRef, ...feature };
                }
              }
              return featureRef;
            });
          }
          return { ...epicRef, ...epic };
        }
      }
      return epicRef;
    });
  }

  return roadmap;
};

// GET /api/roadmap/:productName - Get full roadmap hierarchy
app.get('/api/roadmap/:productName', (req, res) => {
  try {
    const { productName } = req.params;
    const roadmap = loadRoadmapHierarchy(productName);

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    res.json({ data: roadmap });
  } catch (error) {
    console.error('Error loading roadmap:', error);
    res.status(500).json({ error: 'Failed to load roadmap' });
  }
});

// PUT /api/roadmap/:productName - Save roadmap (flattened structure)
app.put('/api/roadmap/:productName', (req, res) => {
  try {
    const { productName } = req.params;
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }

    const roadmapDir = path.join(yamlDir, productName, 'roadmap');

    // Ensure roadmap directory exists
    if (!fs.existsSync(roadmapDir)) {
      fs.mkdirSync(roadmapDir, { recursive: true });
    }

    // Build roadmap.yaml with references to epics
    const roadmapYaml = {
      type: 'roadmap',
      productName: data.productName || productName,
      version: data.version || '1.0',
      last_updated: data.last_updated || new Date().toISOString().split('T')[0],
      title: data.title || 'Product Roadmap',
      description: data.description || '',
      epics: (data.epics || []).map((epic: any) => ({
        id: epic.id,
        name: epic.name,
        description: epic.description,
        priority: epic.priority,
        status: epic.status,
        target_quarter: epic.target_quarter,
        path: `./${epic.id}/epic.yaml`,
      })),
    };

    // Write roadmap.yaml
    fs.writeFileSync(
      path.join(roadmapDir, 'roadmap.yaml'),
      yaml.dump(roadmapYaml),
      'utf8'
    );

    // Write each epic and its children
    (data.epics || []).forEach((epic: any) => {
      const epicDir = path.join(roadmapDir, epic.id);
      if (!fs.existsSync(epicDir)) {
        fs.mkdirSync(epicDir, { recursive: true });
      }

      // Build epic.yaml
      const epicYaml = {
        type: 'epic',
        id: epic.id,
        productName: productName,
        version: '1.0',
        last_updated: new Date().toISOString().split('T')[0],
        name: epic.name,
        description: epic.description,
        status: epic.status,
        priority: epic.priority,
        target_quarter: epic.target_quarter,
        features: (epic.features || []).map((feature: any) => ({
          id: feature.id,
          name: feature.name,
          description: feature.description,
          priority: feature.priority,
          status: feature.status,
          path: `./${feature.id}/feature.yaml`,
        })),
      };

      fs.writeFileSync(
        path.join(epicDir, 'epic.yaml'),
        yaml.dump(epicYaml),
        'utf8'
      );

      // Write each feature
      (epic.features || []).forEach((feature: any) => {
        const featureDir = path.join(epicDir, feature.id);
        if (!fs.existsSync(featureDir)) {
          fs.mkdirSync(featureDir, { recursive: true });
        }

        const featureYaml = {
          type: 'feature',
          id: feature.id,
          productName: productName,
          version: '1.0',
          last_updated: new Date().toISOString().split('T')[0],
          name: feature.name,
          description: feature.description,
          status: feature.status,
          priority: feature.priority,
          user_stories: (feature.user_stories || []).map((story: any) => ({
            id: story.id,
            name: story.name,
            description: story.description,
            priority: story.priority,
            status: story.status,
            story_points: story.story_points,
            path: `./${story.id}/user-story.yaml`,
          })),
        };

        fs.writeFileSync(
          path.join(featureDir, 'feature.yaml'),
          yaml.dump(featureYaml),
          'utf8'
        );

        // Write each user story
        (feature.user_stories || []).forEach((story: any) => {
          const storyDir = path.join(featureDir, story.id);
          if (!fs.existsSync(storyDir)) {
            fs.mkdirSync(storyDir, { recursive: true });
          }

          const storyYaml = {
            type: 'user-story',
            id: story.id,
            productName: productName,
            version: '1.0',
            last_updated: new Date().toISOString().split('T')[0],
            name: story.name,
            description: story.description,
            status: story.status,
            priority: story.priority,
            story_points: story.story_points,
            tasks: (story.tasks || []).map((task: any) => ({
              id: task.id,
              name: task.name,
              path: `./${task.id}.yaml`,
            })),
          };

          fs.writeFileSync(
            path.join(storyDir, 'user-story.yaml'),
            yaml.dump(storyYaml),
            'utf8'
          );

          // Write each task
          (story.tasks || []).forEach((task: any) => {
            const taskYaml = {
              type: 'task',
              id: task.id,
              productName: productName,
              version: '1.0',
              last_updated: new Date().toISOString().split('T')[0],
              name: task.name,
              description: task.description,
              status: task.status,
              priority: task.priority,
              estimated_hours: task.estimated_hours,
            };

            fs.writeFileSync(
              path.join(storyDir, `${task.id}.yaml`),
              yaml.dump(taskYaml),
              'utf8'
            );
          });
        });
      });
    });

    res.json({ success: true, message: 'Roadmap saved successfully' });
  } catch (error) {
    console.error('Error saving roadmap:', error);
    res.status(500).json({ error: 'Failed to save roadmap' });
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

// ==================
// AI Agent Configuration API (No-Code Platform)
// ==================

// GET /api/agents/config - List all agent configurations
app.get('/api/agents/config', (req, res) => {
  try {
    const configDir = path.join(__dirname, 'src', 'agents', 'config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
      return res.json({ configs: [] });
    }

    const files = fs.readdirSync(configDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(configDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return {
          name: file.replace('.json', ''),
          ...content
        };
      });

    res.json({ configs: files });
  } catch (error) {
    console.error('Error listing agent configs:', error);
    res.status(500).json({ error: 'Failed to list configs' });
  }
});

// GET /api/agents/config/:name - Get specific agent configuration
app.get('/api/agents/config/:name', (req, res) => {
  try {
    const { name } = req.params;
    const configDir = path.join(__dirname, 'src', 'agents', 'config');
    const filePath = path.join(configDir, `${name}.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Config not found' });
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(content);
  } catch (error) {
    console.error('Error reading agent config:', error);
    res.status(500).json({ error: 'Failed to read config' });
  }
});

// PUT /api/agents/config/:name - Update agent configuration
app.put('/api/agents/config/:name', (req, res) => {
  try {
    const { name } = req.params;
    const { prompts, models, workflows } = req.body;

    if (!prompts || !models || !workflows) {
      return res.status(400).json({ error: 'Prompts, models, and workflows are required' });
    }

    const configDir = path.join(__dirname, 'src', 'agents', 'config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const config = {
      name,
      prompts,
      models,
      workflows,
      updatedAt: new Date().toISOString()
    };

    const filePath = path.join(configDir, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');

    res.json({ success: true, message: 'Config updated successfully' });
  } catch (error) {
    console.error('Error updating agent config:', error);
    res.status(500).json({ error: 'Failed to update config' });
  }
});

// POST /api/agents/config/:name - Create new agent configuration
app.post('/api/agents/config/:name', (req, res) => {
  try {
    const { name } = req.params;
    const { prompts, models, workflows } = req.body;

    if (!prompts || !models || !workflows) {
      return res.status(400).json({ error: 'Prompts, models, and workflows are required' });
    }

    const configDir = path.join(__dirname, 'src', 'agents', 'config');
    const filePath = path.join(configDir, `${name}.json`);

    if (fs.existsSync(filePath)) {
      return res.status(409).json({ error: 'Config already exists' });
    }

    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const config = {
      name,
      prompts,
      models,
      workflows,
      createdAt: new Date().toISOString()
    };

    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');

    res.json({ success: true, message: 'Config created successfully' });
  } catch (error) {
    console.error('Error creating agent config:', error);
    res.status(500).json({ error: 'Failed to create config' });
  }
});

// DELETE /api/agents/config/:name - Delete agent configuration
app.delete('/api/agents/config/:name', (req, res) => {
  try {
    const { name } = req.params;
    const configDir = path.join(__dirname, 'src', 'agents', 'config');
    const filePath = path.join(configDir, `${name}.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Config not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Config deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent config:', error);
    res.status(500).json({ error: 'Failed to delete config' });
  }
});

// ==================
// AI Monitoring and Alerting API
// ==================

// GET /api/monitoring/artifacts - List AI artifacts and performance metrics
app.get('/api/monitoring/artifacts', (req, res) => {
  try {
    const monitoringDir = path.join(__dirname, 'src', 'monitoring');
    if (!fs.existsSync(monitoringDir)) {
      fs.mkdirSync(monitoringDir, { recursive: true });
      return res.json({ artifacts: [] });
    }

    const files = fs.readdirSync(monitoringDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(monitoringDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return content;
      });

    res.json({ artifacts: files });
  } catch (error) {
    console.error('Error listing monitoring artifacts:', error);
    res.status(500).json({ error: 'Failed to list artifacts' });
  }
});

// POST /api/monitoring/artifacts - Log AI artifact performance
app.post('/api/monitoring/artifacts', (req, res) => {
  try {
    const { agentName, task, performance, metrics, timestamp } = req.body;

    if (!agentName || !task) {
      return res.status(400).json({ error: 'Agent name and task are required' });
    }

    const monitoringDir = path.join(__dirname, 'src', 'monitoring');
    if (!fs.existsSync(monitoringDir)) {
      fs.mkdirSync(monitoringDir, { recursive: true });
    }

    const artifactId = `${agentName}_${task}_${Date.now()}`;
    const artifact = {
      id: artifactId,
      agentName,
      task,
      performance,
      metrics,
      timestamp: timestamp || new Date().toISOString()
    };

    const filePath = path.join(monitoringDir, `${artifactId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(artifact, null, 2), 'utf8');

    res.json({ success: true, message: 'Artifact logged successfully', id: artifactId });
  } catch (error) {
    console.error('Error logging artifact:', error);
    res.status(500).json({ error: 'Failed to log artifact' });
  }
});

// GET /api/monitoring/alerts - Get monitoring alerts
app.get('/api/monitoring/alerts', (req, res) => {
  try {
    const alertsDir = path.join(__dirname, 'src', 'monitoring', 'alerts');
    if (!fs.existsSync(alertsDir)) {
      fs.mkdirSync(alertsDir, { recursive: true });
      return res.json({ alerts: [] });
    }

    const files = fs.readdirSync(alertsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(alertsDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return content;
      });

    res.json({ alerts: files });
  } catch (error) {
    console.error('Error listing alerts:', error);
    res.status(500).json({ error: 'Failed to list alerts' });
  }
});

// POST /api/monitoring/alerts - Create monitoring alert
app.post('/api/monitoring/alerts', (req, res) => {
  try {
    const { type, message, severity, agentName, task } = req.body;

    if (!type || !message) {
      return res.status(400).json({ error: 'Type and message are required' });
    }

    const alertsDir = path.join(__dirname, 'src', 'monitoring', 'alerts');
    if (!fs.existsSync(alertsDir)) {
      fs.mkdirSync(alertsDir, { recursive: true });
    }

    const alertId = `alert_${Date.now()}`;
    const alert = {
      id: alertId,
      type,
      message,
      severity: severity || 'info',
      agentName,
      task,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    const filePath = path.join(alertsDir, `${alertId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(alert, null, 2), 'utf8');

    res.json({ success: true, message: 'Alert created successfully', id: alertId });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// ==================
// SDLC Workflow Execution API (Engineering Excellence Integration)
// ==================

// GET /api/workflows - List available SDLC workflows
app.get('/api/workflows', (req, res) => {
  try {
    const workflowsDir = path.join(__dirname, 'src', 'workflows');
    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir, { recursive: true });
      return res.json({ workflows: [] });
    }

    const files = fs.readdirSync(workflowsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(workflowsDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return content;
      });

    res.json({ workflows: files });
  } catch (error) {
    console.error('Error listing workflows:', error);
    res.status(500).json({ error: 'Failed to list workflows' });
  }
});

// POST /api/workflows/execute - Execute SDLC workflow
app.post('/api/workflows/execute', (req, res) => {
  try {
    const { workflowName, context, agentConfig } = req.body;

    if (!workflowName) {
      return res.status(400).json({ error: 'Workflow name is required' });
    }

    const workflowsDir = path.join(__dirname, 'src', 'workflows');
    const workflowPath = path.join(workflowsDir, `${workflowName}.json`);

    if (!fs.existsSync(workflowPath)) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

    // Simulate workflow execution incorporating engineering fundamentals
    const execution = {
      id: `execution_${Date.now()}`,
      workflowName,
      status: 'running',
      steps: workflow.steps.map(step => ({
        ...step,
        status: 'pending',
        fundamentals: {
          xp: step.xp || false,
          trunkBasedDev: step.trunkBasedDev || false,
          featureFlags: step.featureFlags || false,
          monitoring: step.monitoring || false
        }
      })),
      context,
      agentConfig,
      startedAt: new Date().toISOString()
    };

    // Log execution start
    const executionsDir = path.join(__dirname, 'src', 'executions');
    if (!fs.existsSync(executionsDir)) {
      fs.mkdirSync(executionsDir, { recursive: true });
    }
    const executionPath = path.join(executionsDir, `${execution.id}.json`);
    fs.writeFileSync(executionPath, JSON.stringify(execution, null, 2), 'utf8');

    res.json({
      success: true,
      message: 'Workflow execution started',
      executionId: execution.id,
      status: 'running'
    });
  } catch (error) {
    console.error('Error executing workflow:', error);
    res.status(500).json({ error: 'Failed to execute workflow' });
  }
});

// GET /api/workflows/execution/:id - Get workflow execution status
app.get('/api/workflows/execution/:id', (req, res) => {
  try {
    const { id } = req.params;
    const executionsDir = path.join(__dirname, 'src', 'executions');
    const executionPath = path.join(executionsDir, `${id}.json`);

    if (!fs.existsSync(executionPath)) {
      return res.status(404).json({ error: 'Execution not found' });
    }

    const execution = JSON.parse(fs.readFileSync(executionPath, 'utf8'));
    res.json(execution);
  } catch (error) {
    console.error('Error getting execution:', error);
    res.status(500).json({ error: 'Failed to get execution' });
  }
});

// PUT /api/workflows/execution/:id/step/:stepIndex - Update workflow step status
app.put('/api/workflows/execution/:id/step/:stepIndex', (req, res) => {
  try {
    const { id, stepIndex } = req.params;
    const { status, result } = req.body;

    const executionsDir = path.join(__dirname, 'src', 'executions');
    const executionPath = path.join(executionsDir, `${id}.json`);

    if (!fs.existsSync(executionPath)) {
      return res.status(404).json({ error: 'Execution not found' });
    }

    const execution = JSON.parse(fs.readFileSync(executionPath, 'utf8'));
    const stepIdx = parseInt(stepIndex);

    if (stepIdx >= execution.steps.length) {
      return res.status(400).json({ error: 'Invalid step index' });
    }

    execution.steps[stepIdx].status = status;
    execution.steps[stepIdx].result = result;
    execution.steps[stepIdx].completedAt = new Date().toISOString();

    // Check if all steps completed
    const allCompleted = execution.steps.every(step => step.status === 'completed');
    if (allCompleted) {
      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();
    }

    fs.writeFileSync(executionPath, JSON.stringify(execution, null, 2), 'utf8');

    res.json({ success: true, message: 'Step updated successfully' });
  } catch (error) {
    console.error('Error updating step:', error);
    res.status(500).json({ error: 'Failed to update step' });
  }
});

// ==================
// AI Agent Execution API
// ==================

// POST /api/agents/execute - Execute AI agent task
app.post('/api/agents/execute', (req, res) => {
  try {
    const { agentName, task, context, config } = req.body;

    if (!agentName || !task) {
      return res.status(400).json({ error: 'Agent name and task are required' });
    }

    // Mock AI agent execution (in real implementation, this would call actual AI models)
    const executionId = `agent_exec_${Date.now()}`;
    const result = {
      id: executionId,
      agentName,
      task,
      status: 'completed',
      output: `Mock AI execution result for ${task} using context from Blueprint system`,
      contextUsed: context,
      configApplied: config,
      timestamp: new Date().toISOString(),
      metrics: {
        tokensUsed: 1500,
        executionTime: 2.5,
        confidence: 0.85
      }
    };

    // Log the execution for monitoring
    const executionsDir = path.join(__dirname, 'src', 'executions');
    if (!fs.existsSync(executionsDir)) {
      fs.mkdirSync(executionsDir, { recursive: true });
    }
    const executionPath = path.join(executionsDir, `${executionId}.json`);
    fs.writeFileSync(executionPath, JSON.stringify(result, null, 2), 'utf8');

    // Log as monitoring artifact
    const monitoringDir = path.join(__dirname, 'src', 'monitoring');
    if (!fs.existsSync(monitoringDir)) {
      fs.mkdirSync(monitoringDir, { recursive: true });
    }
    const artifactPath = path.join(monitoringDir, `${executionId}_artifact.json`);
    fs.writeFileSync(artifactPath, JSON.stringify({
      type: 'agent_execution',
      agentName,
      task,
      performance: result.metrics,
      timestamp: result.timestamp
    }, null, 2), 'utf8');

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error executing AI agent:', error);
    res.status(500).json({ error: 'Failed to execute AI agent' });
  }
});

// GET /api/agents/executions - List AI agent executions
app.get('/api/agents/executions', (req, res) => {
  try {
    const executionsDir = path.join(__dirname, 'src', 'executions');
    if (!fs.existsSync(executionsDir)) {
      return res.json({ executions: [] });
    }

    const files = fs.readdirSync(executionsDir)
      .filter(file => file.startsWith('agent_exec_') && file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(executionsDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return content;
      });

    res.json({ executions: files });
  } catch (error) {
    console.error('Error listing agent executions:', error);
    res.status(500).json({ error: 'Failed to list executions' });
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
const broadcastUpdate = (filename, data, productName) => {
  const message = JSON.stringify({
    type: 'file_update',
    filename,
    data,
    productName,
    timestamp: new Date().toISOString()
  });

  clients.forEach((client: any) => {
    if (client.readyState === 1) {
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
    const relativePath = path.relative(yamlDir, filePath);
    const parts = relativePath.split(path.sep);
    const productName = parts[0];

    // Handle YAML files
    if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContent);

      console.log(`File ${filename} changed externally for ${productName}, broadcasting update`);
      broadcastUpdate(filename, data, productName);
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
    const relativePath = path.relative(yamlDir, filePath);
    const parts = relativePath.split(path.sep);
    const productName = parts[0];

    // Handle YAML files
    if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContent);

      console.log(`File ${filename} added for ${productName}, broadcasting update`);
      broadcastUpdate(filename, data, productName);
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