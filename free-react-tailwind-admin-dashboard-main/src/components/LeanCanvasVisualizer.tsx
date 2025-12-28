import React from 'react';
import ChatButton from './ChatButton';
import { useChat } from '../context/ChatContext';

interface LeanCanvas {
  title?: string;
  version?: string;
  last_updated?: string;
  problem?: {
    top_3_problems?: string[];
    existing_alternatives?: string;
  };
  solution?: {
    top_3_features?: string[];
  };
  unique_value_proposition?: {
    single_clear_message?: string;
    high_level_concept?: string;
  };
  unfair_advantage?: {
    cant_be_copied?: string;
  };
  customer_segments?: {
    target_customers?: string;
    early_adopters?: string;
  };
  key_metrics?: {
    activities_to_measure?: string[];
  };
  channels?: {
    path_to_customers?: string[];
  };
  cost_structure?: {
    customer_acquisition_cost?: string;
    distribution_costs?: string;
    hosting_costs?: string;
    people_costs?: string;
  };
  revenue_streams?: {
    revenue_model?: string;
    lifetime_value?: string;
  };
}

interface LeanCanvasVisualizerProps {
  canvas: LeanCanvas;
}

const LeanCanvasVisualizer: React.FC<LeanCanvasVisualizerProps> = ({ canvas }) => {
  const { openChat } = useChat();

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  return (
    <div className="w-full p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{canvas.title}</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Version {canvas.version} • Last updated: {canvas.last_updated}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 grid-rows-3">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
           <ChatButton
             resourceType="lean-canvas-problem"
             resourceData={{ title: 'Problem', content: canvas.problem }}
             onClick={handleChatClick}
           />
           <div className="font-semibold text-lg text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Problem</div>
          <div className="text-gray-600 dark:text-gray-300">
            {canvas.problem?.top_3_problems && (
              <ul className="list-disc list-inside mb-3">
                {canvas.problem.top_3_problems.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            )}
            {canvas.problem?.existing_alternatives && (
              <p>{canvas.problem.existing_alternatives}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
           <ChatButton
             resourceType="lean-canvas-solution"
             resourceData={{ title: 'Solution', content: canvas.solution }}
             onClick={handleChatClick}
           />
           <div className="font-semibold text-lg text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Solution</div>
          <div className="text-gray-600 dark:text-gray-300">
            {canvas.solution?.top_3_features && (
              <ul className="list-disc list-inside">
                {canvas.solution.top_3_features.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
           <ChatButton
             resourceType="lean-canvas-value-proposition"
             resourceData={{ title: 'Unique Value Proposition', content: canvas.unique_value_proposition }}
             onClick={handleChatClick}
           />
           <div className="font-semibold text-lg text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Unique Value Proposition</div>
          <div className="text-gray-600 dark:text-gray-300">
            {canvas.unique_value_proposition?.single_clear_message && (
              <p className="font-semibold mb-2">{canvas.unique_value_proposition.single_clear_message}</p>
            )}
            {canvas.unique_value_proposition?.high_level_concept && (
              <p>{canvas.unique_value_proposition.high_level_concept}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
           <ChatButton
             resourceType="lean-canvas-unfair-advantage"
             resourceData={{ title: 'Unfair Advantage', content: canvas.unfair_advantage }}
             onClick={handleChatClick}
           />
           <div className="font-semibold text-lg text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Unfair Advantage</div>
          <div className="text-gray-600 dark:text-gray-300">
            <p>{canvas.unfair_advantage?.cant_be_copied}</p>
          </div>
        </div>

        <div className="row-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
           <ChatButton
             resourceType="lean-canvas-customer-segments"
             resourceData={{ title: 'Customer Segments', content: canvas.customer_segments }}
             onClick={handleChatClick}
           />
           <div className="font-semibold text-lg text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Customer Segments</div>
          <div className="text-gray-600 dark:text-gray-300">
            {canvas.customer_segments?.target_customers && (
              <p><strong>Target: </strong>{canvas.customer_segments.target_customers}</p>
            )}
            {canvas.customer_segments?.early_adopters && (
              <p><strong>Early adopters: </strong>{canvas.customer_segments.early_adopters}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
           <ChatButton
             resourceType="lean-canvas-key-metrics"
             resourceData={{ title: 'Key Metrics', content: canvas.key_metrics }}
             onClick={handleChatClick}
           />
           <div className="font-semibold text-lg text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Key Metrics</div>
          <div className="text-gray-600 dark:text-gray-300">
            {canvas.key_metrics?.activities_to_measure && (
              <ul className="list-disc list-inside">
                {canvas.key_metrics.activities_to_measure.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            )}
          </div>
        </div>

        <div className="col-span-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
           <ChatButton
             resourceType="lean-canvas-channels"
             resourceData={{ title: 'Channels', content: canvas.channels }}
             onClick={handleChatClick}
           />
           <div className="font-semibold text-lg text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Channels</div>
          <div className="text-gray-600 dark:text-gray-300">
            {canvas.channels?.path_to_customers && (
              <ul className="list-disc list-inside">
                {canvas.channels.path_to_customers.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            )}
          </div>
        </div>

        <div className="col-span-2 row-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
           <ChatButton
             resourceType="lean-canvas-cost-structure"
             resourceData={{ title: 'Cost Structure', content: canvas.cost_structure }}
             onClick={handleChatClick}
           />
           <div className="font-semibold text-lg text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Cost Structure</div>
          <div className="text-gray-600 dark:text-gray-300 text-sm">
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

        <div className="col-span-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
           <ChatButton
             resourceType="lean-canvas-revenue-streams"
             resourceData={{ title: 'Revenue Streams', content: canvas.revenue_streams }}
             onClick={handleChatClick}
           />
           <div className="font-semibold text-lg text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Revenue Streams</div>
          <div className="text-gray-600 dark:text-gray-300">
            {canvas.revenue_streams?.revenue_model && (
              <p><strong>Model: </strong>{canvas.revenue_streams.revenue_model}</p>
            )}
            {canvas.revenue_streams?.lifetime_value && (
              <p><strong>Lifetime value: </strong>{canvas.revenue_streams.lifetime_value}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeanCanvasVisualizer;