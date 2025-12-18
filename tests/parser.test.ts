import { parseNorthStar, parseArchitecturalScope } from '../src/parser';
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

    expect(() => parseNorthStar(filePath)).toThrow('Validation failed');
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

    expect(() => parseNorthStar(filePath)).toThrow('Validation failed');
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

    expect(() => parseNorthStar(filePath)).toThrow('Validation failed');
  });

  test('throws error for non-existent file', () => {
    expect(() => parseNorthStar('non-existent.yaml')).toThrow();
  });
});

describe('parseArchitecturalScope', () => {
  test('parses valid architectural scope with all lists', () => {
    const validYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-18"
title: "Test Scope"
north_star_ref: "test-north-star.yaml"
what:
  - title: "Entity 1"
    description: "Description 1"
  - title: "Entity 2"
    description: "Description 2"
how:
  - title: "Process 1"
    description: "How it works"
where:
  - title: "Location 1"
    description: "Where it happens"
who:
  - title: "Team 1"
    description: "Who is involved"
when:
  - title: "Timing 1"
    description: "When it occurs"
why:
  - title: "Goal 1"
    description: "Why it matters"`;

    const filePath = path.join(fixturesDir, 'valid-arch-scope.yaml');
    fs.writeFileSync(filePath, validYaml);

    const result = parseArchitecturalScope(filePath);

    expect(result.type).toBe('architectural-scope');
    expect(result.title).toBe('Test Scope');
    expect(result.what).toHaveLength(2);
    expect(result.how).toHaveLength(1);
    expect(result.where).toHaveLength(1);
    expect(result.who).toHaveLength(1);
    expect(result.when).toHaveLength(1);
    expect(result.why).toHaveLength(1);
  });

  test('parses architectural scope with subset of lists', () => {
    const validYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-18"
title: "Minimal Scope"
north_star_ref: "test-north-star.yaml"
what:
  - title: "Entity 1"
    description: "Description 1"
how:
  - title: "Process 1"
    description: "How it works"`;

    const filePath = path.join(fixturesDir, 'minimal-arch-scope.yaml');
    fs.writeFileSync(filePath, validYaml);

    const result = parseArchitecturalScope(filePath);

    expect(result.type).toBe('architectural-scope');
    expect(result.what).toHaveLength(1);
    expect(result.how).toHaveLength(1);
    expect(result.where).toBeUndefined();
    expect(result.who).toBeUndefined();
    expect(result.when).toBeUndefined();
    expect(result.why).toBeUndefined();
  });

  test('throws error for missing north_star_ref', () => {
    const invalidYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-18"
title: "Test"`;

    const filePath = path.join(fixturesDir, 'missing-north-star-ref.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseArchitecturalScope(filePath)).toThrow('Validation failed');
  });

  test('throws error for invalid type', () => {
    const invalidYaml = `type: wrong-type
version: "1.0"
last_updated: "2025-12-18"
title: "Test"
north_star_ref: "test.yaml"`;

    const filePath = path.join(fixturesDir, 'invalid-arch-type.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseArchitecturalScope(filePath)).toThrow('Validation failed');
  });

  test('throws error for invalid scope list structure', () => {
    const invalidYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-18"
title: "Test"
north_star_ref: "test.yaml"
what:
  - title: "Missing description"`;

    const filePath = path.join(fixturesDir, 'invalid-scope-item.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseArchitecturalScope(filePath)).toThrow();
  });

  test('throws error for non-existent file', () => {
    expect(() => parseArchitecturalScope('non-existent.yaml')).toThrow();
  });
});
