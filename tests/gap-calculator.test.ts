import { calculateGap, calculateAllGaps, isNegativeGap, formatGap } from '../src/calculator/gap-calculator';

describe('calculateGap', () => {
  test('calculates rate gap correctly', () => {
    const target = { rate: 1000, period: 'month' as const };
    const current = { rate: 750, period: 'month' as const };
    const gap = calculateGap(target, current);
    expect(gap.rate).toBe(250);
  });

  test('calculates amount gap correctly', () => {
    const target = { amount: 50000, currency: 'USD' as const };
    const current = { amount: 30000, currency: 'USD' as const };
    const gap = calculateGap(target, current);
    expect(gap.amount).toBe(20000);
  });

  test('calculates percentage gap correctly', () => {
    const target = { percentage: 75 };
    const current = { percentage: 50 };
    const gap = calculateGap(target, current);
    expect(gap.percentage).toBe(25);
  });

  test('handles negative gap (current exceeds target)', () => {
    const target = { rate: 100, period: 'month' as const };
    const current = { rate: 150, period: 'month' as const };
    const gap = calculateGap(target, current);
    expect(gap.rate).toBe(-50);
    expect(isNegativeGap(gap)).toBe(true);
  });
});

describe('calculateAllGaps', () => {
  test('calculates gaps for all metrics across all stages', () => {
    const metrics = {
      type: 'aaarr-metrics' as const,
      version: '1.0',
      last_updated: '2025-12-21',
      title: 'Test Metrics',
      stages: {
        acquisition: {
          stage_goal: 'Acquire customers',
          metrics: [
            {
              id: 'aaarr.acquisition.signup-rate',
              name: 'Monthly Signups',
              target: { rate: 1000, period: 'month' as const },
              current: { rate: 750, period: 'month' as const }
            }
          ]
        },
        activation: {
          stage_goal: 'Activate customers',
          metrics: []
        },
        retention: {
          stage_goal: 'Retain customers',
          metrics: []
        },
        referral: {
          stage_goal: 'Get referrals',
          metrics: []
        },
        revenue: {
          stage_goal: 'Generate revenue',
          metrics: [
            {
              id: 'aaarr.revenue.arpu',
              name: 'ARPU',
              target: { amount: 100, currency: 'USD' as const },
              current: { amount: 80, currency: 'USD' as const }
            }
          ]
        }
      }
    };

    const result = calculateAllGaps(metrics);

    expect(result.stages.acquisition.metrics[0].gap?.rate).toBe(250);
    expect(result.stages.revenue.metrics[0].gap?.amount).toBe(20);
    expect(result.stages.activation.metrics).toHaveLength(0);
  });
});

describe('formatGap', () => {
  test('formats rate gap with sign', () => {
    expect(formatGap({ rate: 250 })).toBe('+250');
    expect(formatGap({ rate: -50 })).toBe('-50');
  });

  test('formats amount gap with currency', () => {
    expect(formatGap({ amount: 20000 })).toBe('+$20,000');
    expect(formatGap({ amount: -5000 })).toBe('-$5,000');
  });

  test('formats percentage gap with sign', () => {
    expect(formatGap({ percentage: 25.5 })).toBe('+25.5%');
    expect(formatGap({ percentage: -10.2 })).toBe('-10.2%');
  });
});