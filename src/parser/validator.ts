import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { loadSchema } from './schema-loader';
import { NorthStar, ArchitecturalScope } from './types';
import * as fs from 'fs';
import * as path from 'path';

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

const SCOPE_LISTS = ['what', 'how', 'where', 'who', 'when', 'why'] as const;

export function validateArchitecturalScopeBusinessRules(
  data: any,
  baseDir: string = process.cwd()
): string[] {
  const warnings: string[] = [];

  // Validate north star reference exists
  const northStarPath = path.isAbsolute(data.north_star_ref)
    ? data.north_star_ref
    : path.join(baseDir, data.north_star_ref);

  if (!fs.existsSync(northStarPath)) {
    throw new Error(`North star file not found: ${data.north_star_ref}`);
  }

  // Validate north star file is valid
  try {
    const northStarContent = fs.readFileSync(northStarPath, 'utf8');
    const yaml = require('js-yaml');
    const northStarData = yaml.load(northStarContent);
    validateNorthStar(northStarData);
  } catch (error) {
    throw new Error(`North star file is invalid: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Check if at least one scope list is defined
  const definedLists = SCOPE_LISTS.filter(list =>
    list in data && Array.isArray(data[list]) && data[list].length > 0
  );

  if (definedLists.length === 0) {
    warnings.push('No scope lists defined (at least one is recommended)');
  }

  // Validate scope list sizes (3-12 items, optimal: 7)
  for (const listName of SCOPE_LISTS) {
    if (listName in data && Array.isArray(data[listName])) {
      const count = data[listName].length;
      if (count < 3 || count > 12) {
        warnings.push(`${listName} list has ${count} items (recommended: 3-12, optimal: 7)`);
      }
    }
  }

  return warnings;
}
