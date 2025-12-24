import * as fs from 'fs';
import * as path from 'path';
import { parseAARRRMetrics } from '../src/parser';
import { generateAARRRMetricsHTML } from '../src/visualizer/aaarr-visualizer';

const examplePath = path.join(__dirname, '..', 'examples', 'aaarr-metrics.yaml');

describe('AAARR Metrics Example', () => {
  test('examples/aaarr-metrics.yaml file exists', () => {
    expect(fs.existsSync(examplePath)).toBe(true);
  });

  test('example file parses successfully', () => {
    const metrics = parseAARRRMetrics(examplePath);
    expect(metrics.type).toBe('aaarr-metrics');
    expect(metrics.version).toBe('1.0');
    expect(metrics.title).toBe('BLUEPRINT AAARR Metrics');
  });

  test('example includes all 5 AAARR stages', () => {
    const metrics = parseAARRRMetrics(examplePath);
    const stages = Object.keys(metrics.stages);
    expect(stages).toHaveLength(5);
    expect(stages).toContain('acquisition');
    expect(stages).toContain('activation');
    expect(stages).toContain('retention');
    expect(stages).toContain('referral');
    expect(stages).toContain('revenue');
  });

  test('each stage has 2-3 metrics with semantic IDs', () => {
    const metrics = parseAARRRMetrics(examplePath);
    const stages = ['acquisition', 'activation', 'retention', 'referral', 'revenue'];

    stages.forEach(stageName => {
      const stage = (metrics.stages as any)[stageName];
      expect(stage.metrics).toBeDefined();
      expect(Array.isArray(stage.metrics)).toBe(true);
      expect(stage.metrics.length).toBeGreaterThanOrEqual(2);
      expect(stage.metrics.length).toBeLessThanOrEqual(3);

      stage.metrics.forEach((metric: any) => {
        expect(metric.id).toBeDefined();
        expect(metric.id).toMatch(/^aaarr\./);
        expect(metric.name).toBeDefined();
        expect(metric.description).toBeDefined();
      });
    });
  });

  test('metrics include targets imported from lean-viability where applicable', () => {
    const metrics = parseAARRRMetrics(examplePath);
    const allMetrics = Object.values(metrics.stages).flatMap((stage: any) => stage.metrics);

    // Check that some metrics have imported_from
    const importedMetrics = allMetrics.filter((m: any) => m.target?.imported_from);
    expect(importedMetrics.length).toBeGreaterThan(0);

    // Check specific imports
    const revenueMetric = allMetrics.find((m: any) => m.id === 'aaarr.revenue.arr');
    expect(revenueMetric?.target?.imported_from).toBe('lean-viability.success_criteria.annual_revenue');

    const arpuMetric = allMetrics.find((m: any) => m.id === 'aaarr.revenue.arpu');
    expect(arpuMetric?.target?.imported_from).toBe('lean-viability.calculations.annual_revenue_per_customer');
  });

  test('all metrics have current values', () => {
    const metrics = parseAARRRMetrics(examplePath);
    const allMetrics = Object.values(metrics.stages).flatMap((stage: any) => stage.metrics);

    allMetrics.forEach((metric: any) => {
      expect(metric.current).toBeDefined();
    });
  });

  test('metrics use mix of rate, amount, and percentage types', () => {
    const metrics = parseAARRRMetrics(examplePath);
    const allMetrics = Object.values(metrics.stages).flatMap((stage: any) => stage.metrics);

    const rateMetrics = allMetrics.filter((m: any) => m.target?.rate !== undefined);
    const amountMetrics = allMetrics.filter((m: any) => m.target?.amount !== undefined);
    const percentageMetrics = allMetrics.filter((m: any) => m.target?.percentage !== undefined);

    expect(rateMetrics.length).toBeGreaterThan(0);
    expect(amountMetrics.length).toBeGreaterThan(0);
    expect(percentageMetrics.length).toBeGreaterThan(0);
  });

  test('visualization generates successfully', () => {
    const metrics = parseAARRRMetrics(examplePath);
    const html = generateAARRRMetricsHTML(metrics, path.dirname(examplePath));

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('BLUEPRINT AAARR Metrics');
    expect(html).toContain('Acquisition');
    expect(html).toContain('Activation');
    expect(html).toContain('Retention');
    expect(html).toContain('Referral');
    expect(html).toContain('Revenue');
  });

  test('visualization shows gaps and bottlenecks clearly', () => {
    const metrics = parseAARRRMetrics(examplePath);
    const html = generateAARRRMetricsHTML(metrics, path.dirname(examplePath));

    // Should have stages marked as having gaps (red)
    expect(html).toContain('has-gaps');

    // Should show gap values
    expect(html).toContain('Gap:');
  });

  test('example is realistic for BLUEPRINT product', () => {
    const metrics = parseAARRRMetrics(examplePath);

    // Check specific BLUEPRINT-relevant metrics
    const signupMetric = Object.values(metrics.stages).flatMap((stage: any) => stage.metrics)
      .find((m: any) => m.id === 'aaarr.acquisition.signup-rate');
    expect(signupMetric).toBeDefined();
    expect(signupMetric?.target?.rate).toBe(231);
    expect(signupMetric?.target?.period).toBe('month');

    const arrMetric = Object.values(metrics.stages).flatMap((stage: any) => stage.metrics)
      .find((m: any) => m.id === 'aaarr.revenue.arr');
    expect(arrMetric).toBeDefined();
    expect(arrMetric?.target?.amount).toBe(10000000);
    expect(arrMetric?.target?.currency).toBe('USD');
  });
});