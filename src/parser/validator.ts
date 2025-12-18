import { NorthStar, ArchitecturalScope } from './types';

const REQUIRED_FIELDS = [
  'type',
  'version',
  'last_updated',
  'title',
  'vision',
  'problem',
  'solution',
  'strategic_goals'
];

const ARCH_SCOPE_REQUIRED_FIELDS = [
  'type',
  'version',
  'last_updated',
  'title',
  'north_star_ref'
];

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const SCOPE_LISTS = ['what', 'how', 'where', 'who', 'when', 'why'];

export function validateNorthStar(data: any): asserts data is NorthStar {
  for (const field of REQUIRED_FIELDS) {
    if (!(field in data) || data[field] === null || data[field] === undefined) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (data.type !== 'north-star') {
    throw new Error('Type must be "north-star"');
  }

  if (!ISO_DATE_REGEX.test(data.last_updated)) {
    throw new Error('last_updated must be in ISO date format (YYYY-MM-DD)');
  }

  if (!Array.isArray(data.strategic_goals)) {
    throw new Error('strategic_goals must be an array');
  }

  for (const goal of data.strategic_goals) {
    if (!goal.title || !goal.description) {
      throw new Error('Each strategic goal must have title and description');
    }
  }
}

export function validateArchitecturalScope(data: any): asserts data is ArchitecturalScope {
  // Check required fields
  for (const field of ARCH_SCOPE_REQUIRED_FIELDS) {
    if (!(field in data) || data[field] === null || data[field] === undefined) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate type
  if (data.type !== 'architectural-scope') {
    throw new Error('Type must be "architectural-scope"');
  }

  // Validate date format
  if (!ISO_DATE_REGEX.test(data.last_updated)) {
    throw new Error('last_updated must be in ISO date format (YYYY-MM-DD)');
  }

  // Validate scope lists (all optional)
  for (const listName of SCOPE_LISTS) {
    if (listName in data) {
      if (!Array.isArray(data[listName])) {
        throw new Error(`${listName} must be an array`);
      }

      // Validate each item has title and description
      for (const item of data[listName]) {
        if (!item.title || !item.description) {
          throw new Error(`Each item in ${listName} must have title and description`);
        }
      }
    }
  }
}
