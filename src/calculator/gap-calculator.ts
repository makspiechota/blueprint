import { AARRRMetrics } from '../parser/types';
import { Schemas } from '../parser/types.generated';

type MetricValue = Schemas.AaarrMetrics.Definitions.MetricValue;
type GapValue = Schemas.AaarrMetrics.Definitions.GapValue;

export function calculateGap(target: MetricValue, current: MetricValue): GapValue {
  const gap: GapValue = {};

  // Rate-based metrics
  if (target.rate !== undefined && current.rate !== undefined) {
    gap.rate = target.rate - current.rate;
  }

  // Amount-based metrics
  if (target.amount !== undefined && current.amount !== undefined) {
    // Ensure same currency (validator already checked this)
    gap.amount = target.amount - current.amount;
  }

  // Percentage-based metrics
  if (target.percentage !== undefined && current.percentage !== undefined) {
    gap.percentage = target.percentage - current.percentage;
  }

  return gap;
}

export function calculateAllGaps(metrics: AARRRMetrics): AARRRMetrics {
  const result = JSON.parse(JSON.stringify(metrics)); // Deep clone

  const stages = ['acquisition', 'activation', 'retention', 'referral', 'revenue'];

  stages.forEach(stageName => {
    const stage = result.stages[stageName];
    if (stage?.metrics) {
      stage.metrics.forEach((metric: any) => {
        if (metric.target && metric.current) {
          metric.gap = calculateGap(metric.target, metric.current);
        }
      });
    }
  });

  return result;
}

export function isNegativeGap(gap: GapValue): boolean {
  // Negative gap means current exceeds target (good!)
  if (gap.rate !== undefined && gap.rate < 0) return true;
  if (gap.amount !== undefined && gap.amount < 0) return true;
  if (gap.percentage !== undefined && gap.percentage < 0) return true;
  return false;
}

export function formatGap(gap: GapValue): string {
  if (gap.rate !== undefined) {
    const sign = gap.rate >= 0 ? '+' : '';
    return `${sign}${gap.rate}`;
  }
  if (gap.amount !== undefined) {
    const sign = gap.amount >= 0 ? '+' : '-';
    return `${sign}$${Math.abs(gap.amount).toLocaleString()}`;
  }
  if (gap.percentage !== undefined) {
    const sign = gap.percentage >= 0 ? '+' : '';
    return `${sign}${gap.percentage.toFixed(1)}%`;
  }
  return '0';
}