import { generateVisualization, generateCombinedVisualization } from '../src/visualizer';
import { generateLeanViabilityHTML } from '../src/visualizer/lean-viability-visualizer';
import { NorthStar, ArchitecturalScope, LeanViability } from '../src/parser/types';
import * as fs from 'fs';
import * as path from 'path';

const outputDir = path.join(__dirname, 'output');

beforeAll(() => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
});

afterAll(() => {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }
});

describe('generateVisualization', () => {
  test('generates valid HTML file', () => {
    const northStar: NorthStar = {
      type: 'north-star',
      version: '1.0',
      last_updated: '2025-12-17',
      title: 'Test North Star',
      vision: 'Test vision content',
      problem: 'Test problem content',
      solution: 'Test solution content',
      strategic_goals: [
        { title: 'Goal 1', description: 'Description 1' },
        { title: 'Goal 2', description: 'Description 2' }
      ]
    };

    const outputPath = path.join(outputDir, 'test-output.html');
    generateVisualization(northStar, outputPath);

    expect(fs.existsSync(outputPath)).toBe(true);

    const content = fs.readFileSync(outputPath, 'utf8');
    expect(content).toContain('<!DOCTYPE html>');
    expect(content).toContain('Test North Star');
    expect(content).toContain('Test vision content');
    expect(content).toContain('Test problem content');
    expect(content).toContain('Test solution content');
    expect(content).toContain('Goal 1');
    expect(content).toContain('Goal 2');
  });

  test('includes all north star sections', () => {
    const northStar: NorthStar = {
      type: 'north-star',
      version: '2.0',
      last_updated: '2025-12-17',
      title: 'Complete North Star',
      vision: 'Vision text',
      problem: 'Problem text',
      solution: 'Solution text',
      strategic_goals: [{ title: 'Goal', description: 'Desc' }]
    };

    const outputPath = path.join(outputDir, 'complete.html');
    generateVisualization(northStar, outputPath);

    const content = fs.readFileSync(outputPath, 'utf8');
    expect(content).toContain('Vision');
    expect(content).toContain('Problem');
    expect(content).toContain('Solution');
    expect(content).toContain('Strategic Goals');
  });
});

describe('generateCombinedVisualization', () => {
  test('generates tabbed UI with both north star and architectural scope', () => {
    const northStar: NorthStar = {
      type: 'north-star',
      version: '2.0',
      last_updated: '2025-12-18',
      title: 'Test Product',
      vision: 'Vision text',
      problem: 'Problem text',
      solution: 'Solution text',
      strategic_goals: [{ title: 'Goal 1', description: 'Desc 1' }]
    };

    const architecturalScope: ArchitecturalScope = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-18',
      title: 'Test Product',
      north_star_ref: 'north-star.yaml',
      why: {
        mission: {
          action: 'to provide',
          service: 'test services',
          beneficiary: 'test users'
        },
        goals: [
          { title: 'To achieve goal 1', description: 'Goal desc 1' }
        ]
      },
      what: [
        { title: 'Entity 1', description: 'What desc 1' },
        { title: 'Entity 2', description: 'What desc 2' },
        { title: 'Entity 3', description: 'What desc 3' }
      ],
      how: [
        { title: 'Process 1', description: 'How desc 1' },
        { title: 'Process 2', description: 'How desc 2' },
        { title: 'Process 3', description: 'How desc 3' }
      ]
    };

    const outputPath = path.join(outputDir, 'combined.html');
    generateCombinedVisualization(northStar, architecturalScope, outputPath);

    expect(fs.existsSync(outputPath)).toBe(true);

    const content = fs.readFileSync(outputPath, 'utf8');

    // Check for tabbed interface
    expect(content).toContain('North Star');
    expect(content).toContain('Architectural Scope');

    // Check north star content
    expect(content).toContain('Vision text');
    expect(content).toContain('Goal 1');

    // Check architectural scope content
    expect(content).toContain('Entity 1');
    expect(content).toContain('Process 1');
  });

  test('displays all six scope lists in grid layout', () => {
    const northStar: NorthStar = {
      type: 'north-star',
      version: '2.0',
      last_updated: '2025-12-18',
      title: 'Test',
      vision: 'V',
      problem: 'P',
      solution: 'S',
      strategic_goals: []
    };

    const architecturalScope: ArchitecturalScope = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-18',
      title: 'Test',
      north_star_ref: 'ns.yaml',
      why: {
        mission: {
          action: 'to deliver',
          service: 'quality solutions',
          beneficiary: 'customers'
        },
        goals: [
          { title: 'To achieve excellence', description: 'D1' },
          { title: 'To improve efficiency', description: 'D2' },
          { title: 'To enhance satisfaction', description: 'D3' }
        ]
      },
      what: [{ title: 'W1', description: 'D1' }, { title: 'W2', description: 'D2' }, { title: 'W3', description: 'D3' }],
      how: [{ title: 'H1', description: 'D1' }, { title: 'H2', description: 'D2' }, { title: 'H3', description: 'D3' }],
      where: [{ title: 'Wh1', description: 'D1' }, { title: 'Wh2', description: 'D2' }, { title: 'Wh3', description: 'D3' }],
      who: [{ title: 'Who1', description: 'D1' }, { title: 'Who2', description: 'D2' }, { title: 'Who3', description: 'D3' }],
      when: [{ title: 'When1', description: 'D1' }, { title: 'When2', description: 'D2' }, { title: 'When3', description: 'D3' }]
    };

    const outputPath = path.join(outputDir, 'all-lists.html');
    generateCombinedVisualization(northStar, architecturalScope, outputPath);

    const content = fs.readFileSync(outputPath, 'utf8');

    // Check for all scope list headers
    expect(content).toContain('What');
    expect(content).toContain('How');
    expect(content).toContain('Where');
    expect(content).toContain('Who');
    expect(content).toContain('When');
    // WHY is rendered differently now (mission + goals structure)
    // Full WHY visualization will be updated in Task 004
  });

  test('handles architectural scope with no scope lists', () => {
    const northStar: NorthStar = {
      type: 'north-star',
      version: '2.0',
      last_updated: '2025-12-18',
      title: 'Test',
      vision: 'V',
      problem: 'P',
      solution: 'S',
      strategic_goals: []
    };

    const architecturalScope: ArchitecturalScope = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-18',
      title: 'Test',
      north_star_ref: 'ns.yaml',
      why: {
        mission: {
          action: 'to provide',
          service: 'minimal services',
          beneficiary: 'users'
        }
      }
    };

    const outputPath = path.join(outputDir, 'empty-scope.html');
    generateCombinedVisualization(northStar, architecturalScope, outputPath);

    expect(fs.existsSync(outputPath)).toBe(true);
    const content = fs.readFileSync(outputPath, 'utf8');
    expect(content).toContain('<!DOCTYPE html>');
  });
});

describe('generateLeanViabilityHTML', () => {
  test('generates valid HTML with all sections', () => {
    const viability: LeanViability = {
      type: 'lean-viability',
      version: '1.0',
      last_updated: '2025-12-21',
      title: 'Test Viability Analysis',
      lean_canvas_ref: 'lean-canvas.yaml',
      time_horizon: {
        duration: 3,
        unit: 'years'
      },
      success_criteria: {
        annual_revenue: {
          amount: 10000000,
          currency: 'USD'
        },
        target_year: 3
      },
      calculations: {
        annual_revenue_per_customer: {
          amount: 1200,
          currency: 'USD',
          basis: 'Based on market research'
        },
        required_customers: {
          count: 8334,
          formula: '$10,000,000 / $1,200'
        },
        customer_acquisition_rate: {
          rate: 2778,
          period: 'year',
          formula: '8,334 / 3 years'
        },
        monthly_acquisition_target: {
          rate: 232,
          period: 'month',
          formula: '2,778 / 12 months'
        }
      },
      targets: {
        acquisition: {
          monthly_signups: {
            rate: 232,
            period: 'month'
          }
        }
      }
    };

    const html = generateLeanViabilityHTML(viability);

    // Check HTML structure
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('</html>');

    // Check title
    expect(html).toContain('Test Viability Analysis');
    expect(html).toContain('Version 1.0');
    expect(html).toContain('Last updated: 2025-12-21');

    // Check Success Criteria section
    expect(html).toContain('Success Criteria');
    expect(html).toContain('Target Revenue');
    expect(html).toContain('$10,000,000');
    expect(html).toContain('Time Horizon');
    expect(html).toContain('3 years');
    expect(html).toContain('Target Year');
    expect(html).toContain('Year 3');

    // Check Assumptions section
    expect(html).toContain('Assumptions');
    expect(html).toContain('Annual Revenue per Customer');
    expect(html).toContain('$1,200');
    expect(html).toContain('Based on market research');

    // Check Calculations section
    expect(html).toContain('Work-Backwards Calculations');
    expect(html).toContain('Required Customers');
    expect(html).toContain('8,334');
    expect(html).toContain('$10,000,000 / $1,200');
    expect(html).toContain('Customer Acquisition Rate');
    expect(html).toContain('2,778/year');
    expect(html).toContain('Monthly Acquisition Target');
    expect(html).toContain('232/month');

    // Check Generated Targets section
    expect(html).toContain('Generated Targets (for AAARR Import)');
    expect(html).toContain('Acquisition');
    expect(html).toContain('Monthly signups: 232/month');
  });

  test('handles all supported currencies', () => {
    const currencies = [
      { code: 'USD', symbol: '$' },
      { code: 'EUR', symbol: '€' },
      { code: 'PLN', symbol: 'zł' },
      { code: 'GBP', symbol: '£' }
    ];

    currencies.forEach(({ code, symbol }) => {
      const viability: LeanViability = {
        type: 'lean-viability',
        version: '1.0',
        last_updated: '2025-12-21',
        title: `Test ${code}`,
        lean_canvas_ref: 'test.yaml',
        time_horizon: { duration: 3, unit: 'years' },
        success_criteria: {
          annual_revenue: { amount: 1000000, currency: code as any },
          target_year: 3
        },
        calculations: {
          annual_revenue_per_customer: { amount: 1000, currency: code as any, basis: 'Test basis' },
          required_customers: { count: 1000, formula: 'Test formula' },
          customer_acquisition_rate: { rate: 333, period: 'year', formula: 'Test formula' },
          monthly_acquisition_target: { rate: 28, period: 'month', formula: 'Test formula' }
        },
        targets: {}
      };

      const html = generateLeanViabilityHTML(viability);
      expect(html).toContain(`${symbol}1,000,000`);
      expect(html).toContain(`${symbol}1,000`);
    });
  });

  test('formats rates with correct periods', () => {
    const viability: LeanViability = {
      type: 'lean-viability',
      version: '1.0',
      last_updated: '2025-12-21',
      title: 'Rate Test',
      lean_canvas_ref: 'test.yaml',
      time_horizon: { duration: 60, unit: 'months' },
      success_criteria: {
        annual_revenue: { amount: 1000000, currency: 'USD' },
        target_year: 5
      },
      calculations: {
        annual_revenue_per_customer: { amount: 1000, currency: 'USD', basis: 'Test basis' },
        required_customers: { count: 1000, formula: 'Test formula' },
        customer_acquisition_rate: { rate: 200, period: 'year', formula: 'Test formula' },
        monthly_acquisition_target: { rate: 17, period: 'month', formula: 'Test formula' }
      },
      targets: {
        acquisition: {
          monthly_signups: { rate: 17, period: 'month' }
        }
      }
    };

    const html = generateLeanViabilityHTML(viability);
    expect(html).toContain('200/year');
    expect(html).toContain('17/month');
    expect(html).toContain('60 months');
  });

  test('escapes HTML in user-provided strings', () => {
    const viability: LeanViability = {
      type: 'lean-viability',
      version: '1.0',
      last_updated: '2025-12-21',
      title: 'Test <script>alert("xss")</script>',
      lean_canvas_ref: 'test.yaml',
      time_horizon: { duration: 3, unit: 'years' },
      success_criteria: {
        annual_revenue: { amount: 1000000, currency: 'USD' },
        target_year: 3
      },
      calculations: {
        annual_revenue_per_customer: {
          amount: 1000,
          currency: 'USD',
          basis: 'Formula with <strong>HTML</strong> & "quotes"'
        },
        required_customers: {
          count: 1000,
          formula: 'x > 5 && y < 10'
        },
        customer_acquisition_rate: { rate: 333, period: 'year', formula: 'Test formula' },
        monthly_acquisition_target: { rate: 28, period: 'month', formula: 'Test formula' }
      },
      targets: {}
    };

    const html = generateLeanViabilityHTML(viability);

    // Check that dangerous HTML is escaped
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;strong&gt;');
    expect(html).toContain('&amp;');
    expect(html).toContain('&quot;');
    expect(html).toContain('&gt;');
    expect(html).toContain('&lt;');
  });

  test('handles viability without optional fields', () => {
    const viability: LeanViability = {
      type: 'lean-viability',
      version: '1.0',
      last_updated: '2025-12-21',
      title: 'Minimal Viability',
      lean_canvas_ref: 'test.yaml',
      time_horizon: { duration: 2, unit: 'years' },
      success_criteria: {
        annual_revenue: { amount: 500000, currency: 'EUR' },
        target_year: 2
      },
      calculations: {
        annual_revenue_per_customer: { amount: 500, currency: 'EUR', basis: 'Test basis' },
        required_customers: { count: 1000, formula: 'Test formula' },
        customer_acquisition_rate: { rate: 500, period: 'year', formula: 'Test formula' },
        monthly_acquisition_target: { rate: 42, period: 'month', formula: 'Test formula' }
      },
      targets: {}
    };

    const html = generateLeanViabilityHTML(viability);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Minimal Viability');
    expect(html).toContain('€500,000');
    expect(html).toContain('No targets generated');
  });

  test('includes responsive and print styles', () => {
    const viability: LeanViability = {
      type: 'lean-viability',
      version: '1.0',
      last_updated: '2025-12-21',
      title: 'Style Test',
      lean_canvas_ref: 'test.yaml',
      time_horizon: { duration: 3, unit: 'years' },
      success_criteria: {
        annual_revenue: { amount: 1000000, currency: 'USD' },
        target_year: 3
      },
      calculations: {
        annual_revenue_per_customer: { amount: 1000, currency: 'USD', basis: 'Test basis' },
        required_customers: { count: 1000, formula: 'Test formula' },
        customer_acquisition_rate: { rate: 333, period: 'year', formula: 'Test formula' },
        monthly_acquisition_target: { rate: 28, period: 'month', formula: 'Test formula' }
      },
      targets: {}
    };

    const html = generateLeanViabilityHTML(viability);

    // Check for responsive design
    expect(html).toContain('@media (max-width: 768px)');
    expect(html).toContain('grid-template-columns: 1fr');

    // Check for print styles
    expect(html).toContain('@media print');
    expect(html).toContain('break-inside: avoid');
  });

  test('displays revenue target with ARPU', () => {
    const viability: LeanViability = {
      type: 'lean-viability',
      version: '1.0',
      last_updated: '2025-12-21',
      title: 'ARPU Test',
      lean_canvas_ref: 'test.yaml',
      time_horizon: { duration: 3, unit: 'years' },
      success_criteria: {
        annual_revenue: { amount: 1000000, currency: 'USD' },
        target_year: 3
      },
      calculations: {
        annual_revenue_per_customer: { amount: 100, currency: 'USD', basis: 'Test basis' },
        required_customers: { count: 10000, formula: 'Test formula' },
        customer_acquisition_rate: { rate: 3333, period: 'year', formula: 'Test formula' },
        monthly_acquisition_target: { rate: 278, period: 'month', formula: 'Test formula' }
      },
      targets: {
        revenue: {
          arpu: { amount: 100, currency: 'USD', period: 'month' } as any
        }
      }
    };

    const html = generateLeanViabilityHTML(viability);

    expect(html).toContain('Revenue');
    expect(html).toContain('ARPU: $100/month');
  });
});
