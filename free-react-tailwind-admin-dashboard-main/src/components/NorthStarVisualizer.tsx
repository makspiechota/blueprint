import React from 'react';

interface NorthStarData {
  title?: string;
  vision?: string;
  problem?: string;
  solution?: string;
  strategic_goals?: { title: string; description: string }[];
}

interface NorthStarVisualizerProps {
  data: NorthStarData;
}

const NorthStarVisualizer: React.FC<NorthStarVisualizerProps> = ({ data }) => {
  return (
    <div className="north-star-visualizer">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {data.title || 'North Star'}
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {data.title}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Vision</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {data.vision || 'Loading...'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Problem</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {data.problem || 'Loading...'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Solution</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {data.solution || 'Loading...'}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Strategic Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.strategic_goals?.map((goal, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{goal.title}</h4>
              <p className="text-gray-600 dark:text-gray-300">{goal.description}</p>
            </div>
          )) || (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300">No strategic goals defined</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NorthStarVisualizer;