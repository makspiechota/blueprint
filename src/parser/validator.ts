import { NorthStar } from './types';

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

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

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
