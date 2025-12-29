import React, { useState } from 'react';
import ChatButton from './ChatButton';
import EditButton from './EditButton';
import { useChat } from '../context/ChatContext';
import { aiService } from '../services/aiService';
import { unprocessObjectDocLinks } from '../utils/docLinkProcessor';
import yaml from 'js-yaml';

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
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  const handleEditClick = (sectionKey: string, sectionData: any) => {
    setEditingSection(sectionKey);
    setEditedContent(yaml.dump(sectionData || {}));
  };

  const handleSaveEdit = async () => {
    if (!editingSection || !editedContent.trim()) return;

    setIsSaving(true);
    try {
      const parsedSection = yaml.load(editedContent);
      const updatedData = { ...data };
      (updatedData as any)[editingSection] = parsedSection;

      // Convert HTML links back to [[doc-name]] syntax before saving
      const cleanedData = unprocessObjectDocLinks(updatedData);
      const yamlContent = yaml.dump(cleanedData);
      const result = await aiService.saveFileContent('src/data/architectural-scope.yaml', yamlContent);

      if (result.success) {
        setEditingSection(null);
        setEditedContent('');
      } else {
        alert('Failed to save changes: ' + result.message);
      }
    } catch (error) {
      alert('Invalid YAML format. Please check your syntax and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditedContent('');
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-5xl">🎯</span>
                <div>
                  <h2 className="text-3xl font-bold">WHY</h2>
                  <p className="text-purple-100">Business Mission & Goals</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EditButton onClick={() => handleEditClick('why', data.why)} className="text-white hover:bg-white hover:bg-opacity-20" />
                <ChatButton
                  resourceType="architectural-scope-why"
                  resourceData={{ title: 'WHY - Business Mission & Goals', content: data.why }}
                  onClick={handleChatClick}
                  className="!relative !top-0 !right-0"
                />
                {editingSection === 'why' && (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="flex items-center gap-1 px-2 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white text-xs rounded transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white text-xs rounded transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

           {editingSection === 'why' ? (
             <textarea
               value={editedContent}
               onChange={(e) => setEditedContent(e.target.value)}
               className="w-full h-64 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               disabled={isSaving}
             />
           ) : (
             <>
               {data.why.mission && (
                 <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 mb-6 border border-white border-opacity-20">
                   <h3 className="text-xl font-semibold mb-3 text-gray-900">Mission Statement</h3>
                    <p className="text-lg leading-relaxed text-gray-800">
                      {data.why.mission.action} <span dangerouslySetInnerHTML={{ __html: data.why.mission.service || '' }} /> for {data.why.mission.beneficiary}
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
                          <div className="text-gray-700 leading-relaxed">
                            <span dangerouslySetInnerHTML={{ __html: goal.description || '' }} />
                          </div>
                       </div>
                     ))}
                   </div>
                 </>
               )}
             </>
           )}
        </div>
      )}

      {/* The other 5W sections in a grid below */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {sections.map((section) => (
            <div key={section.key} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{section.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{section.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <EditButton onClick={() => handleEditClick(section.key, section.items)} />
                  <ChatButton
                    resourceType={`architectural-scope-${section.key}`}
                    resourceData={{ title: `${section.title} - ${section.subtitle}`, content: section.items }}
                    onClick={handleChatClick}
                    className="!relative !top-0 !right-0"
                  />
                  {editingSection === section.key && (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className="flex items-center gap-1 px-2 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white text-xs rounded transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white text-xs rounded transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            {editingSection === section.key ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-48 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSaving}
              />
            ) : (
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
            )}
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