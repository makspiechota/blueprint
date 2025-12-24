import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const testDir = path.join(__dirname, 'test-cli');
const outputDir = path.join(testDir, 'output');

beforeAll(() => {
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const validYaml = `type: north-star
version: "2.0"
last_updated: "2025-12-17"
title: "Test North Star"
vision: "Test vision content"
problem: "Test problem content"
solution: "Test solution content"
strategic_goals:
  - title: "Goal 1"
    description: "Description 1"`;

  fs.writeFileSync(path.join(testDir, 'valid.yaml'), validYaml, 'utf8');
  fs.writeFileSync(path.join(testDir, 'north-star.yaml'), validYaml, 'utf8');

  const invalidYaml = `type: wrong-type
version: "2.0"`;

  fs.writeFileSync(path.join(testDir, 'invalid.yaml'), invalidYaml, 'utf8');

  const validArchScope = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-18"
title: "Test Scope"
north_star_ref: "north-star.yaml"
why:
  mission:
    action: "to provide"
    service: "comprehensive testing capabilities"
    beneficiary: "development teams"
  goals:
    - title: "To ensure code quality"
      description: "Maintain high standards through automated testing"
    - title: "To reduce defects"
      description: "Catch issues early in development"
what:
  - title: "Entity 1"
    description: "Description 1"
  - title: "Entity 2"
    description: "Description 2"
  - title: "Entity 3"
    description: "Description 3"
how:
  - title: "Process 1"
    description: "Description 1"
  - title: "Process 2"
    description: "Description 2"
  - title: "Process 3"
    description: "Description 3"`;

  fs.writeFileSync(path.join(testDir, 'architectural-scope.yaml'), validArchScope, 'utf8');

  const validLeanCanvas = `type: lean-canvas
version: "1.0"
last_updated: "2025-12-21"
title: "Test Lean Canvas"
problem:
  top_3_problems:
    - "Problem 1"`;

  fs.writeFileSync(path.join(testDir, 'lean-canvas.yaml'), validLeanCanvas, 'utf8');

  const validLeanViability = `type: lean-viability
version: "1.0"
last_updated: "2025-12-21"
title: "Test Viability Analysis"
lean_canvas_ref: "lean-canvas.yaml"
time_horizon:
  duration: 3
  unit: years
success_criteria:
  annual_revenue:
    amount: 10000000
    currency: USD
  target_year: 3
calculations:
  annual_revenue_per_customer:
    amount: 1200
    currency: USD
    basis: "Based on market research"
  required_customers:
    count: 8334
    formula: "$10,000,000 / $1,200"
  customer_acquisition_rate:
    rate: 2778
    period: year
    formula: "8,334 / 3 years"
  monthly_acquisition_target:
    rate: 232
    period: month
    formula: "2,778 / 12 months"
targets:
  acquisition:
    monthly_signups:
      rate: 232
      period: month`;

   fs.writeFileSync(path.join(testDir, 'lean-viability.yaml'), validLeanViability, 'utf8');

   const validAaarrMetrics = `type: aaarr-metrics
version: "1.0"
last_updated: "2025-12-24"
title: "Test AAARR Metrics"
lean_viability_ref: "lean-viability.yaml"
stages:
  acquisition:
    stage_goal: "Acquire 1000 customers per month"
    metrics:
      - id: "aaarr.acquisition.visitors"
        name: "Monthly Website Visitors"
        description: "Number of unique visitors to website"
        target:
          rate: 50000
          period: month
        current:
          rate: 45000
          period: month
      - id: "aaarr.acquisition.conversions"
        name: "Conversion Rate"
        description: "Percentage of visitors who sign up"
        target:
          percentage: 2.0
        current:
          percentage: 1.8
  activation:
    stage_goal: "Activate 80% of acquired customers"
    metrics:
      - id: "aaarr.activation.onboarding"
        name: "Onboarding Completion Rate"
        description: "Percentage who complete onboarding"
        target:
          percentage: 80.0
        current:
          percentage: 75.0
  retention:
    stage_goal: "Retain 90% of customers monthly"
    metrics:
      - id: "aaarr.retention.churn"
        name: "Monthly Churn Rate"
        description: "Percentage of customers who leave"
        target:
          percentage: 10.0
        current:
          percentage: 12.0
  referral:
    stage_goal: "Generate referrals from 20% of customers"
    metrics:
      - id: "aaarr.referral.rate"
        name: "Referral Rate"
        description: "Percentage of customers who refer others"
        target:
          percentage: 20.0
        current:
          percentage: 15.0
  revenue:
    stage_goal: "Achieve $100K monthly recurring revenue"
    metrics:
      - id: "aaarr.revenue.mrr"
        name: "Monthly Recurring Revenue"
        description: "Total MRR from active customers"
        target:
          amount: 100000
          currency: USD
          period: month
        current:
          amount: 85000
          currency: USD
          period: month`;

   fs.writeFileSync(path.join(testDir, 'aaarr-metrics.yaml'), validAaarrMetrics, 'utf8');
 });

afterAll(() => {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true });
  }
});

describe('CLI Integration Tests', () => {
  test('visualize command generates HTML file', () => {
    const inputPath = path.join(testDir, 'valid.yaml');
    const outputPath = path.join(outputDir, 'test-output.html');

    const result = execSync(`npm run build && node dist/index.js visualize ${inputPath} -o ${outputPath}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });

    expect(fs.existsSync(outputPath)).toBe(true);
    expect(result).toContain('successfully');
  });

  test('validate command succeeds for valid file', () => {
    const inputPath = path.join(testDir, 'valid.yaml');

    const result = execSync(`node dist/index.js validate ${inputPath}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });

    expect(result).toContain('valid');
  });

  test('validate command fails for invalid file', () => {
    const inputPath = path.join(testDir, 'invalid.yaml');

    expect(() => {
      execSync(`node dist/index.js validate ${inputPath}`, {
        encoding: 'utf8',
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });
    }).toThrow();
  });

  test('validate command succeeds for architectural scope file', () => {
    const inputPath = path.join(testDir, 'architectural-scope.yaml');

    const result = execSync(`node dist/index.js validate ${inputPath}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });

    expect(result).toContain('valid');
  });

  test('visualize command generates combined visualization when both files exist', () => {
    const inputPath = path.join(testDir, 'architectural-scope.yaml');
    const outputPath = path.join(outputDir, 'combined.html');

    const result = execSync(`node dist/index.js visualize ${inputPath} -o ${outputPath}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });

    expect(fs.existsSync(outputPath)).toBe(true);
    expect(result).toContain('successfully');

    const content = fs.readFileSync(outputPath, 'utf8');
    expect(content).toContain('North Star');
    expect(content).toContain('Architectural Scope');
  });

  test('visualize command with north star detects architectural scope', () => {
    const inputPath = path.join(testDir, 'north-star.yaml');
    const outputPath = path.join(outputDir, 'auto-detected.html');

    const result = execSync(`node dist/index.js visualize ${inputPath} -o ${outputPath}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });

    expect(fs.existsSync(outputPath)).toBe(true);

    const content = fs.readFileSync(outputPath, 'utf8');
    expect(content).toContain('North Star');
    expect(content).toContain('Architectural Scope');
  });

  test('validate command succeeds for lean-viability file', () => {
    const inputPath = path.join(testDir, 'lean-viability.yaml');

    const result = execSync(`node dist/index.js validate ${inputPath}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });

    expect(result).toContain('valid');
  });

  test('visualize command generates viability dashboard', () => {
    const inputPath = path.join(testDir, 'lean-viability.yaml');
    const outputPath = path.join(outputDir, 'viability-dashboard.html');

    const result = execSync(`node dist/index.js visualize ${inputPath} -o ${outputPath}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });

    expect(fs.existsSync(outputPath)).toBe(true);
    expect(result).toContain('successfully');

    const content = fs.readFileSync(outputPath, 'utf8');
    expect(content).toContain('Test Viability Analysis');
    expect(content).toContain('Success Criteria');
    expect(content).toContain('Work-Backwards Calculations');
  });

  test('visualize command displays warnings for lean-viability', () => {
    // Create a viability file with a short time horizon (should trigger warning)
    const shortHorizonViability = `type: lean-viability
version: "1.0"
last_updated: "2025-12-21"
title: "Short Horizon Test"
lean_canvas_ref: "lean-canvas.yaml"
time_horizon:
  duration: 1
  unit: years
success_criteria:
  annual_revenue:
    amount: 1000000
    currency: USD
  target_year: 1
calculations:
  annual_revenue_per_customer:
    amount: 1000
    currency: USD
    basis: "Test basis"
  required_customers:
    count: 1000
    formula: "Test formula"
  customer_acquisition_rate:
    rate: 1000
    period: year
    formula: "Test formula"
  monthly_acquisition_target:
    rate: 84
    period: month
    formula: "Test formula"
targets: {}`;

    const inputPath = path.join(testDir, 'short-horizon.yaml');
    fs.writeFileSync(inputPath, shortHorizonViability, 'utf8');

    const result = execSync(`node dist/index.js visualize ${inputPath}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });

    expect(result).toContain('Warnings');
    expect(result).toContain('too short');
  });

  describe('AAARR Metrics CLI', () => {
    test('validates aaarr-metrics file', () => {
      const inputPath = path.join(testDir, 'aaarr-metrics.yaml');

      const result = execSync(`node dist/index.js validate ${inputPath}`, {
        encoding: 'utf8',
        cwd: path.join(__dirname, '..')
      });

      expect(result).toContain('AAARR Metrics file is valid');
    });

    test('generates aaarr-dashboard.html', () => {
      const inputPath = path.join(testDir, 'aaarr-metrics.yaml');
      const outputPath = path.join(outputDir, 'aaarr-dashboard.html');

      const result = execSync(`node dist/index.js visualize ${inputPath} -o ${outputPath}`, {
        encoding: 'utf8',
        cwd: path.join(__dirname, '..')
      });

      expect(fs.existsSync(outputPath)).toBe(true);
      expect(result).toContain('AAARR Metrics visualization generated successfully');

      const content = fs.readFileSync(outputPath, 'utf8');
      expect(content).toContain('Test AAARR Metrics');
      expect(content).toContain('Acquisition');
      expect(content).toContain('Activation');
      expect(content).toContain('Retention');
      expect(content).toContain('Referral');
      expect(content).toContain('Revenue');
    });

    test('displays warnings for missing viability reference', () => {
      // Create aaarr-metrics file without lean_viability_ref
      const noRefMetrics = `type: aaarr-metrics
version: "1.0"
last_updated: "2025-12-24"
title: "Test AAARR Metrics No Ref"
stages:
  acquisition:
    stage_goal: "Acquire customers"
    metrics:
      - id: "aaarr.acquisition.test"
        name: "Test Metric"
        target:
          rate: 100
          period: month
        current:
          rate: 90
          period: month
  activation:
    stage_goal: "Activate customers"
    metrics: []
  retention:
    stage_goal: "Retain customers"
    metrics: []
  referral:
    stage_goal: "Get referrals"
    metrics: []
  revenue:
    stage_goal: "Generate revenue"
    metrics: []`;

      const inputPath = path.join(testDir, 'no-ref-aaarr.yaml');
      fs.writeFileSync(inputPath, noRefMetrics, 'utf8');

      const result = execSync(`node dist/index.js validate ${inputPath}`, {
        encoding: 'utf8',
        cwd: path.join(__dirname, '..')
      });

      expect(result).toContain('Validation warnings');
    });
  });
});
