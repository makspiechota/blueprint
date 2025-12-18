#!/usr/bin/env node

const { default: dtsgenerator, parseSchema } = require('dtsgenerator');
const fs = require('fs');
const path = require('path');

async function generateTypes() {
  const schemasDir = path.join(__dirname, '../schemas');
  const outputPath = path.join(__dirname, '../src/parser/types.generated.ts');

  // Read all schema files
  const schemaFiles = fs.readdirSync(schemasDir)
    .filter(file => file.endsWith('.schema.json'));

  // Parse all schemas
  const schemas = schemaFiles.map(file => {
    const schemaPath = path.join(schemasDir, file);
    const schemaContent = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    return parseSchema(schemaContent);
  });

  // Generate types from all schemas
  let content = await dtsgenerator({
    contents: schemas,
  });

  // Add export statement for module compatibility
  content += '\nexport { Schemas };\n';

  // Write output
  fs.writeFileSync(outputPath, content);
  console.log(`✓ Generated types in ${outputPath}`);
}

generateTypes().catch(err => {
  console.error('Error generating types:', err);
  process.exit(1);
});
