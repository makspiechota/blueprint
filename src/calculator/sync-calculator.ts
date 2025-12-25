import { LeanViability, AARRRMetrics } from '../parser/types';

export interface SyncChange {
  metricId: string;
  field: string;
  oldValue: any;
  newValue: any;
  importedFrom: string;
}

export interface SyncResult {
  changes: SyncChange[];
  aaarrMetrics: AARRRMetrics;
  lastSynced: string;
}

export function syncTargetsFromLeanViability(
  leanViability: LeanViability,
  aaarrMetrics: AARRRMetrics,
  lastSynced: string = new Date().toISOString().split('T')[0]
): SyncResult {
  const result = aaarrMetrics;
  const changes: SyncChange[] = [];

  // Update last_updated timestamp
  result.last_updated = lastSynced;

  // Sync all metrics based on imported_from references
  const stages = ['acquisition', 'activation', 'retention', 'referral', 'revenue'] as const;

  stages.forEach(stageName => {
    const stage = result.stages[stageName];
    if (stage?.metrics) {
      stage.metrics.forEach((metric: any) => {
        const metricChanges = syncMetricFromViability(leanViability, metric);
        changes.push(...metricChanges);
      });
    }
  });

  return {
    changes,
    aaarrMetrics: result,
    lastSynced
  };
}

function syncMetricFromViability(viability: LeanViability, metric: any): SyncChange[] {
  const changes: SyncChange[] = [];

  // Check imported_from to determine what to sync
  if (!metric.imported_from) {
    return changes;
  }

  const importedPath = metric.imported_from.split('.');

  if (importedPath[0] === 'lean-viability') {
    let newValue: any = null;

    if (importedPath[1] === 'targets') {
      newValue = getValueFromViabilityTargets(viability, importedPath.slice(2));
    } else if (importedPath[1] === 'calculations') {
      newValue = getValueFromViabilityCalculations(viability, importedPath.slice(2));
    } else if (importedPath[1] === 'success_criteria') {
      newValue = getValueFromViabilitySuccessCriteria(viability, importedPath.slice(2));
    }

    if (newValue !== null && metric.target) {
      // Update target based on the type of value
      if (newValue.rate !== undefined && metric.target.rate !== newValue.rate) {
        changes.push({
          metricId: metric.id,
          field: 'rate',
          oldValue: metric.target.rate,
          newValue: newValue.rate,
          importedFrom: metric.imported_from
        });
        metric.target.rate = newValue.rate;
      }
      if (newValue.amount !== undefined && metric.target.amount !== newValue.amount) {
        changes.push({
          metricId: metric.id,
          field: 'amount',
          oldValue: metric.target.amount,
          newValue: newValue.amount,
          importedFrom: metric.imported_from
        });
        metric.target.amount = newValue.amount;
      }
      if (newValue.percentage !== undefined && metric.target.percentage !== newValue.percentage) {
        changes.push({
          metricId: metric.id,
          field: 'percentage',
          oldValue: metric.target.percentage,
          newValue: newValue.percentage,
          importedFrom: metric.imported_from
        });
        metric.target.percentage = newValue.percentage;
      }
      if (newValue.period && metric.target.period !== newValue.period) {
        changes.push({
          metricId: metric.id,
          field: 'period',
          oldValue: metric.target.period,
          newValue: newValue.period,
          importedFrom: metric.imported_from
        });
        metric.target.period = newValue.period;
      }
      if (newValue.currency && metric.target.currency !== newValue.currency) {
        changes.push({
          metricId: metric.id,
          field: 'currency',
          oldValue: metric.target.currency,
          newValue: newValue.currency,
          importedFrom: metric.imported_from
        });
        metric.target.currency = newValue.currency;
      }
    }
  }

  return changes;
}

function getValueFromViabilityTargets(viability: LeanViability, path: string[]): any {
  if (path[0] === 'acquisition' && path[1] === 'monthly_signups') {
    return viability.targets.acquisition?.monthly_signups;
  }
  if (path[0] === 'revenue' && path[1] === 'arpu') {
    return viability.targets.revenue?.arpu;
  }
  return null;
}

function getValueFromViabilityCalculations(viability: LeanViability, path: string[]): any {
  if (path[0] === 'monthly_visitors') {
    return { rate: viability.calculations.monthly_visitors?.rate, period: viability.calculations.monthly_visitors?.period };
  }
  if (path[0] === 'conversion_rate') {
    return { percentage: viability.calculations.conversion_rate?.rate };
  }
  if (path[0] === 'required_customers') {
    return { rate: viability.calculations.required_customers?.count, period: 'month' };
  }
  if (path[0] === 'churn_rate') {
    return { percentage: viability.calculations.churn_rate?.monthly_rate ? viability.calculations.churn_rate.monthly_rate * 100 : undefined };
  }
  if (path[0] === 'annual_revenue_per_customer') {
    return { amount: viability.calculations.annual_revenue_per_customer?.amount / 12, currency: viability.calculations.annual_revenue_per_customer?.currency, period: 'month' };
  }
  return null;
}

function getValueFromViabilitySuccessCriteria(viability: LeanViability, path: string[]): any {
  if (path[0] === 'annual_revenue') {
    return { amount: viability.success_criteria.annual_revenue.amount, currency: viability.success_criteria.annual_revenue.currency, period: 'year' };
  }
  return null;
}

export function formatSyncChanges(changes: SyncChange[]): string {
  if (changes.length === 0) {
    return 'No changes needed - targets are already in sync.';
  }

  let output = `Found ${changes.length} change${changes.length === 1 ? '' : 's'}:\n\n`;

  changes.forEach(change => {
    const oldDisplay = change.oldValue !== undefined ? change.oldValue.toLocaleString() : 'undefined';
    const fieldName = change.field === 'percentage' ? '%' : change.field === 'amount' ? '$' : '';

    output += `• ${change.metricId}\n`;
    output += `  ${change.field}: ${oldDisplay}${fieldName} → ${change.newValue.toLocaleString()}${fieldName}\n`;
    output += `  Imported from: ${change.importedFrom}\n\n`;
  });

  return output;
}