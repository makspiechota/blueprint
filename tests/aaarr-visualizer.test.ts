import { generateAARRRMetricsHTML } from '../src/visualizer/aaarr-visualizer';
import { AARRRMetrics, LeanViability } from '../src/parser/types';
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

describe('generateAARRRMetricsHTML', () => {
  test('generates complete HTML with all 5 stages', () => {
    const metrics: AARRRMetrics = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-24',
      title: 'Product Metrics',
      stages: {
        acquisition: {
          stage_goal: 'Attract new users',
          metrics: [{
            id: 'aaarr.acquisition.monthly_visitors',
            name: 'Monthly Visitors',
            target: { rate: 10000, period: 'month' },
            current: { rate: 8000, period: 'month' }
          }]
        },
        activation: {
          stage_goal: 'Engage users',
          metrics: [{
            id: 'aaarr.activation.signup_rate',
            name: 'Signup Rate',
            target: { percentage: 20 },
            current: { percentage: 15 }
          }]
        },
        retention: {
          stage_goal: 'Keep users active',
          metrics: [{
            id: 'aaarr.retention.monthly_retention',
            name: 'Monthly Retention',
            target: { percentage: 80 },
            current: { percentage: 75 }
          }]
        },
        referral: {
          stage_goal: 'Encourage referrals',
          metrics: [{
            id: 'aaarr.referral.referral_rate',
            name: 'Referral Rate',
            target: { percentage: 10 },
            current: { percentage: 5 }
          }]
        },
        revenue: {
          stage_goal: 'Generate revenue',
          metrics: [{
            id: 'aaarr.revenue.mrr',
            name: 'MRR',
            target: { amount: 100000, currency: 'USD' },
            current: { amount: 80000, currency: 'USD' }
          }]
        }
      }
    };

    const html = generateAARRRMetricsHTML(metrics);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Product Metrics');
    expect(html).toContain('Acquisition');
    expect(html).toContain('Activation');
    expect(html).toContain('Retention');
    expect(html).toContain('Referral');
    expect(html).toContain('Revenue');
  });

  test('displays metrics with targets, current, and gaps', () => {
    const metrics: AARRRMetrics = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-24',
      title: 'Test Metrics',
      stages: {
        acquisition: {
          stage_goal: 'Test goal',
          metrics: [{
            id: 'aaarr.acquisition.test_metric',
            name: 'Test Metric',
            description: 'Test description',
            target: { rate: 100, period: 'month' },
            current: { rate: 80, period: 'month' }
          }]
        },
        activation: { stage_goal: 'Test', metrics: [] },
        retention: { stage_goal: 'Test', metrics: [] },
        referral: { stage_goal: 'Test', metrics: [] },
        revenue: { stage_goal: 'Test', metrics: [] }
      }
    };

    const html = generateAARRRMetricsHTML(metrics);

    expect(html).toContain('Test Metric');
    expect(html).toContain('Test description');
    expect(html).toContain('Target:');
    expect(html).toContain('100/month');
    expect(html).toContain('Current:');
    expect(html).toContain('80/month');
    expect(html).toContain('Gap:');
  });

  test('highlights stages with gaps', () => {
    const metrics: AARRRMetrics = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-24',
      title: 'Gap Test',
      stages: {
        acquisition: {
          stage_goal: 'Has gap',
          metrics: [{
            id: 'aaarr.acquisition.gap_metric',
            name: 'Gap Metric',
            target: { rate: 100, period: 'month' },
            current: { rate: 50, period: 'month' }
          }]
        },
        activation: {
          stage_goal: 'On track',
          metrics: [{
            id: 'aaarr.activation.track_metric',
            name: 'Track Metric',
            target: { rate: 100, period: 'month' },
            current: { rate: 120, period: 'month' }
          }]
        },
        retention: { stage_goal: 'Test', metrics: [] },
        referral: { stage_goal: 'Test', metrics: [] },
        revenue: { stage_goal: 'Test', metrics: [] }
      }
    };

    const html = generateAARRRMetricsHTML(metrics);

    expect(html).toContain('class="stage has-gaps"');
    expect(html).toContain('class="stage on-track"');
    expect(html).toContain('border-color: #e74c3c');
    expect(html).toContain('border-color: #27ae60');
  });

  test('formats rate, amount, and percentage values correctly', () => {
    const metrics: AARRRMetrics = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-24',
      title: 'Format Test',
      stages: {
        acquisition: {
          stage_goal: 'Test',
          metrics: [
            {
              id: 'aaarr.acquisition.rate_metric',
              name: 'Rate Metric',
              target: { rate: 1000, period: 'month' },
              current: { rate: 500, period: 'month' }
            },
            {
              id: 'aaarr.acquisition.amount_metric',
              name: 'Amount Metric',
              target: { amount: 10000, currency: 'USD' },
              current: { amount: 5000, currency: 'USD' }
            },
            {
              id: 'aaarr.acquisition.percent_metric',
              name: 'Percent Metric',
              target: { percentage: 50 },
              current: { percentage: 25 }
            }
          ]
        },
        activation: { stage_goal: 'Test', metrics: [] },
        retention: { stage_goal: 'Test', metrics: [] },
        referral: { stage_goal: 'Test', metrics: [] },
        revenue: { stage_goal: 'Test', metrics: [] }
      }
    };

    const html = generateAARRRMetricsHTML(metrics);

    expect(html).toContain('1000/month');
    expect(html).toContain('$10,000');
    expect(html).toContain('50%');
  });

  test('handles missing current or target values', () => {
    const metrics: AARRRMetrics = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-24',
      title: 'Missing Values',
      stages: {
        acquisition: {
          stage_goal: 'Test',
          metrics: [
            {
              id: 'aaarr.acquisition.target_only',
              name: 'Target Only',
              target: { rate: 100, period: 'month' }
            },
            {
              id: 'aaarr.acquisition.current_only',
              name: 'Current Only',
              current: { rate: 50, period: 'month' }
            }
          ]
        },
        activation: { stage_goal: 'Test', metrics: [] },
        retention: { stage_goal: 'Test', metrics: [] },
        referral: { stage_goal: 'Test', metrics: [] },
        revenue: { stage_goal: 'Test', metrics: [] }
      }
    };

    const html = generateAARRRMetricsHTML(metrics);

    expect(html).toContain('Target Only');
    expect(html).toContain('Current Only');
    expect(html).toContain('100/month');
    expect(html).toContain('50/month');
  });

  test('escapes HTML in user-provided strings', () => {
    const metrics: AARRRMetrics = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-24',
      title: 'XSS <script>alert("test")</script>',
      stages: {
        acquisition: {
          stage_goal: 'Test & "quotes"',
          metrics: [{
            id: 'aaarr.acquisition.xss',
            name: 'Metric <strong>HTML</strong>',
            description: '<script>alert(1)</script>'
          }]
        },
        activation: { stage_goal: 'Test', metrics: [] },
        retention: { stage_goal: 'Test', metrics: [] },
        referral: { stage_goal: 'Test', metrics: [] },
        revenue: { stage_goal: 'Test', metrics: [] }
      }
    };

    const html = generateAARRRMetricsHTML(metrics);

    expect(html).not.toContain('<script>alert("test")</script>');
    expect(html).toContain('&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;');
    expect(html).toContain('&lt;strong&gt;HTML&lt;/strong&gt;');
    expect(html).toContain('&amp;');
    expect(html).toContain('&quot;');
  });

  test('includes responsive and print styles', () => {
    const metrics: AARRRMetrics = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-24',
      title: 'Style Test',
      stages: {
        acquisition: { stage_goal: 'Test', metrics: [] },
        activation: { stage_goal: 'Test', metrics: [] },
        retention: { stage_goal: 'Test', metrics: [] },
        referral: { stage_goal: 'Test', metrics: [] },
        revenue: { stage_goal: 'Test', metrics: [] }
      }
    };

    const html = generateAARRRMetricsHTML(metrics);

    expect(html).toContain('@media (max-width: 768px)');
    expect(html).toContain('@media print');
  });

  test('loads and displays viability context when lean_viability_ref is provided', () => {
    const metrics: AARRRMetrics = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-24',
      title: 'Metrics with Viability',
      lean_viability_ref: './examples/lean-viability.yaml',
      stages: {
        acquisition: { stage_goal: 'Test', metrics: [] },
        activation: { stage_goal: 'Test', metrics: [] },
        retention: { stage_goal: 'Test', metrics: [] },
        referral: { stage_goal: 'Test', metrics: [] },
        revenue: { stage_goal: 'Test', metrics: [] }
      }
    };

    const html = generateAARRRMetricsHTML(metrics);

    expect(html).toContain('AAARR Customer Factory');
    expect(html).toContain('Lean Viability Context');
    expect(html).toContain('lean-viability-success_criteria-annual_revenue');
    expect(html).toContain('Success Criteria');
  });

  test('renders tabs when viability is present', () => {
    const metrics: AARRRMetrics = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-24',
      title: 'Tab Test',
      lean_viability_ref: './examples/lean-viability.yaml',
      stages: {
        acquisition: { stage_goal: 'Test', metrics: [] },
        activation: { stage_goal: 'Test', metrics: [] },
        retention: { stage_goal: 'Test', metrics: [] },
        referral: { stage_goal: 'Test', metrics: [] },
        revenue: { stage_goal: 'Test', metrics: [] }
      }
    };

    const html = generateAARRRMetricsHTML(metrics);

    expect(html).toContain('<div class="tabs">');
    expect(html).toContain('<button class="tab-button active" onclick="switchTab(\'aaarr-tab\')">');
    expect(html).toContain('<button class="tab-button" onclick="switchTab(\'viability-tab\')">');
    expect(html).toContain('<div id="aaarr-tab" class="tab-content active">');
    expect(html).toContain('<div id="viability-tab" class="tab-content">');
  });

  test('makes imported_from values clickable when viability is loaded', () => {
    const metrics: AARRRMetrics = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-24',
      title: 'Import Test',
      lean_viability_ref: './examples/lean-viability.yaml',
      stages: {
        acquisition: {
          stage_goal: 'Test',
          metrics: [{
            id: 'aaarr.acquisition.monthly_signups',
            name: 'Monthly Signups',
            target: { rate: 232, period: 'month', imported_from: 'lean-viability.targets.acquisition.monthly_signups' },
            current: { rate: 100, period: 'month' }
          }]
        },
        activation: { stage_goal: 'Test', metrics: [] },
        retention: { stage_goal: 'Test', metrics: [] },
        referral: { stage_goal: 'Test', metrics: [] },
        revenue: { stage_goal: 'Test', metrics: [] }
      }
    };

    const html = generateAARRRMetricsHTML(metrics);

    expect(html).toContain('class="value clickable"');
    expect(html).toContain('onclick="navigateToViability');
    expect(html).toContain('<span class="import-icon">↗</span>');
    expect(html).toContain('From: lean-viability.targets.acquisition.monthly_signups');
  });

  test('includes navigation script for viability integration', () => {
    const metrics: AARRRMetrics = {
      type: 'aaarr-metrics',
      version: '1.0',
      last_updated: '2025-12-24',
      title: 'Script Test',
      lean_viability_ref: './examples/lean-viability.yaml',
      stages: {
        acquisition: { stage_goal: 'Test', metrics: [] },
        activation: { stage_goal: 'Test', metrics: [] },
        retention: { stage_goal: 'Test', metrics: [] },
        referral: { stage_goal: 'Test', metrics: [] },
        revenue: { stage_goal: 'Test', metrics: [] }
      }
    };

    const html = generateAARRRMetricsHTML(metrics);

    expect(html).toContain('function switchTab(tabName)');
    expect(html).toContain('function navigateToViability(anchor)');
    expect(html).toContain('element.scrollIntoView');
    expect(html).toContain('element.classList.add(\'highlight\')');
  });
});
