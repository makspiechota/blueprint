import React from 'react';
import { NorthStar } from '../parser/types';

interface NorthStarVisualizerProps {
  northstar: NorthStar;
}

const NorthStarVisualizer: React.FC<NorthStarVisualizerProps> = ({ northstar }) => {
  return (
    <div className="container">
      <h1>{northstar.title}</h1>
      <div className="metadata">
        Version {northstar.version} • Last updated: {northstar.last_updated}
      </div>

      <div className="section">
        <div className="section-title">Vision</div>
        <div className="section-content">{northstar.vision}</div>
      </div>

      <div className="section">
        <div className="section-title">Problem</div>
        <div className="section-content">{northstar.problem}</div>
      </div>

      <div className="section">
        <div className="section-title">Solution</div>
        <div className="section-content">{northstar.solution}</div>
      </div>

      <div className="section">
        <div className="section-title">Strategic Goals</div>
        <div className="goals">
          {northstar.strategic_goals?.map((goal, idx) => (
            <div key={idx} className="goal">
              <div className="goal-title">{goal.title}</div>
              <div className="goal-description">{goal.description}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 3rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { font-size: 2.5rem; margin-bottom: 0.5rem; color: #1a1a1a; }
        .metadata { color: #666; font-size: 0.9rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #eee; }
        .section { margin: 2rem 0; }
        .section-title { font-size: 1.5rem; color: #2c5282; margin-bottom: 0.75rem; font-weight: 600; }
        .section-content { background: #f9fafb; padding: 1.5rem; border-left: 4px solid #4299e1; white-space: pre-wrap; }
        .goals { display: grid; gap: 1rem; margin-top: 1rem; }
        .goal { background: #fff; border: 1px solid #e2e8f0; padding: 1.25rem; border-radius: 6px; transition: transform 0.2s; }
        .goal:hover { transform: translateX(4px); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .goal-title { font-size: 1.1rem; font-weight: 600; color: #1a202c; margin-bottom: 0.5rem; }
        .goal-description { color: #4a5568; }
      `}</style>
    </div>
  );
};

export default NorthStarVisualizer;