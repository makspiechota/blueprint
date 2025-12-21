import { Schemas } from '../parser/types.generated';

type LeanViability = Schemas.LeanViability;
type CurrencyAmount = Schemas.LeanViability.Definitions.CurrencyAmount;
type RatePeriod = Schemas.LeanViability.Definitions.RatePeriod;
type TimeHorizon = Schemas.LeanViability.Definitions.TimeHorizon;

export function generateLeanViabilityHTML(viability: LeanViability): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(viability.title)} - Lean 1-2-3 Viability</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 2rem;
      background: #f5f5f5;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .metadata { color: #666; font-size: 0.9rem; }

    .dashboard {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .full-width { grid-column: 1 / -1; }

    .section-title {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #333;
    }

    .metric {
      margin-bottom: 1rem;
    }

    .metric-label {
      font-size: 0.85rem;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 0.25rem;
    }

    .metric-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }

    .calculation {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f9f9f9;
      border-left: 4px solid #007bff;
      border-radius: 4px;
    }

    .calc-name {
      font-weight: bold;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .calc-value {
      font-size: 1.8rem;
      font-weight: bold;
      color: #007bff;
      margin-bottom: 0.5rem;
    }

    .formula {
      font-family: 'Courier New', monospace;
      background: #fff;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 0.9rem;
      margin: 0.5rem 0;
      border: 1px solid #e0e0e0;
    }

    .calc-formula-ref {
      font-size: 0.85rem;
      color: #666;
      font-style: italic;
    }

    .target-item {
      padding: 1rem;
      background: #f0f8ff;
      border-radius: 4px;
      margin-bottom: 0.75rem;
    }

    .target-stage {
      font-weight: bold;
      color: #007bff;
      margin-bottom: 0.25rem;
    }

    .target-metric {
      font-size: 0.95rem;
    }

    @media print {
      body { padding: 0; background: white; }
      .section { break-inside: avoid; }
    }

    @media (max-width: 768px) {
      .dashboard {
        grid-template-columns: 1fr;
      }
      .full-width {
        grid-column: 1;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${escapeHtml(viability.title)}</h1>
      <div class="metadata">
        Version ${escapeHtml(viability.version)} • Last updated: ${escapeHtml(viability.last_updated)}
      </div>
    </div>

    <div class="dashboard">
      ${renderSuccessCriteria(viability)}
      ${renderAssumptions(viability)}
      ${renderCalculations(viability)}
      ${renderTargets(viability)}
    </div>
  </div>
</body>
</html>
  `.trim();
}

function renderSuccessCriteria(viability: LeanViability): string {
  return `
    <div class="section">
      <div class="section-title">Success Criteria</div>
      <div class="metric">
        <div class="metric-label">Target Revenue</div>
        <div class="metric-value">${formatCurrency(viability.success_criteria.annual_revenue)}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Time Horizon</div>
        <div class="metric-value">${formatTimeHorizon(viability.time_horizon)}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Target Year</div>
        <div class="metric-value">Year ${viability.success_criteria.target_year}</div>
      </div>
    </div>
  `.trim();
}

function renderAssumptions(viability: LeanViability): string {
  const arpc = viability.calculations.annual_revenue_per_customer;
  return `
    <div class="section">
      <div class="section-title">Assumptions</div>
      <div class="metric">
        <div class="metric-label">Annual Revenue per Customer</div>
        <div class="metric-value">${formatCurrency(arpc)}</div>
      </div>
      ${arpc.basis ? `<div class="metric"><div class="metric-label">Basis</div><p>${escapeHtml(arpc.basis)}</p></div>` : ''}
    </div>
  `.trim();
}

function renderCalculations(viability: LeanViability): string {
  const calc = viability.calculations as any;

  return `
    <div class="section full-width">
      <div class="section-title">Work-Backwards Calculations</div>

      <div class="calculation">
        <div class="calc-name">Required Customers</div>
        <div class="calc-value">${calc.required_customers.count.toLocaleString()}</div>
        ${calc.required_customers.formula ? `<div class="formula">${escapeHtml(calc.required_customers.formula)}</div>` : ''}
      </div>

      ${calc.customer_lifetime_value ? `
      <div class="calculation">
        <div class="calc-name">Customer Lifetime Value</div>
        <div class="calc-value">${calc.customer_lifetime_value.years} ${calc.customer_lifetime_value.years === 1 ? 'year' : 'years'}</div>
        ${calc.customer_lifetime_value.formula ? `<div class="formula">${escapeHtml(calc.customer_lifetime_value.formula)}</div>` : ''}
      </div>
      ` : ''}

      ${calc.churn_rate ? `
      <div class="calculation">
        <div class="calc-name">Monthly Churn Rate</div>
        <div class="calc-value">${(calc.churn_rate.monthly_rate * 100).toFixed(2)}%</div>
        ${calc.churn_rate.formula ? `<div class="formula">${escapeHtml(calc.churn_rate.formula)}</div>` : ''}
      </div>
      ` : ''}

      <div class="calculation">
        <div class="calc-name">Customer Acquisition Rate</div>
        <div class="calc-value">${formatRate(calc.customer_acquisition_rate)}</div>
        ${calc.customer_acquisition_rate.formula ? `<div class="formula">${escapeHtml(calc.customer_acquisition_rate.formula)}</div>` : ''}
      </div>

      <div class="calculation">
        <div class="calc-name">Monthly Acquisition Target</div>
        <div class="calc-value">${formatRate(calc.monthly_acquisition_target)}</div>
        ${calc.monthly_acquisition_target.formula ? `<div class="formula">${escapeHtml(calc.monthly_acquisition_target.formula)}</div>` : ''}
      </div>

      ${calc.conversion_rate ? `
      <div class="calculation">
        <div class="calc-name">Conversion Rate</div>
        <div class="calc-value">${(calc.conversion_rate.rate * 100).toFixed(2)}%</div>
        ${calc.conversion_rate.basis ? `<div class="formula">${escapeHtml(calc.conversion_rate.basis)}</div>` : ''}
      </div>
      ` : ''}

      ${calc.monthly_visitors ? `
      <div class="calculation">
        <div class="calc-name">Monthly Visitors Needed</div>
        <div class="calc-value">${formatRate(calc.monthly_visitors)}</div>
        ${calc.monthly_visitors.formula ? `<div class="formula">${escapeHtml(calc.monthly_visitors.formula)}</div>` : ''}
      </div>
      ` : ''}
    </div>
  `.trim();
}

function renderTargets(viability: LeanViability): string {
  const targets = viability.targets;
  const items: string[] = [];

  if (targets.acquisition?.monthly_signups) {
    items.push(`
      <div class="target-item">
        <div class="target-stage">Acquisition</div>
        <div class="target-metric">Monthly signups: ${formatRate(targets.acquisition.monthly_signups)}</div>
      </div>
    `);
  }

  if (targets.revenue?.arpu) {
    const arpu = targets.revenue.arpu as any;
    items.push(`
      <div class="target-item">
        <div class="target-stage">Revenue</div>
        <div class="target-metric">ARPU: ${formatCurrency(arpu)}/${arpu.period || 'month'}</div>
      </div>
    `);
  }

  return `
    <div class="section full-width">
      <div class="section-title">Generated Targets (for AAARR Import)</div>
      ${items.length > 0 ? items.join('\n') : '<p style="color: #999;">No targets generated</p>'}
    </div>
  `.trim();
}

function formatCurrency(amount: CurrencyAmount): string {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    PLN: 'zł',
    GBP: '£'
  };
  return `${symbols[amount.currency] || amount.currency}${amount.amount.toLocaleString()}`;
}

function formatRate(rate: RatePeriod): string {
  return `${rate.rate.toLocaleString()}/${rate.period}`;
}

function formatTimeHorizon(horizon: TimeHorizon): string {
  return `${horizon.duration} ${horizon.unit}`;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
