import React from 'react';
import ChatButton from './ChatButton';
import { useChat } from '../context/ChatContext';

interface ArchitecturalScopeData {
  title?: string;
  why?: {
    mission?: {
      action?: string;
      service?: string;
      beneficiary?: string;
    };
    goals?: Array<{
      title?: string;
      description?: string;
    }>;
  };
  what?: Array<{
    title?: string;
    description?: string;
  }>;
  how?: Array<{
    title?: string;
    description?: string;
  }>;
  where?: Array<{
    title?: string;
    description?: string;
  }>;
  who?: Array<{
    title?: string;
    description?: string;
  }>;
  when?: Array<{
    title?: string;
    description?: string;
  }>;
}

interface ArchitecturalScopeVisualizerProps {
  data: ArchitecturalScopeData;
}

const ArchitecturalScopeVisualizer: React.FC<ArchitecturalScopeVisualizerProps> = ({ data }) => {
  const { openChat } = useChat();

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  const sections = [
    {
      key: 'what',
      title: 'WHAT',
      subtitle: 'Business Entities & Information',
      icon: '📋',
      color: 'blue',
      items: data.what,
    },
    {
      key: 'how',
      title: 'HOW',
      subtitle: 'Business Processes & Mechanisms',
      icon: '⚙️',
      color: 'green',
      items: data.how,
    },
    {
      key: 'where',
      title: 'WHERE',
      subtitle: 'Geographic & Operational Boundaries',
      icon: '📍',
      color: 'yellow',
      items: data.where,
    },
    {
      key: 'who',
      title: 'WHO',
      subtitle: 'Organizational Units & Stakeholders',
      icon: '👥',
      color: 'purple',
      items: data.who,
    },
    {
      key: 'when',
      title: 'WHEN',
      subtitle: 'Timing Constraints & Business Cycles',
      icon: '⏰',
      color: 'red',
      items: data.when,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{data.title || 'Architectural Scope'}</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">5W Solution Architecture</span>
      </div>

      {/* WHY - Mission & Goals (Featured at top) */}
      {data.why && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg p-8 relative">
          <ChatButton
            resourceType="architectural-scope-why"
            resourceData={{ title: 'WHY - Business Mission & Goals', content: data.why }}
            onClick={handleChatClick}
          />
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">🎯</span>
            <div>
              <h2 className="text-3xl font-bold">WHY</h2>
              <p className="text-purple-100">Business Mission & Goals</p>
            </div>
          </div>

          {data.why.mission && (
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 mb-6 border border-white border-opacity-20">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Mission Statement</h3>
              <p className="text-lg leading-relaxed text-gray-800">
                {data.why.mission.action} {data.why.mission.service} for {data.why.mission.beneficiary}
              </p>
            </div>
          )}

          {data.why.goals && (
            <>
              <h3 className="text-2xl font-semibold mb-6 text-white drop-shadow-lg">Business Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.why.goals.map((goal, index) => (
                  <div key={index} className="bg-white bg-opacity-15 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-10">
                    <h4 className="font-semibold mb-3 text-lg text-gray-900">{goal.title}</h4>
                    <p className="text-gray-700 leading-relaxed">{goal.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* The other 5W sections in a grid below */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
           <div key={section.key} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
             <ChatButton
               resourceType={`architectural-scope-${section.key}`}
               resourceData={{ title: `${section.title} - ${section.subtitle}`, content: section.items }}
               onClick={handleChatClick}
             />
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{section.icon}</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{section.subtitle}</p>
              </div>
            </div>
            <div className="space-y-4">
              {section.items?.map((item, index) => (
                <div key={index} className={`border-l-4 border-${section.color}-500 pl-4`}>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              )) || (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No items defined for this section.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Summary Placeholder */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Architecture Overview</h3>
        <div className="text-gray-600 dark:text-gray-300">
          Architecture overview summary would go here.
        </div>
      </div>
    </div>
  );
};

export default ArchitecturalScopeVisualizer;