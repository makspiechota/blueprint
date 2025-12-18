import { validateArchitecturalScopeBusinessRules } from '../src/parser/validator';
import * as fs from 'fs';
import * as path from 'path';

const fixturesDir = path.join(__dirname, 'fixtures');

beforeAll(() => {
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
});

describe('validateArchitecturalScopeBusinessRules', () => {
  test('throws error when north star file does not exist', () => {
    const data = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-18',
      title: 'Test',
      north_star_ref: 'non-existent.yaml',
      what: [
        { title: 'Item 1', description: 'Desc 1' },
        { title: 'Item 2', description: 'Desc 2' },
        { title: 'Item 3', description: 'Desc 3' }
      ]
    };

    expect(() => validateArchitecturalScopeBusinessRules(data, __dirname)).toThrow('North star file not found');
  });

  test('throws error when north star file is invalid', () => {
    // Create invalid north star file
    const invalidNorthStar = path.join(fixturesDir, 'invalid-north-star.yaml');
    fs.writeFileSync(invalidNorthStar, 'type: wrong-type\nversion: "1.0"');

    const data = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-18',
      title: 'Test',
      north_star_ref: 'invalid-north-star.yaml',
      what: [
        { title: 'Item 1', description: 'Desc 1' },
        { title: 'Item 2', description: 'Desc 2' },
        { title: 'Item 3', description: 'Desc 3' }
      ]
    };

    expect(() => validateArchitecturalScopeBusinessRules(data, fixturesDir)).toThrow();
  });

  test('warns when scope list has fewer than 3 items', () => {
    // Create valid north star
    const validNorthStar = path.join(fixturesDir, 'valid-north-star-ref.yaml');
    fs.writeFileSync(validNorthStar, `type: north-star
version: "2.0"
last_updated: "2025-12-18"
title: "Test"
vision: "Vision"
problem: "Problem"
solution: "Solution"
strategic_goals:
  - title: "Goal 1"
    description: "Desc 1"`);

    const data = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-18',
      title: 'Test',
      north_star_ref: 'valid-north-star-ref.yaml',
      what: [
        { title: 'Item 1', description: 'Desc 1' },
        { title: 'Item 2', description: 'Desc 2' }
      ]
    };

    const warnings = validateArchitecturalScopeBusinessRules(data, fixturesDir);
    expect(warnings).toContain('what list has 2 items (recommended: 3-12, optimal: 7)');
  });

  test('warns when scope list has more than 12 items', () => {
    const data = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-18',
      title: 'Test',
      north_star_ref: 'valid-north-star-ref.yaml',
      what: Array.from({ length: 15 }, (_, i) => ({
        title: `Item ${i + 1}`,
        description: `Desc ${i + 1}`
      }))
    };

    const warnings = validateArchitecturalScopeBusinessRules(data, fixturesDir);
    expect(warnings).toContain('what list has 15 items (recommended: 3-12, optimal: 7)');
  });

  test('warns when no scope lists are defined', () => {
    const data = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-18',
      title: 'Test',
      north_star_ref: 'valid-north-star-ref.yaml'
    };

    const warnings = validateArchitecturalScopeBusinessRules(data, fixturesDir);
    expect(warnings).toContain('No scope lists defined (at least one is recommended)');
  });

  test('passes with valid scope lists in optimal range', () => {
    const data = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-18',
      title: 'Test',
      north_star_ref: 'valid-north-star-ref.yaml',
      what: Array.from({ length: 7 }, (_, i) => ({
        title: `Item ${i + 1}`,
        description: `Desc ${i + 1}`
      })),
      how: Array.from({ length: 5 }, (_, i) => ({
        title: `Item ${i + 1}`,
        description: `Desc ${i + 1}`
      }))
    };

    const warnings = validateArchitecturalScopeBusinessRules(data, fixturesDir);
    expect(warnings).toHaveLength(0);
  });

  test('validates with absolute north star path', () => {
    const data = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-18',
      title: 'Test',
      north_star_ref: path.join(fixturesDir, 'valid-north-star-ref.yaml'),
      what: Array.from({ length: 5 }, (_, i) => ({
        title: `Item ${i + 1}`,
        description: `Desc ${i + 1}`
      }))
    };

    const warnings = validateArchitecturalScopeBusinessRules(data);
    expect(warnings).toHaveLength(0);
  });
});
