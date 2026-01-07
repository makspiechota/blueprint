const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Helper function to recursively load roadmap hierarchy
const loadRoadmapHierarchy = (productName) => {
  const roadmapDir = path.join('backend/src/data', productName, 'roadmap');
  const roadmapFile = path.join(roadmapDir, 'roadmap.yaml');

  if (!fs.existsSync(roadmapFile)) {
    return null;
  }

  const roadmapContent = fs.readFileSync(roadmapFile, 'utf8');
  const roadmap = yaml.load(roadmapContent);

  // Load each epic
  if (roadmap.epics) {
    roadmap.epics = roadmap.epics.map((epicRef) => {
      if (epicRef.path) {
        const epicPath = path.join(roadmapDir, epicRef.path.replace('./', ''));
        if (fs.existsSync(epicPath)) {
          const epicContent = fs.readFileSync(epicPath, 'utf8');
          const epic = yaml.load(epicContent);
          const epicDir = path.dirname(epicPath);

          // Load each feature within the epic
          if (epic.features) {
            epic.features = epic.features.map((featureRef) => {
              if (featureRef.path) {
                const featurePath = path.join(epicDir, featureRef.path.replace('./', ''));
                if (fs.existsSync(featurePath)) {
                  const featureContent = fs.readFileSync(featurePath, 'utf8');
                  const feature = yaml.load(featureContent);
                  const featureDir = path.dirname(featurePath);

                  // Load each user story within the feature
                  if (feature.user_stories) {
                    feature.user_stories = feature.user_stories.map((storyRef) => {
                      if (storyRef.path) {
                        const storyPath = path.join(featureDir, storyRef.path.replace('./', ''));
                        if (fs.existsSync(storyPath)) {
                          const storyContent = fs.readFileSync(storyPath, 'utf8');
                          const story = yaml.load(storyContent);
                          const storyDir = path.dirname(storyPath);

                          // Load each task within the user story
                          if (story.tasks) {
                            story.tasks = story.tasks.map((taskRef) => {
                              if (taskRef.path) {
                                const taskPath = path.join(storyDir, taskRef.path.replace('./', ''));
                                if (fs.existsSync(taskPath)) {
                                  const taskContent = fs.readFileSync(taskPath, 'utf8');
                                  const task = yaml.load(taskContent);
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

// Process multiple products - map backend names to frontend names
const productMapping = {
  'blueprint': 'blueprint',
  'test': 'software-factory'
};

Object.entries(productMapping).forEach(([backendName, frontendName]) => {
  console.log(`Processing roadmap for ${backendName} -> ${frontendName}...`);
  const roadmap = loadRoadmapHierarchy(backendName);

  if (roadmap) {
    // Write to public/data/{frontendName}/roadmap.json
    fs.writeFileSync(`public/data/${frontendName}/roadmap.json`, JSON.stringify({ data: roadmap }, null, 2));
    console.log(`Roadmap JSON generated successfully for ${frontendName}`);
  } else {
    console.log(`No roadmap found for ${backendName}`);
  }
});