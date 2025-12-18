import { loadSchema, getSchemaRegistry } from '../src/parser/schema-loader';
import * as path from 'path';

describe('Schema Loader', () => {
  test('loads root schema registry', () => {
    const registry = getSchemaRegistry();

    expect(registry).toHaveProperty('layers');
    expect(Array.isArray(registry.layers)).toBe(true);
    expect(registry.layers.length).toBeGreaterThan(0);
  });

  test('loads north-star schema', () => {
    const schema = loadSchema('north-star');

    expect(schema).toHaveProperty('$schema');
    expect(schema).toHaveProperty('type');
    expect(schema).toHaveProperty('properties');
    expect(schema.type).toBe('object');
  });

  test('loads architectural-scope schema', () => {
    const schema = loadSchema('architectural-scope');

    expect(schema).toHaveProperty('$schema');
    expect(schema).toHaveProperty('properties');
    expect(schema.properties).toHaveProperty('what');
    expect(schema.properties).toHaveProperty('how');
    expect(schema.properties).toHaveProperty('where');
    expect(schema.properties).toHaveProperty('who');
    expect(schema.properties).toHaveProperty('when');
    expect(schema.properties).toHaveProperty('why');
  });

  test('schema contains metadata', () => {
    const schema = loadSchema('architectural-scope');

    expect(schema).toHaveProperty('metadata');
    expect(schema.metadata).toHaveProperty('methodology');
    expect(schema.metadata).toHaveProperty('purpose');
  });

  test('throws error for non-existent schema', () => {
    expect(() => {
      loadSchema('non-existent-layer');
    }).toThrow();
  });
});
