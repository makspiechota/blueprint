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
    const errors = ajv.errorsText(validateNorthStarSchema.errors);
    throw new Error(`Validation failed: ${errors}`);
  }
}

export function validateArchitecturalScope(data: any): asserts data is ArchitecturalScope {
  const valid = validateArchitecturalScopeSchema(data);

  if (!valid) {
    const errors = ajv.errorsText(validateArchitecturalScopeSchema.errors);
    throw new Error(`Validation failed: ${errors}`);
  }
}
