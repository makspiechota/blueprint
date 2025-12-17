import { parseNorthStar } from '../src/parser';
import * as fs from 'fs';
import * as path from 'path';

const fixturesDir = path.join(__dirname, 'fixtures');

beforeAll(() => {
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
});

describe('parseNorthStar', () => {
  test('parses valid north star YAML file', () => {
    const validYaml = `type: north-star
version: "2.0"
last_updated: "2025-01-28"
title: "Test North Star"
vision: "Test vision"
problem: "Test problem"
solution: "Test solution"
strategic_goals:
  - title: "Goal 1"
    description: "Description 1"`;

    const filePath = path.join(fixturesDir, 'valid.yaml');
    fs.writeFileSync(filePath, validYaml);

    const result = parseNorthStar(filePath);

    expect(result).toEqual({
      type: 'north-star',
      version: '2.0',
      last_updated: '2025-01-28',
      title: 'Test North Star',
      vision: 'Test vision',
      problem: 'Test problem',
      solution: 'Test solution',
      strategic_goals: [
        { title: 'Goal 1', description: 'Description 1' }
      ]
    });
  });

  test('throws error for missing required field', () => {
    const invalidYaml = `type: north-star
version: "2.0"
title: "Test"`;

    const filePath = path.join(fixturesDir, 'missing-field.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseNorthStar(filePath)).toThrow('Missing required field: last_updated');
  });

  test('throws error for invalid type', () => {
    const invalidYaml = `type: wrong-type
version: "2.0"
last_updated: "2025-01-28"
title: "Test"
vision: "Test"
problem: "Test"
solution: "Test"
strategic_goals: []`;

    const filePath = path.join(fixturesDir, 'invalid-type.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseNorthStar(filePath)).toThrow('Type must be "north-star"');
  });

  test('throws error for invalid date format', () => {
    const invalidYaml = `type: north-star
version: "2.0"
last_updated: "invalid-date"
title: "Test"
vision: "Test"
problem: "Test"
solution: "Test"
strategic_goals: []`;

    const filePath = path.join(fixturesDir, 'invalid-date.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseNorthStar(filePath)).toThrow('last_updated must be in ISO date format (YYYY-MM-DD)');
  });

  test('throws error for non-existent file', () => {
    expect(() => parseNorthStar('non-existent.yaml')).toThrow();
  });
});
