import * as fs from 'fs';
import * as path from 'path';

const schemaCache = new Map<string, any>();

export function getSchemaRegistry(): any {
  const registryPath = path.join(__dirname, '../../schemas/schema.json');
  const registryContent = fs.readFileSync(registryPath, 'utf8');
  return JSON.parse(registryContent);
}

export function loadSchema(layerName: string): any {
  if (schemaCache.has(layerName)) {
    return schemaCache.get(layerName);
  }

  const registry = getSchemaRegistry();
  const layer = registry.layers.find((l: any) => l.name === layerName);

  if (!layer) {
    throw new Error(`Schema not found for layer: ${layerName}`);
  }

  const schemaPath = path.join(__dirname, '../../schemas', layer.file);
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const schema = JSON.parse(schemaContent);

  schemaCache.set(layerName, schema);
  return schema;
}
