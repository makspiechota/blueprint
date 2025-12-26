import React from 'react';
import { LeanCanvas } from '../parser/types';

interface LeanCanvasVisualizerProps {
  canvas: LeanCanvas;
}

const LeanCanvasVisualizer: React.FC<LeanCanvasVisualizerProps> = ({ canvas }) => {
  return (
    <div className="container">
      <div className="header">
        <h1>{canvas.title}</h1>
        <div className="metadata">
          Version {canvas.version} • Last updated: {canvas.last_updated}
        </div>
      </div>

      <div className="canvas-grid">
        <div className="box problem">
          <div className="box-title">Problem</div>
          <div className="box-content">
            {canvas.problem?.top_3_problems && (
              <ul>
                {canvas.problem.top_3_problems.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            )}
            {canvas.problem?.existing_alternatives && (
              <p>{canvas.problem.existing_alternatives}</p>
            )}
          </div>
        </div>

        <div className="box solution">
          <div className="box-title">Solution</div>
          <div className="box-content">
            {canvas.solution?.top_3_features && (
              <ul>
                {canvas.solution.top_3_features.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            )}
          </div>
        </div>

        <div className="box uvp">
          <div className="box-title">Unique Value Proposition</div>
          <div className="box-content">
            {canvas.unique_value_proposition?.single_clear_message && (
              <p><strong>{canvas.unique_value_proposition.single_clear_message}</strong></p>
            )}
            {canvas.unique_value_proposition?.high_level_concept && (
              <p>{canvas.unique_value_proposition.high_level_concept}</p>
            )}
          </div>
        </div>

        <div className="box unfair">
          <div className="box-title">Unfair Advantage</div>
          <div className="box-content">
            <p>{canvas.unfair_advantage?.cant_be_copied}</p>
          </div>
        </div>

        <div className="box customer">
          <div className="box-title">Customer Segments</div>
          <div className="box-content">
            {canvas.customer_segments?.target_customers && (
              <p><strong>Target: </strong>{canvas.customer_segments.target_customers}</p>
            )}
            {canvas.customer_segments?.early_adopters && (
              <p><strong>Early adopters: </strong>{canvas.customer_segments.early_adopters}</p>
            )}
          </div>
        </div>

        <div className="box metrics">
          <div className="box-title">Key Metrics</div>
          <div className="box-content">
            {canvas.key_metrics?.activities_to_measure && (
              <ul>
                {canvas.key_metrics.activities_to_measure.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            )}
          </div>
        </div>

        <div className="box channels">
          <div className="box-title">Channels</div>
          <div className="box-content">
            {canvas.channels?.path_to_customers && (
              <ul>
                {canvas.channels.path_to_customers.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            )}
          </div>
        </div>

        <div className="box costs">
          <div className="box-title">Cost Structure</div>
          <div className="box-content">
            {canvas.cost_structure?.customer_acquisition_cost && (
              <p><strong>Customer acquisition: </strong>{canvas.cost_structure.customer_acquisition_cost}</p>
            )}
            {canvas.cost_structure?.distribution_costs && (
              <p><strong>Distribution: </strong>{canvas.cost_structure.distribution_costs}</p>
            )}
            {canvas.cost_structure?.hosting_costs && (
              <p><strong>Hosting: </strong>{canvas.cost_structure.hosting_costs}</p>
            )}
            {canvas.cost_structure?.people_costs && (
              <p><strong>People: </strong>{canvas.cost_structure.people_costs}</p>
            )}
          </div>
        </div>

        <div className="box revenue">
          <div className="box-title">Revenue Streams</div>
          <div className="box-content">
            {canvas.revenue_streams?.revenue_model && (
              <p><strong>Model: </strong>{canvas.revenue_streams.revenue_model}</p>
            )}
            {canvas.revenue_streams?.lifetime_value && (
              <p><strong>Lifetime value: </strong>{canvas.revenue_streams.lifetime_value}</p>
            )}
          </div>
        </div>
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

        .canvas-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
          grid-template-rows: auto auto auto;
          gap: 1rem;
          margin-top: 1rem;
        }

        .box {
          background: white;
          border: 2px solid #333;
          border-radius: 8px;
          padding: 1rem;
          min-height: 150px;
        }

        .box-title {
          font-weight: bold;
          font-size: 0.85rem;
          text-transform: uppercase;
          color: #333;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid #ddd;
          padding-bottom: 0.5rem;
        }

        .box-content { font-size: 0.9rem; line-height: 1.5; color: #444; }
        .box-content ul { padding-left: 1.5rem; margin-top: 0.5rem; }
        .box-content li { margin-bottom: 0.5rem; }
        .box-content p { margin-bottom: 0.75rem; }
        .box-content p:last-child { margin-bottom: 0; }

        /* Grid positioning */
        .problem { grid-column: 1; grid-row: 1; }
        .solution { grid-column: 2; grid-row: 1; }
        .uvp { grid-column: 3; grid-row: 1; }
        .unfair { grid-column: 4; grid-row: 1; }
        .customer { grid-column: 5; grid-row: 1 / 3; }

        .metrics { grid-column: 1; grid-row: 2; }
        .channels { grid-column: 2 / 5; grid-row: 2; }

        .costs { grid-column: 1 / 3; grid-row: 3; }
        .revenue { grid-column: 3 / 6; grid-row: 3; }

        @media (max-width: 768px) {
          .canvas-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
          }
          .problem, .solution, .uvp, .unfair, .customer,
          .metrics, .channels, .costs, .revenue {
            grid-column: 1 !important;
            grid-row: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LeanCanvasVisualizer;