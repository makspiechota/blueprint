import React from 'react';
import { LeanViability } from '../parser/types';

interface LeanViabilityVisualizerProps {
  viability: LeanViability;
}

const LeanViabilityVisualizer: React.FC<LeanViabilityVisualizerProps> = ({ viability }) => {
  return (
    <div className="container">
      <div className="header">
        <h1>{viability.title}</h1>
        <div className="metadata">
          Version {viability.version} • Last updated: {viability.last_updated}
        </div>
      </div>

      <div className="dashboard">
        <div className="section">
          <div className="section-title">Success Criteria</div>
          <div className="metric">
            <div className="metric-label">Target Revenue</div>
            <div className="metric-value">
              {viability.success_criteria?.annual_revenue?.currency === 'USD' ? '$' : '€'}
              {viability.success_criteria?.annual_revenue?.amount?.toLocaleString()}
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Time Horizon</div>
            <div className="metric-value">{viability.time_horizon.duration} {viability.time_horizon.unit}</div>
          </div>
          <div className="metric">
            <div className="metric-label">Target Year</div>
            <div className="metric-value">Year {viability.success_criteria?.target_year}</div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Assumptions</div>
          <div className="metric">
            <div className="metric-label">Annual Revenue per Customer</div>
            <div className="metric-value">
              {viability.calculations?.annual_revenue_per_customer?.currency === 'USD' ? '$' : '€'}
              {viability.calculations?.annual_revenue_per_customer?.amount?.toLocaleString()}
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Basis</div>
            <p>{viability.calculations?.annual_revenue_per_customer?.basis}</p>
          </div>
        </div>

        <div className="section full-width">
          <div className="section-title">Work-Backwards Calculations</div>

          {viability.calculations?.required_customers && (
            <div className="calculation">
              <div className="calc-name">Required Customers</div>
              <div className="calc-value">{viability.calculations.required_customers.count.toLocaleString()}</div>
              <div className="formula">{viability.calculations.required_customers.formula}</div>
            </div>
          )}

          {viability.calculations?.customer_lifetime_value && (
            <div className="calculation">
              <div className="calc-name">Customer Lifetime Value</div>
              <div className="calc-value">{viability.calculations.customer_lifetime_value.years} years</div>
              <div className="formula">{viability.calculations.customer_lifetime_value.formula}</div>
            </div>
          )}

          {viability.calculations?.churn_rate && (
            <div className="calculation">
              <div className="calc-name">Monthly Churn Rate</div>
              <div className="calc-value">{(viability.calculations.churn_rate.monthly_rate! * 100).toFixed(2)}%</div>
              <div className="formula">{viability.calculations.churn_rate.formula}</div>
            </div>
          )}

          {viability.calculations?.customer_acquisition_rate && (
            <div className="calculation">
              <div className="calc-name">Customer Acquisition Rate</div>
              <div className="calc-value">{viability.calculations.customer_acquisition_rate.rate}/{viability.calculations.customer_acquisition_rate.period}</div>
              <div className="formula">{viability.calculations.customer_acquisition_rate.formula}</div>
            </div>
          )}

          {viability.calculations?.monthly_acquisition_target && (
            <div className="calculation">
              <div className="calc-name">Monthly Acquisition Target</div>
              <div className="calc-value">{viability.calculations.monthly_acquisition_target.rate}/{viability.calculations.monthly_acquisition_target.period}</div>
              <div className="formula">{viability.calculations.monthly_acquisition_target.formula}</div>
            </div>
          )}

          {viability.calculations?.conversion_rate && (
            <div className="calculation">
              <div className="calc-name">Conversion Rate</div>
              <div className="calc-value">{(viability.calculations.conversion_rate.rate! * 100).toFixed(2)}%</div>
              <div className="formula">{viability.calculations.conversion_rate.basis}</div>
            </div>
          )}

          {viability.calculations?.monthly_visitors && (
            <div className="calculation">
              <div className="calc-name">Monthly Visitors Needed</div>
              <div className="calc-value">{viability.calculations.monthly_visitors.rate.toLocaleString()}/{viability.calculations.monthly_visitors.period}</div>
              <div className="formula">{viability.calculations.monthly_visitors.formula}</div>
            </div>
          )}
        </div>

        {viability.targets && (
          <div className="section full-width">
            <div className="section-title">Generated Targets (for AAARR Import)</div>

            {viability.targets.acquisition?.monthly_signups && (
              <div className="target-item">
                <div className="target-stage">Acquisition</div>
                <div className="target-metric">
                  Monthly signups: {viability.targets.acquisition.monthly_signups.rate}/{viability.targets.acquisition.monthly_signups.period}
                </div>
              </div>
            )}

            {viability.targets.revenue?.arpu && (
              <div className="target-item">
                <div className="target-stage">Revenue</div>
                <div className="target-metric">
                  ARPU: {viability.targets.revenue.arpu.currency === 'USD' ? '$' : '€'}{viability.targets.revenue.arpu.amount}/{viability.targets.revenue.arpu.period}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
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

        @media (max-width: 768px) {
          .dashboard {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LeanViabilityVisualizer;