#!/usr/bin/env node

const { compile } = require('json-schema-to-typescript');
const fs = require('fs');
const path = require('path');

async function generateTypes() {
  const schemasDir = path.join(__dirname, '../schemas');
  const outputPath = path.join(__dirname, '../src/parser/types.generated.ts');

  // Read all schema files
  const schemaFiles = fs.readdirSync(schemasDir)
    .filter(file => file.endsWith('.schema.json'));

  let output = '// Auto-generated types from JSON schemas\n';
  output += '// DO NOT EDIT MANUALLY - Run `npm run generate-types` to regenerate\n\n';

  for (const file of schemaFiles) {
    const schemaPath = path.join(schemasDir, file);
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    const ts = await compile(schema, schema.title || file.replace('.schema.json', ''), {
      bannerComment: '',
      style: {
        singleQuote: true,
      },
    });

    output += ts + '\n';
  }

  // Write output
  fs.writeFileSync(outputPath, output, 'utf8');
  console.log(`✓ Generated types in ${outputPath}`);
}

generateTypes().catch(err => {
  console.error('Error generating types:', err);
  process.exit(1);
});
