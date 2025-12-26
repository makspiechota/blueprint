import React from 'react';

interface TraceabilityVisualizerProps {
  graphData?: any; // For D3 graph data
}

const TraceabilityVisualizer: React.FC<TraceabilityVisualizerProps> = ({ graphData }) => {
  return (
    <div className="traceability-container">
      <div className="graph-header">
        <h2>Business Architecture Traceability</h2>
        <div className="graph-stats">
          <span className="stat">Nodes: {graphData?.nodes?.length || 119}</span>
          <span className="stat">Edges: {graphData?.links?.length || 143}</span>
        </div>
      </div>
      <div className="traceability-graph">
        {/* D3 graph would render here */}
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Graph visualization would render here with D3.js
        </div>
      </div>
      <div className="graph-legend">
        <h3>Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#FF6B35' }}></div>
            <span>Goals</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#4ECDC4' }}></div>
            <span>Tactics</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#45B7D1' }}></div>
            <span>Policies</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#E74C3C' }}></div>
            <span>Risks</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .traceability-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .graph-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .graph-header h2 {
          margin: 0;
          color: #1a202c;
          font-size: 1.5rem;
        }

        .graph-stats {
          display: flex;
          gap: 1rem;
        }

        .stat {
          background: #f7fafc;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #4a5568;
          border: 1px solid #e2e8f0;
        }

        .traceability-graph {
          width: 100%;
          height: 600px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fafafa;
          margin-bottom: 2rem;
        }

        .graph-legend {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .graph-legend h3 {
          margin: 0 0 1rem 0;
          color: #1a202c;
          font-size: 1.1rem;
        }

        .legend-items {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 0 0 1px #e2e8f0;
        }

        .legend-item span {
          font-size: 0.9rem;
          color: #4a5568;
        }
      `}</style>
    </div>
  );
};

export default TraceabilityVisualizer;