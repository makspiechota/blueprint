import { NorthStar, ArchitecturalScope } from './types';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { loadSchema } from './schema-loader';

// Initialize AJV with JSON Schema Draft-07 support
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Load schemas
const northStarSchema = loadSchema('north-star');
const architecturalScopeSchema = loadSchema('architectural-scope');

// Compile validators
const validateNorthStarSchema = ajv.compile(northStarSchema);
const validateArchitecturalScopeSchema = ajv.compile(architecturalScopeSchema);

export function validateNorthStar(data: any): asserts data is NorthStar {
  const valid = validateNorthStarSchema(data);

  if (!valid) {
    const errors = validateNorthStarSchema.errors || [];
    // Format first error for user-friendly message
    const firstError = errors[0];

    if (firstError.keyword === 'required') {
      throw new Error(`Missing required field: ${firstError.params.missingProperty}`);
    } else if (firstError.keyword === 'const' && firstError.instancePath === '/type') {
      throw new Error('Type must be "north-star"');
    } else if (firstError.keyword === 'pattern' && firstError.instancePath === '/last_updated') {
      throw new Error('last_updated must be in ISO date format (YYYY-MM-DD)');
    } else if (firstError.instancePath.includes('strategic_goals')) {
      throw new Error('Each strategic goal must have title and description');
    } else {
      throw new Error(`Validation error: ${firstError.message} at ${firstError.instancePath}`);
    }
  }
}

export function validateArchitecturalScope(data: any): asserts data is ArchitecturalScope {
  const valid = validateArchitecturalScopeSchema(data);

  if (!valid) {
    const errors = validateArchitecturalScopeSchema.errors || [];
    // Format first error for user-friendly message
    const firstError = errors[0];

    if (firstError.keyword === 'required') {
      throw new Error(`Missing required field: ${firstError.params.missingProperty}`);
    } else if (firstError.keyword === 'const' && firstError.instancePath === '/type') {
      throw new Error('Type must be "architectural-scope"');
    } else if (firstError.keyword === 'pattern' && firstError.instancePath === '/last_updated') {
      throw new Error('last_updated must be in ISO date format (YYYY-MM-DD)');
    } else if (firstError.instancePath.match(/\/(what|how|where|who|when|why)/)) {
      const listName = firstError.instancePath.split('/')[1];
      throw new Error(`Each item in ${listName} must have title and description`);
    } else {
      throw new Error(`Validation error: ${firstError.message} at ${firstError.instancePath}`);
    }
  }
}
