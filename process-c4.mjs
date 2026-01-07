import { LikeC4 } from 'likec4';
import fs from 'fs';
import path from 'path';

async function processC4Files() {
  // Process multiple products - map backend names to frontend names
  const productMapping = {
    'blueprint': 'blueprint',
    'test': 'software-factory'
  };

  for (const [backendName, frontendName] of Object.entries(productMapping)) {
    console.log(`Processing C4 files for ${backendName} -> ${frontendName}...`);

    // Check if C4 directory exists and find any .likec4 files
    const c4Dir = `backend/src/data/${backendName}/c4`;
    if (!fs.existsSync(c4Dir)) {
      console.log(`No C4 directory found for ${backendName}`);
      continue;
    }

    const likec4Files = fs.readdirSync(c4Dir).filter(file => file.endsWith('.likec4'));
    if (likec4Files.length === 0) {
      console.log(`No C4 files found for ${backendName} in ${c4Dir}`);
      continue;
    }

    // Use the first .likec4 file found
    const dslFilename = likec4Files[0];
    const dslPath = path.join(c4Dir, dslFilename);

    try {
      // Read the C4 DSL file
      const dslContent = fs.readFileSync(dslPath, 'utf8');

      console.log(`Parsing DSL for ${backendName}...`);

      // Parse the DSL using LikeC4
      const likec4 = await LikeC4.fromSource(dslContent, {
        printErrors: false,
        throwIfInvalid: false
      });

      // Check for parsing errors
      if (likec4.hasErrors()) {
        console.warn(`C4 DSL for ${backendName} has validation errors:`, likec4.getErrors());
      }

      console.log(`Generating layouted model for ${backendName}...`);

      // Get the layouted model ready for rendering
      const layoutedModel = await likec4.layoutedModel();

      // Extract serializable data (same as backend)
      const modelData = layoutedModel.$data;

      // Save the serializable model data as JSON
      const outputPath = `public/data/${frontendName}/c4/layouted-model.json`;
      fs.writeFileSync(outputPath, JSON.stringify(modelData, null, 2));

      console.log('C4 model processed and saved to:', outputPath);

      // Also save the DSL content (use the frontend name for consistency)
      const dslOutputPath = `public/data/${frontendName}/c4/${frontendName}.likec4`;
      fs.writeFileSync(dslOutputPath, dslContent);

      console.log('C4 DSL saved to:', dslOutputPath);

    } catch (error) {
      console.error(`Error processing C4 files for ${backendName}:`, error);
      // Continue with other products instead of exiting
    }
  }
}

processC4Files();