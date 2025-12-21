import { validateArchitecturalScopeBusinessRules, validateLeanViabilityBusinessRules } from '../src/parser/validator';
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
      why: {
        mission: {
          action: 'to provide',
          service: 'test services',
          beneficiary: 'users'
        }
      },
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
      why: {
        mission: {
          action: 'to provide',
          service: 'test services',
          beneficiary: 'users'
        }
      },
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
      why: {
        mission: {
          action: 'to provide',
          service: 'test services',
          beneficiary: 'users'
        }
      },
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
      why: {
        mission: {
          action: 'to provide',
          service: 'test services',
          beneficiary: 'users'
        }
      },
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
      north_star_ref: 'valid-north-star-ref.yaml',
      why: {
        mission: {
          action: 'to provide',
          service: 'test services',
          beneficiary: 'users'
        }
      }
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
      why: {
        mission: {
          action: 'to provide',
          service: 'test services',
          beneficiary: 'users'
        }
      },
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
      why: {
        mission: {
          action: 'to provide',
          service: 'test services',
          beneficiary: 'users'
        }
      },
      what: Array.from({ length: 5 }, (_, i) => ({
        title: `Item ${i + 1}`,
        description: `Desc ${i + 1}`
      }))
    };

    const warnings = validateArchitecturalScopeBusinessRules(data);
    expect(warnings).toHaveLength(0);
  });

  // WHY-specific validation tests
  test('warns when goal contains project objective wording', () => {
    const data = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-19',
      title: 'Test',
      north_star_ref: 'valid-north-star-ref.yaml',
      why: {
        mission: {
          action: 'to provide',
          service: 'test services',
          beneficiary: 'users'
        },
        goals: [
          { title: 'To implement new features', description: 'Deploy the system' },
          { title: 'To migrate to cloud', description: 'Upgrade infrastructure' }
        ]
      }
    };

    const warnings = validateArchitecturalScopeBusinessRules(data, fixturesDir);
    expect(warnings).toContain('Goal \'To implement new features\' may be a project objective rather than ongoing business goal');
    expect(warnings).toContain('Goal \'To migrate to cloud\' may be a project objective rather than ongoing business goal');
  });

  test('warns when goal appears enterprise-wide', () => {
    const data = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-19',
      title: 'Test',
      north_star_ref: 'valid-north-star-ref.yaml',
      why: {
        mission: {
          action: 'to provide',
          service: 'test services',
          beneficiary: 'users'
        },
        goals: [
          { title: 'To maximize shareholder value', description: 'Increase company profits' },
          { title: 'To become market leader', description: 'Dominate the industry' }
        ]
      }
    };

    const warnings = validateArchitecturalScopeBusinessRules(data, fixturesDir);
    expect(warnings).toContain('Goal \'To maximize shareholder value\' appears enterprise-wide; capability goals should be specific to this capability');
    expect(warnings).toContain('Goal \'To become market leader\' appears enterprise-wide; capability goals should be specific to this capability');
  });

  test('passes with valid capability-specific goals', () => {
    const data = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-19',
      title: 'Test',
      north_star_ref: 'valid-north-star-ref.yaml',
      why: {
        mission: {
          action: 'to provide',
          service: 'test services',
          beneficiary: 'users'
        },
        goals: [
          { title: 'To improve response time', description: 'Reduce latency for user queries' },
          { title: 'To enhance data quality', description: 'Ensure accuracy of customer records' }
        ]
      }
    };

    const warnings = validateArchitecturalScopeBusinessRules(data, fixturesDir);
    const goalWarnings = warnings.filter(w => w.includes('may be a project objective') || w.includes('appears enterprise-wide'));
    expect(goalWarnings).toHaveLength(0);
  });

  test('passes with mission only (no goals)', () => {
    const data = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-19',
      title: 'Test',
      north_star_ref: 'valid-north-star-ref.yaml',
      why: {
        mission: {
          action: 'to provide',
          service: 'test services',
          beneficiary: 'users'
        }
      },
      what: Array.from({ length: 5 }, (_, i) => ({
        title: `Item ${i + 1}`,
        description: `Desc ${i + 1}`
      }))
    };

    const warnings = validateArchitecturalScopeBusinessRules(data, fixturesDir);
    expect(warnings).toHaveLength(0);
  });
});

describe('validateLeanViabilityBusinessRules', () => {
  const validLeanCanvasPath = path.join(fixturesDir, 'valid-lean-canvas.yaml');

  beforeAll(() => {
    // Create a valid lean canvas fixture
    const leanCanvasContent = `type: lean-canvas
version: "1.0"
last_updated: "2025-12-21"
title: "Test Lean Canvas"
problem:
  top_3_problems:
    - "Problem 1"`;
    fs.writeFileSync(validLeanCanvasPath, leanCanvasContent);
  });

  test('throws error when lean canvas file does not exist', () => {
    const data = {
      lean_canvas_ref: 'non-existent.yaml',
      time_horizon: { duration: 3, unit: 'years' }
    };

    expect(() => validateLeanViabilityBusinessRules(data, __dirname)).toThrow('Lean canvas file not found');
  });

  test('warns when time horizon is too short', () => {
    const data = {
      lean_canvas_ref: 'valid-lean-canvas.yaml',
      time_horizon: { duration: 1, unit: 'years' },
      success_criteria: {
        annual_revenue: { amount: 1000000, currency: 'USD' }
      }
    };

    const warnings = validateLeanViabilityBusinessRules(data, fixturesDir);
    expect(warnings).toContain('Time horizon of 1 years may be too short (recommended: 2-5 years)');
  });

  test('warns when time horizon is too long', () => {
    const data = {
      lean_canvas_ref: 'valid-lean-canvas.yaml',
      time_horizon: { duration: 7, unit: 'years' },
      success_criteria: {
        annual_revenue: { amount: 1000000, currency: 'USD' }
      }
    };

    const warnings = validateLeanViabilityBusinessRules(data, fixturesDir);
    expect(warnings).toContain('Time horizon of 7 years may be too long (recommended: 2-5 years)');
  });

  test('handles time horizon in months', () => {
    const data = {
      lean_canvas_ref: 'valid-lean-canvas.yaml',
      time_horizon: { duration: 12, unit: 'months' },
      success_criteria: {
        annual_revenue: { amount: 1000000, currency: 'USD' }
      }
    };

    const warnings = validateLeanViabilityBusinessRules(data, fixturesDir);
    expect(warnings).toContain('Time horizon of 1 years may be too short (recommended: 2-5 years)');
  });

  test('throws error when currencies are inconsistent', () => {
    const data = {
      lean_canvas_ref: 'valid-lean-canvas.yaml',
      time_horizon: { duration: 3, unit: 'years' },
      success_criteria: {
        annual_revenue: { amount: 1000000, currency: 'USD' }
      },
      calculations: {
        annual_revenue_per_customer: { amount: 1200, currency: 'EUR' }
      }
    };

    expect(() => validateLeanViabilityBusinessRules(data, fixturesDir)).toThrow('All currency amounts must use the same currency');
  });

  test('warns when required customers is very high', () => {
    const data = {
      lean_canvas_ref: 'valid-lean-canvas.yaml',
      time_horizon: { duration: 3, unit: 'years' },
      success_criteria: {
        annual_revenue: { amount: 1000000, currency: 'USD' }
      },
      calculations: {
        annual_revenue_per_customer: { amount: 1200, currency: 'USD' },
        required_customers: { count: 1500000 }
      }
    };

    const warnings = validateLeanViabilityBusinessRules(data, fixturesDir);
    expect(warnings).toContain('Required customers (1500000) is very high. Consider validating against TAM.');
  });

  test('passes with valid viability data', () => {
    const data = {
      lean_canvas_ref: 'valid-lean-canvas.yaml',
      time_horizon: { duration: 3, unit: 'years' },
      success_criteria: {
        annual_revenue: { amount: 10000000, currency: 'USD' }
      },
      calculations: {
        annual_revenue_per_customer: { amount: 1200, currency: 'USD' },
        required_customers: { count: 8334 }
      }
    };

    const warnings = validateLeanViabilityBusinessRules(data, fixturesDir);
    expect(warnings).toHaveLength(0);
  });

  test('passes with absolute lean canvas path', () => {
    const data = {
      lean_canvas_ref: path.join(fixturesDir, 'valid-lean-canvas.yaml'),
      time_horizon: { duration: 3, unit: 'years' },
      success_criteria: {
        annual_revenue: { amount: 1000000, currency: 'USD' }
      }
    };

    const warnings = validateLeanViabilityBusinessRules(data);
    expect(warnings).toHaveLength(0);
  });
});
