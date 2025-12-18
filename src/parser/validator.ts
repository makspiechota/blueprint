import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { loadSchema } from './schema-loader';
import { NorthStar, ArchitecturalScope } from './types';

// Initialize AJV with JSON Schema Draft-07 support
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Cache for compiled validators
const validatorCache = new Map<string, ValidateFunction>();

function getValidator(schemaName: string): ValidateFunction {
  if (!validatorCache.has(schemaName)) {
    const schema = loadSchema(schemaName);
    const validator = ajv.compile(schema);
    validatorCache.set(schemaName, validator);
  }
  return validatorCache.get(schemaName)!;
}

export function validate(data: any, schemaName: string): void {
  const validator = getValidator(schemaName);
  const valid = validator(data);

  if (!valid) {
    const errors = ajv.errorsText(validator.errors);
    throw new Error(`Validation failed: ${errors}`);
  }
}

// Legacy exports for backward compatibility
export function validateNorthStar(data: any): asserts data is NorthStar {
  validate(data, 'north-star');
}

export function validateArchitecturalScope(data: any): asserts data is ArchitecturalScope {
  validate(data, 'architectural-scope');
}
