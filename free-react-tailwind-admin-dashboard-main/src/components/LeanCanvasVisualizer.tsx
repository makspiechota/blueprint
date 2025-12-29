import React, { useState } from 'react';
import ChatButton from './ChatButton';
import EditButton from './EditButton';
import { useChat } from '../context/ChatContext';
import { aiService } from '../services/aiService';
import yaml from 'js-yaml';

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
    annual_revenue_3_years_target?: {
      amount?: number;
      currency?: string;
      timeframe?: string;
    };
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
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  const handleEditClick = (sectionKey: string, sectionData: any) => {
    setEditingSection(sectionKey);
    // For editing, show just this section's content as YAML
    setEditedContent(yaml.dump(sectionData || {}));
  };

  const handleSaveEdit = async () => {
    if (!editingSection || !editedContent.trim()) return;

    setIsSaving(true);
    try {
      // Parse the YAML to validate it
      const parsedSection = yaml.load(editedContent);

      // Create updated canvas with the modified section
      const updatedCanvas = { ...canvas };
      (updatedCanvas as any)[editingSection] = parsedSection;

      // Convert the full updated canvas back to YAML for saving
      const yamlContent = yaml.dump(updatedCanvas);

      // Save the edited content directly as the new file content
      const result = await aiService.saveFileContent('src/data/lean-canvas.yaml', yamlContent);

      if (result.success) {
        console.log('File saved successfully');
        setEditingSection(null);
        setEditedContent('');
        // Optionally reload the page or update parent state here
      } else {
        console.error('Failed to save file:', result.message);
        alert('Failed to save changes: ' + result.message);
      }
    } catch (error) {
      console.error('Failed to save:', error);
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
    <div className="w-full p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{canvas.title}</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Version {canvas.version} • Last updated: {canvas.last_updated}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 grid-rows-3">
         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                Problem
              </div>
              <div className="flex items-center gap-2">
                <EditButton onClick={() => handleEditClick('problem', canvas.problem)} />
                <ChatButton
                  resourceType="lean-canvas-problem"
                  resourceData={{ title: 'Problem', content: canvas.problem }}
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
             <div className="text-gray-600 dark:text-gray-300">
               {canvas.problem?.top_3_problems && (
                 <ul className="list-disc list-inside mb-3">
                   {canvas.problem.top_3_problems.map((item, idx) => <li key={idx}>{item}</li>)}
                 </ul>
               )}
                {canvas.problem?.existing_alternatives && (
                  <div className="prose prose-sm max-w-none">
                    <span dangerouslySetInnerHTML={{ __html: canvas.problem.existing_alternatives }} />
                  </div>
                )}
             </div>
           )}
         </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                Solution
              </div>
              <div className="flex items-center gap-2">
                <EditButton onClick={() => handleEditClick('solution', canvas.solution)} />
                <ChatButton
                  resourceType="lean-canvas-solution"
                  resourceData={{ title: 'Solution', content: canvas.solution }}
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
              <div className="text-gray-600 dark:text-gray-300">
                {canvas.solution?.top_3_features && (
                  <ul className="list-disc list-inside">
                    {canvas.solution.top_3_features.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                )}
              </div>
            )}
        </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                Unique Value Proposition
              </div>
              <div className="flex items-center gap-2">
                <EditButton onClick={() => handleEditClick('unique_value_proposition', canvas.unique_value_proposition)} />
                <ChatButton
                  resourceType="lean-canvas-value-proposition"
                  resourceData={{ title: 'Unique Value Proposition', content: canvas.unique_value_proposition }}
                  onClick={handleChatClick}
                  className="!relative !top-0 !right-0"
                />
                {editingSection === 'unique_value_proposition' && (
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
           {editingSection === 'unique_value_proposition' ? (
             <textarea
               value={editedContent}
               onChange={(e) => setEditedContent(e.target.value)}
               className="w-full h-32 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               disabled={isSaving}
             />
           ) : (
             <div className="text-gray-600 dark:text-gray-300">
                {canvas.unique_value_proposition?.single_clear_message && (
                  <div className="font-semibold mb-2 prose prose-sm max-w-none">
                    <span dangerouslySetInnerHTML={{ __html: canvas.unique_value_proposition.single_clear_message }} />
                  </div>
                )}
                {canvas.unique_value_proposition?.high_level_concept && (
                  <div className="prose prose-sm max-w-none">
                    <span dangerouslySetInnerHTML={{ __html: canvas.unique_value_proposition.high_level_concept }} />
                  </div>
                )}
             </div>
           )}
        </div>

         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                Unfair Advantage
              </div>
              <div className="flex items-center gap-2">
                <EditButton onClick={() => handleEditClick('unfair_advantage', canvas.unfair_advantage)} />
                <ChatButton
                  resourceType="lean-canvas-unfair-advantage"
                  resourceData={{ title: 'Unfair Advantage', content: canvas.unfair_advantage }}
                  onClick={handleChatClick}
                  className="!relative !top-0 !right-0"
                />
                {editingSection === 'unfair_advantage' && (
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
           {editingSection === 'unfair_advantage' ? (
             <textarea
               value={editedContent}
               onChange={(e) => setEditedContent(e.target.value)}
               className="w-full h-32 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               disabled={isSaving}
             />
           ) : (
             <div className="text-gray-600 dark:text-gray-300">
               <p>{canvas.unfair_advantage?.cant_be_copied}</p>
             </div>
           )}
         </div>

         <div className="row-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                Customer Segments
              </div>
              <div className="flex items-center gap-2">
                <EditButton onClick={() => handleEditClick('customer_segments', canvas.customer_segments)} />
                <ChatButton
                  resourceType="lean-canvas-customer-segments"
                  resourceData={{ title: 'Customer Segments', content: canvas.customer_segments }}
                  onClick={handleChatClick}
                  className="!relative !top-0 !right-0"
                />
                {editingSection === 'customer_segments' && (
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
           {editingSection === 'customer_segments' ? (
             <textarea
               value={editedContent}
               onChange={(e) => setEditedContent(e.target.value)}
               className="w-full h-32 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               disabled={isSaving}
             />
           ) : (
             <div className="text-gray-600 dark:text-gray-300">
               {canvas.customer_segments?.target_customers && (
                 <p><strong>Target: </strong>{canvas.customer_segments.target_customers}</p>
               )}
               {canvas.customer_segments?.early_adopters && (
                 <p><strong>Early adopters: </strong>{canvas.customer_segments.early_adopters}</p>
               )}
             </div>
           )}
         </div>

         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                Key Metrics
              </div>
               <div className="flex items-center gap-2">
                 <EditButton onClick={() => handleEditClick('key_metrics', canvas.key_metrics)} />
                 <ChatButton
                   resourceType="lean-canvas-key-metrics"
                   resourceData={{ title: 'Key Metrics', content: canvas.key_metrics }}
                   onClick={handleChatClick}
                   className="!relative !top-0 !right-0"
                 />
                 {editingSection === 'key_metrics' && (
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
             {editingSection === 'key_metrics' ? (
               <textarea
                 value={editedContent}
                 onChange={(e) => setEditedContent(e.target.value)}
                 className="w-full h-32 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                 disabled={isSaving}
               />
             ) : (
               <div className="text-gray-600 dark:text-gray-300">
                 {canvas.key_metrics?.annual_revenue_3_years_target && (
                   <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                     <strong className="text-gray-900 dark:text-white">Annual Revenue 3 Years Target:</strong>
                     <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                       ${canvas.key_metrics.annual_revenue_3_years_target.amount?.toLocaleString()} {canvas.key_metrics.annual_revenue_3_years_target.currency} in {canvas.key_metrics.annual_revenue_3_years_target.timeframe}
                     </div>
                     <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">This is a required, hardcoded metric for business viability analysis.</div>
                   </div>
                 )}
                 {canvas.key_metrics?.activities_to_measure && (
                   <ul className="list-disc list-inside">
                     {canvas.key_metrics.activities_to_measure.map((item, idx) => <li key={idx}>{item}</li>)}
                   </ul>
                 )}
               </div>
             )}
         </div>

         <div className="col-span-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                Channels
              </div>
               <div className="flex items-center gap-2">
                 <EditButton onClick={() => handleEditClick('channels', canvas.channels)} />
                 <ChatButton
                   resourceType="lean-canvas-channels"
                   resourceData={{ title: 'Channels', content: canvas.channels }}
                   onClick={handleChatClick}
                   className="!relative !top-0 !right-0"
                 />
                 {editingSection === 'channels' && (
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
            {editingSection === 'channels' ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-32 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSaving}
              />
            ) : (
              <div className="text-gray-600 dark:text-gray-300">
                {canvas.channels?.path_to_customers && (
                  <ul className="list-disc list-inside">
                    {canvas.channels.path_to_customers.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                )}
              </div>
            )}
         </div>

         <div className="col-span-2 row-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                Cost Structure
              </div>
               <div className="flex items-center gap-2">
                 <EditButton onClick={() => handleEditClick('cost_structure', canvas.cost_structure)} />
                 <ChatButton
                   resourceType="lean-canvas-cost-structure"
                   resourceData={{ title: 'Cost Structure', content: canvas.cost_structure }}
                   onClick={handleChatClick}
                   className="!relative !top-0 !right-0"
                 />
                 {editingSection === 'cost_structure' && (
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
            {editingSection === 'cost_structure' ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-32 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSaving}
              />
            ) : (
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
            )}
         </div>

         <div className="col-span-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                Revenue Streams
              </div>
               <div className="flex items-center gap-2">
                 <EditButton onClick={() => handleEditClick('revenue_streams', canvas.revenue_streams)} />
                 <ChatButton
                   resourceType="lean-canvas-revenue-streams"
                   resourceData={{ title: 'Revenue Streams', content: canvas.revenue_streams }}
                   onClick={handleChatClick}
                   className="!relative !top-0 !right-0"
                 />
                 {editingSection === 'revenue_streams' && (
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
            {editingSection === 'revenue_streams' ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-32 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSaving}
              />
            ) : (
              <div className="text-gray-600 dark:text-gray-300">
                {canvas.revenue_streams?.revenue_model && (
                  <p><strong>Model: </strong>{canvas.revenue_streams.revenue_model}</p>
                )}
                {canvas.revenue_streams?.lifetime_value && (
                  <p><strong>Lifetime value: </strong>{canvas.revenue_streams.lifetime_value}</p>
                )}
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default LeanCanvasVisualizer;