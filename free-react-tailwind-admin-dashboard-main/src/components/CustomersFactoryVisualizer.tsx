import React, { useState } from 'react';
import ChatButton from './ChatButton';
import { useChat } from '../context/ChatContext';

interface AAARRData {
  title?: string;
  stages?: {
    acquisition?: {
      stage_goal?: string;
      metrics?: Array<{
        name?: string;
        description?: string;
        target?: any;
        current?: any;
      }>;
    };
    activation?: {
      stage_goal?: string;
      metrics?: Array<{
        name?: string;
        description?: string;
        target?: any;
        current?: any;
      }>;
    };
    retention?: {
      stage_goal?: string;
      metrics?: Array<{
        name?: string;
        description?: string;
        target?: any;
        current?: any;
      }>;
    };
    referral?: {
      stage_goal?: string;
      metrics?: Array<{
        name?: string;
        description?: string;
        target?: any;
        current?: any;
      }>;
    };
    revenue?: {
      stage_goal?: string;
      metrics?: Array<{
        name?: string;
        description?: string;
        target?: any;
        current?: any;
      }>;
    };
  };
}

interface CustomersFactoryVisualizerProps {
  data: AAARRData;
}

const CustomersFactoryVisualizer: React.FC<CustomersFactoryVisualizerProps> = ({ data }) => {
  const { openChat } = useChat();
  const [selectedStage, setSelectedStage] = useState('acquisition');

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  const stages = [
    { key: 'acquisition', label: 'Acquisition', color: 'blue' },
    { key: 'activation', label: 'Activation', color: 'green' },
    { key: 'retention', label: 'Retention', color: 'yellow' },
    { key: 'referral', label: 'Referral', color: 'purple' },
    { key: 'revenue', label: 'Revenue', color: 'indigo' },
  ];

  const renderMetricValue = (value: any) => {
    if (value?.percentage !== undefined) return `${value.percentage}%`;
    if (value?.rate !== undefined) return `${value.rate}${value.period ? ` ${value.period}` : ''}`;
    if (value?.amount !== undefined) return `$${value.amount.toLocaleString()}`;
    if (value?.score !== undefined) return value.score;
    return 'N/A';
  };

  const currentStage = data.stages?.[selectedStage as keyof typeof data.stages];

  return (
    <div className="space-y-6 relative">
      <ChatButton
        resourceType="customers-factory-overview"
        resourceData={{ title: 'Customers Factory Overview', content: data }}
        onClick={handleChatClick}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{data.title || 'Customers Factory'}</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">AAARR Growth Framework</span>
      </div>

      {/* Stage Selection Menu */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <button
            key={stage.key}
            onClick={() => setSelectedStage(stage.key)}
            className={`p-4 rounded-lg border text-left hover:shadow-md transition-all ${
              selectedStage === stage.key
                ? `bg-${stage.color}-100 dark:bg-${stage.color}-900/30 border-${stage.color}-300 dark:border-${stage.color}-700`
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 bg-${stage.color}-500 rounded-full`}></div>
              <span className={`font-semibold text-${stage.color}-900 dark:text-${stage.color}-100`}>
                {stage.label}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {data.stages?.[stage.key as keyof typeof data.stages]?.stage_goal || 'Loading...'}
            </p>
          </button>
        ))}
      </div>

      {/* Stage Metrics Display */}
      {currentStage && (
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <div className={`w-4 h-4 bg-${stages.find(s => s.key === selectedStage)?.color}-500 rounded-full`}></div>
            {stages.find(s => s.key === selectedStage)?.label} Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentStage.metrics?.map((metric, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{metric.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{metric.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Target:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {renderMetricValue(metric.target)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Current:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {renderMetricValue(metric.current)}
                    </span>
                  </div>
                </div>
              </div>
            )) || (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                No metrics available for this stage.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersFactoryVisualizer;