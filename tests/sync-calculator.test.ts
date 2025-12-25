import { syncTargetsFromLeanViability, formatSyncChanges, SyncResult } from '../src/calculator/sync-calculator';
import { LeanViability, AARRRMetrics } from '../src/parser/types';

describe('syncTargetsFromLeanViability', () => {
  const mockLeanViability: LeanViability = {
    type: 'lean-viability',
    version: '1.0',
    last_updated: '2025-12-21',
    title: 'Test Viability',
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
        basis: 'Test'
      },
      required_customers: {
        count: 8334,
        formula: 'Test'
      },
      customer_acquisition_rate: {
        rate: 2778,
        period: 'year',
        formula: 'Test'
      },
      monthly_acquisition_target: {
        rate: 231,
        period: 'month',
        formula: 'Test'
      },
      churn_rate: {
        monthly_rate: 0.0833,
        formula: 'Test'
      },
      conversion_rate: {
        rate: 0.02,
        basis: 'Test'
      },
      monthly_visitors: {
        rate: 11550,
        period: 'month',
        formula: 'Test'
      }
    },
    targets: {
      acquisition: {
        monthly_signups: {
          rate: 231,
          period: 'month'
        }
      },
      revenue: {
        arpu: {
          amount: 100,
          currency: 'USD',
          period: 'month'
        }
      }
    }
  };

  const mockAaarrMetrics: AARRRMetrics = {
    type: 'aaarr-metrics',
    version: '1.0',
    last_updated: '2025-12-21',
    title: 'Test AAARR Metrics',
    stages: {
      acquisition: {
        stage_goal: 'Acquire customers',
        metrics: [
          {
            id: 'aaarr.acquisition.signup-rate',
            name: 'Monthly Signups',
            target: {
              rate: 200,
              period: 'month',
              imported_from: 'lean-viability.targets.acquisition.monthly_signups'
            },
            current: {
              rate: 150,
              period: 'month'
            }
          },
          {
            id: 'aaarr.acquisition.organic-traffic',
            name: 'Monthly Visitors',
            target: {
              rate: 10000,
              period: 'month',
              imported_from: 'lean-viability.calculations.monthly_visitors'
            },
            current: {
              rate: 8000,
              period: 'month'
            }
          }
        ]
      },
      activation: {
        stage_goal: 'Activate customers',
        metrics: []
      },
      retention: {
        stage_goal: 'Retain customers',
        metrics: [
          {
            id: 'aaarr.retention.monthly-active-users',
            name: 'Monthly Active Users',
            target: {
              rate: 8000,
              period: 'month',
              imported_from: 'lean-viability.calculations.required_customers'
            },
            current: {
              rate: 5000,
              period: 'month'
            }
          }
        ]
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
            target: {
              amount: 90,
              currency: 'USD',
              period: 'month',
              imported_from: 'lean-viability.calculations.annual_revenue_per_customer'
            },
            current: {
              amount: 100,
              currency: 'USD',
              period: 'month'
            }
          }
        ]
      }
    }
  };

  test('syncs targets from lean viability calculations', () => {
    const result: SyncResult = syncTargetsFromLeanViability(mockLeanViability, mockAaarrMetrics);

    // Check that signup rate was updated
    const signupMetric = result.aaarrMetrics.stages.acquisition.metrics.find(m => m.id === 'aaarr.acquisition.signup-rate');
    expect(signupMetric?.target?.rate).toBe(231);

    // Check that visitors were updated
    const visitorsMetric = result.aaarrMetrics.stages.acquisition.metrics.find(m => m.id === 'aaarr.acquisition.organic-traffic');
    expect(visitorsMetric?.target?.rate).toBe(11550);

    // Check that MAU were updated
    const mauMetric = result.aaarrMetrics.stages.retention.metrics.find(m => m.id === 'aaarr.retention.monthly-active-users');
    expect(mauMetric?.target?.rate).toBe(8334);

    // Check that ARPU was updated (annual / 12)
    const arpuMetric = result.aaarrMetrics.stages.revenue.metrics.find(m => m.id === 'aaarr.revenue.arpu');
    expect(arpuMetric?.target?.amount).toBe(100); // 1200 / 12

    // Check changes array
    expect(result.changes.length).toBeGreaterThan(0);
    expect(result.changes.some(c => c.metricId === 'aaarr.acquisition.signup-rate' && c.field === 'rate')).toBe(true);
  });

  test('sets last_updated timestamp', () => {
    const testDate = '2025-12-25';
    const result: SyncResult = syncTargetsFromLeanViability(mockLeanViability, mockAaarrMetrics, testDate);

    expect(result.lastSynced).toBe(testDate);
    expect(result.aaarrMetrics.last_updated).toBe(testDate);
  });

  test('only updates metrics with imported_from', () => {
    const metricsWithoutImport = JSON.parse(JSON.stringify(mockAaarrMetrics)) as AARRRMetrics;
    metricsWithoutImport.stages.activation.metrics = [
      {
        id: 'aaarr.activation.test',
        name: 'Test Metric',
        target: {
          rate: 100,
          period: 'month' as const
          // No imported_from
        }
      }
    ];

    const result: SyncResult = syncTargetsFromLeanViability(mockLeanViability, metricsWithoutImport);

    // Should not change metrics without imported_from
    const testMetric = result.aaarrMetrics.stages.activation.metrics.find(m => m.id === 'aaarr.activation.test');
    expect(testMetric?.target?.rate).toBe(100);
  });

  test('handles no changes when targets match', () => {
    const matchingMetrics = JSON.parse(JSON.stringify(mockAaarrMetrics)) as AARRRMetrics;
    matchingMetrics.stages.acquisition.metrics[0].target!.rate = 231; // Already matches

    const result: SyncResult = syncTargetsFromLeanViability(mockLeanViability, matchingMetrics);

    // Should have no changes for this metric
    expect(result.changes.filter(c => c.metricId === 'aaarr.acquisition.signup-rate')).toHaveLength(0);
  });
});

describe('formatSyncChanges', () => {
  test('formats changes correctly', () => {
    const changes = [
      {
        metricId: 'aaarr.acquisition.signup-rate',
        field: 'rate' as const,
        oldValue: 150,
        newValue: 231,
        importedFrom: 'lean-viability.targets.acquisition.monthly_signups'
      },
      {
        metricId: 'aaarr.revenue.arr',
        field: 'amount' as const,
        oldValue: 6000000,
        newValue: 10000000,
        importedFrom: 'lean-viability.success_criteria.annual_revenue'
      }
    ];

    const output = formatSyncChanges(changes);

    expect(output).toContain('Found 2 changes');
    expect(output).toContain('aaarr.acquisition.signup-rate');
    expect(output).toContain('150 → 231');
    expect(output).toContain('aaarr.revenue.arr');
    expect(output).toContain('6,000,000$ → 10,000,000$');
  });

  test('handles no changes', () => {
    const output = formatSyncChanges([]);

    expect(output).toContain('No changes needed');
  });
});