import React, { useState } from 'react';
import ChatButton from './ChatButton';
import EditButton from './EditButton';
import { useChat } from '../context/ChatContext';
import { aiService } from '../services/aiService';
import yaml from 'js-yaml';

interface LeanViability {
  title?: string;
  version?: string;
  last_updated?: string;
  time_horizon?: {
    duration?: number;
    unit?: string;
  };
  success_criteria?: {
    annual_revenue?: {
      amount?: number;
      currency?: string;
    };
  };
  calculations?: {
    annual_revenue_per_customer?: {
      amount?: number;
      currency?: string;
    };
    required_customers?: {
      count?: number;
    };
  };
}

interface LeanViabilityVisualizerProps {
  data: LeanViability;
}

const LeanViabilityVisualizer: React.FC<LeanViabilityVisualizerProps> = ({ data }) => {
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

      const yamlContent = yaml.dump(updatedData);
      const result = await aiService.saveFileContent('src/data/lean-viability.yaml', yamlContent);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{data.title || 'Lean Viability'}</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">Financial Analysis & Projections</span>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center relative">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">Annual Revenue Target</div>
               <div className="flex items-center gap-2">
                 <EditButton onClick={() => handleEditClick('success_criteria', data.success_criteria)} />
                 <ChatButton
                   resourceType="lean-viability-revenue"
                   resourceData={{ title: 'Annual Revenue Target', content: data.success_criteria?.annual_revenue }}
                   onClick={handleChatClick}
                   className="!relative !top-0 !right-0"
                 />
                 {editingSection === 'success_criteria' && (
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
            {editingSection === 'success_criteria' ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-24 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSaving}
              />
            ) : (
              <>
                <div className="text-3xl mb-3">💰</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${data.success_criteria?.annual_revenue?.amount?.toLocaleString() || '10,000,000'}
                </div>
              </>
            )}
          </div>
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center relative">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">Required Customers</div>
              <div className="flex items-center gap-2">
                <EditButton onClick={() => handleEditClick('calculations', data.calculations)} />
                <ChatButton
                  resourceType="lean-viability-customers"
                  resourceData={{ title: 'Required Customers', content: data.calculations?.required_customers }}
                  onClick={handleChatClick}
                  className="!relative !top-0 !right-0"
                />
              </div>
            </div>
            <div className="text-3xl mb-3">👥</div>
           <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
             {data.calculations?.required_customers?.count || 833}
           </div>
         </div>
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center relative">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">ARPU (Annual Revenue Per User)</div>
              <div className="flex items-center gap-2">
                <EditButton onClick={() => handleEditClick('calculations', data.calculations)} />
                <ChatButton
                  resourceType="lean-viability-arpu"
                  resourceData={{ title: 'ARPU (Annual Revenue Per User)', content: data.calculations?.annual_revenue_per_customer }}
                  onClick={handleChatClick}
                  className="!relative !top-0 !right-0"
                />
              </div>
            </div>
            <div className="text-3xl mb-3">💵</div>
           <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
             ${data.calculations?.annual_revenue_per_customer?.amount?.toLocaleString() || '12,000'}
           </div>
         </div>
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center relative">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">Time to Reach Target</div>
              <div className="flex items-center gap-2">
                <EditButton onClick={() => handleEditClick('time_horizon', data.time_horizon)} />
                <ChatButton
                  resourceType="lean-viability-time"
                  resourceData={{ title: 'Time Horizon', content: data.time_horizon }}
                  onClick={handleChatClick}
                  className="!relative !top-0 !right-0"
                />
              </div>
            </div>
            <div className="text-3xl mb-3">⏰</div>
           <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
             {data.time_horizon?.duration || 3} {data.time_horizon?.unit || 'years'}
           </div>
         </div>
      </div>

      {/* Detailed Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assumptions */}
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">📊</span>
                Key Assumptions
              </h3>
               <div className="flex items-center gap-2">
                 <EditButton onClick={() => handleEditClick('calculations', data.calculations)} />
                 <ChatButton
                   resourceType="lean-viability-assumptions"
                   resourceData={{ title: 'Key Assumptions', content: data.calculations }}
                   onClick={handleChatClick}
                   className="!relative !top-0 !right-0"
                 />
                 {editingSection === 'calculations' && (
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
            {editingSection === 'calculations' ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-40 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSaving}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Annual Revenue per Customer</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${data.calculations?.annual_revenue_per_customer?.amount?.toLocaleString() || '12,000'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Customer Lifetime</span>
                  <span className="font-semibold text-gray-900 dark:text-white">3 years</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Monthly Churn Rate</span>
                  <span className="font-semibold text-gray-900 dark:text-white">5%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Customer Acquisition Cost</span>
                  <span className="font-semibold text-gray-900 dark:text-white">$500</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 dark:text-gray-300">Gross Margins</span>
                  <span className="font-semibold text-gray-900 dark:text-white">75%</span>
                </div>
              </div>
            )}
        </div>

        {/* Work-Backwards Calculations */}
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">🧮</span>
                Work-Backwards Calculations
              </h3>
              <div className="flex items-center gap-2">
                <EditButton onClick={() => handleEditClick('calculations', data.calculations)} />
                <ChatButton
                  resourceType="lean-viability-calculations"
                  resourceData={{ title: 'Work-Backwards Calculations', content: data.calculations }}
                  onClick={handleChatClick}
                  className="!relative !top-0 !right-0"
                />
              </div>
             </div>
            {editingSection === 'calculations' ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-40 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSaving}
              />
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Required Customers</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{data.calculations?.required_customers?.count || 833}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Annual revenue target ÷ ARPU</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Monthly Acquisition Target</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">25 customers</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Required customers ÷ Time horizon (adjusted for churn)</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Customer Lifetime Value</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">$36,000</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">ARPU × Lifetime</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Break-even Point</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">18 months</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Based on cumulative cash flow analysis</div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Financial Projections Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="text-indigo-600 dark:text-indigo-400">📈</span>
          3-Year Financial Projections
        </h3>
        <div className="text-gray-600 dark:text-gray-300">
          Financial projections table would go here.
        </div>
      </div>
    </div>
  );
};

export default LeanViabilityVisualizer;