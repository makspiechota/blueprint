import React, { useState } from 'react';
import ChatButton from './ChatButton';
import EditButton from './EditButton';
import { useChat } from '../context/ChatContext';
import { aiService } from '../services/aiService';
import yaml from 'js-yaml';

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
  const { openChat } = useChat();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  const handleEditClick = (sectionKey: string, sectionData: any, goalIndex?: number) => {
    const key = goalIndex !== undefined ? `${sectionKey}-${goalIndex}` : sectionKey;
    setEditingSection(key);
    setEditedContent(yaml.dump(sectionData || ''));
  };

  const handleSaveEdit = async () => {
    if (!editingSection || !editedContent.trim()) return;

    setIsSaving(true);
    try {
      const parsedSection = yaml.load(editedContent);
      const updatedData = { ...data };

      if (editingSection.includes('-')) {
        // Handle goal editing: strategic_goals-0, strategic_goals-1, etc.
        const [section, indexStr] = editingSection.split('-');
        const index = parseInt(indexStr);
        if (section === 'strategic_goals' && updatedData.strategic_goals && updatedData.strategic_goals[index]) {
          updatedData.strategic_goals[index] = parsedSection as { title: string; description: string };
        }
      } else {
        // Handle top-level sections
        (updatedData as any)[editingSection] = parsedSection;
      }

      const yamlContent = yaml.dump(updatedData);
      const result = await aiService.saveFileContent('src/data/north-star.yaml', yamlContent);

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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Vision
              </h3>
              <div className="flex items-center gap-2">
                <EditButton onClick={() => handleEditClick('vision', data.vision)} />
                <ChatButton
                  resourceType="north-star-vision"
                  resourceData={{ title: 'Vision', content: data.vision }}
                  onClick={handleChatClick}
                  className="!relative !top-0 !right-0"
                />
                {editingSection === 'vision' && (
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
           {editingSection === 'vision' ? (
             <textarea
               value={editedContent}
               onChange={(e) => setEditedContent(e.target.value)}
               className="w-full h-32 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               disabled={isSaving}
             />
           ) : (
             <p className="text-gray-600 dark:text-gray-300">
               {data.vision || 'Loading...'}
             </p>
           )}
         </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Problem
              </h3>
              <div className="flex items-center gap-2">
                <EditButton onClick={() => handleEditClick('problem', data.problem)} />
                <ChatButton
                  resourceType="north-star-problem"
                  resourceData={{ title: 'Problem', content: data.problem }}
                  onClick={handleChatClick}
                  className="!relative !top-0 !right-0"
                />
                {editingSection === 'problem' && (
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
           {editingSection === 'problem' ? (
             <textarea
               value={editedContent}
               onChange={(e) => setEditedContent(e.target.value)}
               className="w-full h-32 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               disabled={isSaving}
             />
           ) : (
             <p className="text-gray-600 dark:text-gray-300">
               {data.problem || 'Loading...'}
             </p>
           )}
         </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Solution
              </h3>
              <div className="flex items-center gap-2">
                <EditButton onClick={() => handleEditClick('solution', data.solution)} />
                <ChatButton
                  resourceType="north-star-solution"
                  resourceData={{ title: 'Solution', content: data.solution }}
                  onClick={handleChatClick}
                  className="!relative !top-0 !right-0"
                />
                {editingSection === 'solution' && (
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
           {editingSection === 'solution' ? (
             <textarea
               value={editedContent}
               onChange={(e) => setEditedContent(e.target.value)}
               className="w-full h-32 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               disabled={isSaving}
             />
           ) : (
             <p className="text-gray-600 dark:text-gray-300">
               {data.solution || 'Loading...'}
             </p>
           )}
         </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Strategic Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {data.strategic_goals?.map((goal, index) => {
             const goalKey = `strategic_goals-${index}`;
             return (
                 <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
                   <div className="flex items-center justify-between mb-3">
                     <h4 className="font-semibold text-gray-900 dark:text-white">
                       {goal.title}
                     </h4>
                     <div className="flex items-center gap-2">
                       <EditButton onClick={() => handleEditClick('strategic_goals', goal, index)} />
                       <ChatButton
                         resourceType="north-star-goal"
                         resourceData={{ title: goal.title, content: goal.description }}
                         onClick={handleChatClick}
                         className="!relative !top-0 !right-0"
                       />
                       {editingSection === goalKey && (
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
                 {editingSection === goalKey ? (
                   <textarea
                     value={editedContent}
                     onChange={(e) => setEditedContent(e.target.value)}
                     className="w-full h-24 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                     disabled={isSaving}
                   />
                 ) : (
                   <p className="text-gray-600 dark:text-gray-300">{goal.description}</p>
                 )}
               </div>
             );
           }) || (
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