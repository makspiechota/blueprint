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

describe('AAARR Metrics Schema Validation', () => {
  const { validate } = require('../src/parser/validator');

  test('validates complete AAARR metrics structure', () => {
    const data = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-22',
      title: 'Test AAARR Metrics',
      stages: {
        acquisition: {
          stage_goal: 'Get users to discover product',
          metrics: [
            {
              id: 'aaarr.acquisition.signup-rate',
              name: 'Signup Rate',
              description: 'Monthly signups',
              target: { rate: 100, period: 'month' },
              current: { rate: 75, period: 'month' }
            }
          ]
        },
        activation: {
          stage_goal: 'Get users to first value',
          metrics: []
        },
        retention: {
          stage_goal: 'Keep users coming back',
          metrics: []
        },
        referral: {
          stage_goal: 'Turn users into advocates',
          metrics: []
        },
        revenue: {
          stage_goal: 'Monetize users',
          metrics: []
        }
      }
    };

    expect(() => validate(data, 'aaarr-metrics')).not.toThrow();
  });

  test('rejects invalid metric ID pattern', () => {
    const data = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-22',
      title: 'Test',
      stages: {
        acquisition: {
          stage_goal: 'Goal',
          metrics: [
            {
              id: 'invalid-id-format',  // Should fail pattern validation
              name: 'Metric'
            }
          ]
        },
        activation: { stage_goal: 'Goal', metrics: [] },
        retention: { stage_goal: 'Goal', metrics: [] },
        referral: { stage_goal: 'Goal', metrics: [] },
        revenue: { stage_goal: 'Goal', metrics: [] }
      }
    };

    expect(() => validate(data, 'aaarr-metrics')).toThrow();
  });

  test('validates metric ID matches stage name', () => {
    const data = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-22',
      title: 'Test',
      stages: {
        acquisition: {
          stage_goal: 'Goal',
          metrics: [
            {
              id: 'aaarr.acquisition.valid-metric',  // Matches stage
              name: 'Metric'
            }
          ]
        },
        activation: { stage_goal: 'Goal', metrics: [] },
        retention: { stage_goal: 'Goal', metrics: [] },
        referral: { stage_goal: 'Goal', metrics: [] },
        revenue: { stage_goal: 'Goal', metrics: [] }
      }
    };

    expect(() => validate(data, 'aaarr-metrics')).not.toThrow();
  });

  test('requires all 5 AAARR stages', () => {
    const data = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-22',
      title: 'Test',
      stages: {
        acquisition: { stage_goal: 'Goal', metrics: [] },
        activation: { stage_goal: 'Goal', metrics: [] }
        // Missing retention, referral, revenue
      }
    };

    expect(() => validate(data, 'aaarr-metrics')).toThrow();
  });

  test('validates structured metric values with rate/period', () => {
    const data = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-22',
      title: 'Test',
      stages: {
        acquisition: {
          stage_goal: 'Goal',
          metrics: [
            {
              id: 'aaarr.acquisition.metric',
              name: 'Metric',
              target: { rate: 100, period: 'month' }
            }
          ]
        },
        activation: { stage_goal: 'Goal', metrics: [] },
        retention: { stage_goal: 'Goal', metrics: [] },
        referral: { stage_goal: 'Goal', metrics: [] },
        revenue: { stage_goal: 'Goal', metrics: [] }
      }
    };

    expect(() => validate(data, 'aaarr-metrics')).not.toThrow();
  });

  test('validates structured metric values with amount/currency', () => {
    const data = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-22',
      title: 'Test',
      stages: {
        acquisition: { stage_goal: 'Goal', metrics: [] },
        activation: { stage_goal: 'Goal', metrics: [] },
        retention: { stage_goal: 'Goal', metrics: [] },
        referral: { stage_goal: 'Goal', metrics: [] },
        revenue: {
          stage_goal: 'Goal',
          metrics: [
            {
              id: 'aaarr.revenue.arr',
              name: 'ARR',
              target: { amount: 10000000, currency: 'USD' }
            }
          ]
        }
      }
    };

    expect(() => validate(data, 'aaarr-metrics')).not.toThrow();
  });

  test('validates structured metric values with percentage', () => {
    const data = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-22',
      title: 'Test',
      stages: {
        acquisition: { stage_goal: 'Goal', metrics: [] },
        activation: {
          stage_goal: 'Goal',
          metrics: [
            {
              id: 'aaarr.activation.conversion',
              name: 'Conversion',
              target: { percentage: 60 }
            }
          ]
        },
        retention: { stage_goal: 'Goal', metrics: [] },
        referral: { stage_goal: 'Goal', metrics: [] },
        revenue: { stage_goal: 'Goal', metrics: [] }
      }
    };

    expect(() => validate(data, 'aaarr-metrics')).not.toThrow();
  });

  test('validates imported_from field for viability imports', () => {
    const data = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-22',
      title: 'Test',
      lean_viability_ref: 'lean-viability.yaml',
      stages: {
        acquisition: {
          stage_goal: 'Goal',
          metrics: [
            {
              id: 'aaarr.acquisition.signup-rate',
              name: 'Signup Rate',
              target: {
                rate: 231,
                period: 'month',
                imported_from: 'lean-viability.targets.monthly_acquisition'
              }
            }
          ]
        },
        activation: { stage_goal: 'Goal', metrics: [] },
        retention: { stage_goal: 'Goal', metrics: [] },
        referral: { stage_goal: 'Goal', metrics: [] },
        revenue: { stage_goal: 'Goal', metrics: [] }
      }
    };

    expect(() => validate(data, 'aaarr-metrics')).not.toThrow();
  });

  test('validates gap values with numeric differences', () => {
    const data = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-22',
      title: 'Test',
      stages: {
        acquisition: {
          stage_goal: 'Goal',
          metrics: [
            {
              id: 'aaarr.acquisition.metric',
              name: 'Metric',
              target: { rate: 100, period: 'month' },
              current: { rate: 75, period: 'month' },
              gap: { rate: 25 }
            }
          ]
        },
        activation: { stage_goal: 'Goal', metrics: [] },
        retention: { stage_goal: 'Goal', metrics: [] },
        referral: { stage_goal: 'Goal', metrics: [] },
        revenue: { stage_goal: 'Goal', metrics: [] }
      }
    };

    expect(() => validate(data, 'aaarr-metrics')).not.toThrow();
  });
});

describe('validateAARRRMetricsBusinessRules', () => {
  const { validateAARRRMetricsBusinessRules } = require('../src/parser/validator');

  test('throws error when lean viability file does not exist', () => {
    const data = {
      lean_viability_ref: 'non-existent.yaml',
      stages: {
        acquisition: { stage_goal: 'Goal', metrics: [] },
        activation: { stage_goal: 'Goal', metrics: [] },
        retention: { stage_goal: 'Goal', metrics: [] },
        referral: { stage_goal: 'Goal', metrics: [] },
        revenue: { stage_goal: 'Goal', metrics: [] }
      }
    };

    expect(() => validateAARRRMetricsBusinessRules(data, __dirname)).toThrow('Lean viability file not found');
  });

  test('throws error when metric IDs are duplicated', () => {
    const data = {
      stages: {
        acquisition: {
          stage_goal: 'Goal',
          metrics: [
            { id: 'aaarr.acquisition.metric1', name: 'Metric 1' },
            { id: 'aaarr.acquisition.metric1', name: 'Duplicate' }  // Duplicate ID
          ]
        },
        activation: { stage_goal: 'Goal', metrics: [] },
        retention: { stage_goal: 'Goal', metrics: [] },
        referral: { stage_goal: 'Goal', metrics: [] },
        revenue: { stage_goal: 'Goal', metrics: [] }
      }
    };

    expect(() => validateAARRRMetricsBusinessRules(data)).toThrow('Duplicate metric ID: aaarr.acquisition.metric1');
  });

  test('throws error when metric ID does not match stage', () => {
    const data = {
      stages: {
        acquisition: {
          stage_goal: 'Goal',
          metrics: [
            { id: 'aaarr.retention.wrong-stage', name: 'Metric' }  // Wrong stage in ID
          ]
        },
        activation: { stage_goal: 'Goal', metrics: [] },
        retention: { stage_goal: 'Goal', metrics: [] },
        referral: { stage_goal: 'Goal', metrics: [] },
        revenue: { stage_goal: 'Goal', metrics: [] }
      }
    };

    expect(() => validateAARRRMetricsBusinessRules(data)).toThrow(
      "Metric ID 'aaarr.retention.wrong-stage' does not match stage 'acquisition'"
    );
  });

  test('throws error when target/current types mismatch', () => {
    const data = {
      stages: {
        acquisition: {
          stage_goal: 'Goal',
          metrics: [
            {
              id: 'aaarr.acquisition.metric',
              name: 'Metric',
              target: { rate: 100, period: 'month' },
              current: { percentage: 50 }  // Type mismatch
            }
          ]
        },
        activation: { stage_goal: 'Goal', metrics: [] },
        retention: { stage_goal: 'Goal', metrics: [] },
        referral: { stage_goal: 'Goal', metrics: [] },
        revenue: { stage_goal: 'Goal', metrics: [] }
      }
    };

    expect(() => validateAARRRMetricsBusinessRules(data)).toThrow(
      "Metric 'aaarr.acquisition.metric': target type 'rate' does not match current type 'percentage'"
    );
  });

  test('throws error when currencies are inconsistent', () => {
    const data = {
      stages: {
        acquisition: { stage_goal: 'Goal', metrics: [] },
        activation: { stage_goal: 'Goal', metrics: [] },
        retention: { stage_goal: 'Goal', metrics: [] },
        referral: { stage_goal: 'Goal', metrics: [] },
        revenue: {
          stage_goal: 'Goal',
          metrics: [
            {
              id: 'aaarr.revenue.arr',
              name: 'ARR',
              target: { amount: 10000, currency: 'USD' },
              current: { amount: 5000, currency: 'EUR' }  // Currency mismatch
            }
          ]
        }
      }
    };

    expect(() => validateAARRRMetricsBusinessRules(data)).toThrow(
      "Metric 'aaarr.revenue.arr': currency mismatch (target: USD, current: EUR)"
    );
  });

  test('warns when no viability reference provided', () => {
    const data = {
      stages: {
        acquisition: { stage_goal: 'Goal', metrics: [] },
        activation: { stage_goal: 'Goal', metrics: [] },
        retention: { stage_goal: 'Goal', metrics: [] },
        referral: { stage_goal: 'Goal', metrics: [] },
        revenue: { stage_goal: 'Goal', metrics: [] }
      }
    };

    const warnings = validateAARRRMetricsBusinessRules(data);
    expect(warnings).toContain('No lean_viability_ref provided - targets will not be imported automatically');
  });

  test('passes with valid AAARR metrics', () => {
    // Create valid lean viability file
    const validViabilityPath = path.join(fixturesDir, 'valid-lean-viability.yaml');
    fs.writeFileSync(validViabilityPath, `type: lean-viability
version: "1.0"
last_updated: "2025-12-22"
title: "Test Viability"`);

    const data = {
      lean_viability_ref: 'valid-lean-viability.yaml',
      stages: {
        acquisition: {
          stage_goal: 'Get users',
          metrics: [
            {
              id: 'aaarr.acquisition.signup-rate',
              name: 'Signup Rate',
              target: { rate: 100, period: 'month' },
              current: { rate: 75, period: 'month' }
            }
          ]
        },
        activation: { stage_goal: 'Activate users', metrics: [] },
        retention: { stage_goal: 'Retain users', metrics: [] },
        referral: { stage_goal: 'Get referrals', metrics: [] },
        revenue: {
          stage_goal: 'Generate revenue',
          metrics: [
            {
              id: 'aaarr.revenue.arr',
              name: 'ARR',
              target: { amount: 10000, currency: 'USD' },
              current: { amount: 5000, currency: 'USD' }  // Same currency
            }
          ]
        }
      }
    };

    const warnings = validateAARRRMetricsBusinessRules(data, fixturesDir);
    expect(warnings).toHaveLength(0);
  });
});

describe('Policy Charter Schema Validation', () => {
  const { validate } = require('../src/parser/validator');

  test('validates complete policy charter structure', () => {
    const data = {
      type: 'policy-charter',
      version: '1.0',
      last_updated: '2025-12-25',
      title: 'Test Policy Charter',
      architectural_scope_ref: 'valid-arch-scope.yaml',
      aaarr_metrics_ref: 'valid-aaarr-metrics.yaml',
      goals: [
        {
          id: 'pc.goal.test-goal',
          title: 'Test Goal',
          description: 'A test operational goal',
          addresses: ['arch.goal.test'],
          aaarr_impact: ['acquisition'],
          tactics: ['pc.tactic.test-tactic'],
          policies: ['pc.policy.test-policy'],
          kpis: ['pc.kpi.test-kpi'],
          risks: ['pc.risk.test-risk']
        }
      ],
      tactics: [
        {
          id: 'pc.tactic.test-tactic',
          title: 'Test Tactic',
          description: 'A test tactic',
          drives_policies: ['pc.policy.test-policy']
        }
      ],
      policies: [
        {
          id: 'pc.policy.test-policy',
          title: 'Test Policy',
          rule: 'Test rule',
          driven_by_tactic: 'pc.tactic.test-tactic',
          enforcement: 'mandatory',
          brackets: [
            {
              condition: 'Test condition',
              rule: 'Test bracket rule'
            }
          ]
        }
      ],
      risks: [
        {
          id: 'pc.risk.test-risk',
          description: 'Test risk',
          probability: 'medium',
          impact: 'high',
          mitigation: ['pc.tactic.test-tactic']
        }
      ],
      kpis: [
        {
          id: 'pc.kpi.test-kpi',
          name: 'Test KPI',
          target: { rate: 100 },
          current: { rate: 80 },
          measurement_frequency: 'monthly',
          justification: 'aaarr.acquisition.test-metric'
        }
      ]
    };

    expect(() => validate(data, 'policy-charter')).not.toThrow();
  });

  test('rejects invalid goal ID pattern', () => {
    const data = {
      type: 'policy-charter',
      version: '1.0',
      last_updated: '2025-12-25',
      title: 'Test',
      architectural_scope_ref: 'valid-arch-scope.yaml',
      aaarr_metrics_ref: 'valid-aaarr-metrics.yaml',
      goals: [
        {
          id: 'invalid-goal-id',  // Should fail pattern validation
          title: 'Test Goal',
          description: 'Test',
          addresses: [],
          aaarr_impact: [],
          tactics: [],
          policies: [],
          kpis: [],
          risks: []
        }
      ],
      tactics: [],
      policies: [],
      risks: [],
      kpis: []
    };

    expect(() => validate(data, 'policy-charter')).toThrow();
  });

  test('requires all required fields', () => {
    const data = {
      type: 'policy-charter',
      version: '1.0',
      last_updated: '2025-12-25',
      title: 'Test',
      architectural_scope_ref: 'valid-arch-scope.yaml',
      aaarr_metrics_ref: 'valid-aaarr-metrics.yaml'
      // missing goals
    };

    expect(() => validate(data, 'policy-charter')).toThrow();
  });

  test('validates semantic ID patterns for all entities', () => {
    const data = {
      type: 'policy-charter',
      version: '1.0',
      last_updated: '2025-12-25',
      title: 'Test',
      architectural_scope_ref: 'valid-arch-scope.yaml',
      aaarr_metrics_ref: 'valid-aaarr-metrics.yaml',
      goals: [
        {
          id: 'pc.goal.valid',
          title: 'Test Goal',
          description: 'Test',
          addresses: [],
          aaarr_impact: [],
          tactics: [],
          policies: [],
          kpis: [],
          risks: []
        }
      ],
      tactics: [
        {
          id: 'pc.tactic.valid',
          title: 'Test Tactic',
          description: 'Test',
          drives_policies: []
        }
      ],
      policies: [
        {
          id: 'pc.policy.valid',
          title: 'Test Policy',
          rule: 'Test rule',
          driven_by_tactic: 'pc.tactic.valid',
          enforcement: 'mandatory'
        }
      ],
      risks: [
        {
          id: 'pc.risk.valid',
          description: 'Test risk',
          probability: 'medium',
          impact: 'high',
          mitigation: []
        }
      ],
      kpis: [
        {
          id: 'pc.kpi.valid',
          name: 'Test KPI',
          target: { rate: 100 },
          current: { rate: 80 },
          measurement_frequency: 'monthly',
          justification: 'aaarr.acquisition.test-metric'
        }
      ]
    };

    expect(() => validate(data, 'policy-charter')).not.toThrow();
  });

  test('validates graduated policy brackets structure', () => {
    const data = {
      type: 'policy-charter',
      version: '1.0',
      last_updated: '2025-12-25',
      title: 'Test',
      architectural_scope_ref: 'valid-arch-scope.yaml',
      aaarr_metrics_ref: 'valid-aaarr-metrics.yaml',
      goals: [],
      tactics: [
        {
          id: 'pc.tactic.test',
          title: 'Test Tactic',
          description: 'Test',
          drives_policies: []
        }
      ],
      policies: [
        {
          id: 'pc.policy.test',
          title: 'Test Policy',
          rule: 'Test rule',
          driven_by_tactic: 'pc.tactic.test',
          enforcement: 'mandatory',
          brackets: [
            {
              condition: 'High complexity',
              rule: 'Require full review'
            },
            {
              condition: 'Low complexity',
              rule: 'Allow self-review'
            }
          ]
        }
      ],
      risks: [],
      kpis: []
    };

    expect(() => validate(data, 'policy-charter')).not.toThrow();
  });

  test('validates KPI value structures', () => {
    const data = {
      type: 'policy-charter',
      version: '1.0',
      last_updated: '2025-12-25',
      title: 'Test',
      architectural_scope_ref: 'valid-arch-scope.yaml',
      aaarr_metrics_ref: 'valid-aaarr-metrics.yaml',
      goals: [],
      tactics: [],
      policies: [],
      risks: [],
      kpis: [
        {
          id: 'pc.kpi.test',
          name: 'Test KPI',
          target: { rate: 100, period: 'month' },
          current: { rate: 80, period: 'month' },
          measurement_frequency: 'monthly',
          justification: 'aaarr.acquisition.test-metric'
        }
      ]
    };

    expect(() => validate(data, 'policy-charter')).not.toThrow();
  });
});
