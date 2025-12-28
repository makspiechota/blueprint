import React, { useState } from 'react';
import ChatButton from './ChatButton';
import EditButton from './EditButton';
import { useChat } from '../context/ChatContext';
import { aiService } from '../services/aiService';
import yaml from 'js-yaml';
import { calculateLeanViabilityMetrics } from '../utils/leanViabilityCalculations';

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
    monthly_acquisition_target?: {
      rate?: number;
      period?: string;
    };
    customer_lifetime_value?: {
      years?: number;
      amount?: number;
      currency?: string;
    };
    churn_rate?: {
      monthly_rate?: number;
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
  const [localData, setLocalData] = useState<LeanViability>(data);

  // Update local data when prop data changes
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  const handleEditClick = (sectionKey: string, sectionData: any) => {
    setEditingSection(sectionKey);
    console.log('handleEditClick:', sectionKey, sectionData);
    if (sectionKey === 'annual_revenue_target') {
      setEditedContent((sectionData || 10000000).toString());
    } else if (sectionKey === 'arpu') {
      setEditedContent((sectionData || 12000).toString());
    } else if (sectionKey === 'customer_lifetime') {
      console.log('Customer lifetime sectionData:', sectionData);
      setEditedContent((sectionData?.years || 3).toString());
    } else {
      setEditedContent(yaml.dump(sectionData || {}));
    }
  };

  const handleSaveEdit = async () => {
    if (!editingSection || !editedContent.trim()) return;

    setIsSaving(true);
    try {
      const updatedData = { ...data };

      // Handle different section types
      if (editingSection === 'annual_revenue_target') {
        const revenueAmount = parseFloat(editedContent);
        if (!updatedData.success_criteria) updatedData.success_criteria = {};
        if (!updatedData.success_criteria.annual_revenue) updatedData.success_criteria.annual_revenue = { currency: 'USD' };
        updatedData.success_criteria.annual_revenue.amount = revenueAmount;
      } else if (editingSection === 'arpu') {
        const arpuAmount = parseFloat(editedContent);
        if (!updatedData.calculations) updatedData.calculations = {};
        if (!updatedData.calculations.annual_revenue_per_customer) updatedData.calculations.annual_revenue_per_customer = { currency: 'USD' };
        updatedData.calculations.annual_revenue_per_customer.amount = arpuAmount;
      } else if (editingSection === 'customer_lifetime') {
        const lifetimeYears = parseFloat(editedContent);
        if (!updatedData.calculations) updatedData.calculations = {};
        updatedData.calculations.customer_lifetime_value = {
          ...updatedData.calculations.customer_lifetime_value,
          years: lifetimeYears
        };
      } else {
        const parsedSection = yaml.load(editedContent);
        (updatedData as any)[editingSection] = parsedSection;
      }

      // Recalculate all dependent values
      const calculatedData = calculateLeanViabilityMetrics(updatedData);
      console.log('Calculated data:', calculatedData);
      const yamlContent = yaml.dump(calculatedData);
      const result = await aiService.saveFileContent('src/data/lean-viability.yaml', yamlContent);

       if (result.success) {
         // Update local data immediately for instant UI feedback
         setLocalData(calculatedData);
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

      console.log('LeanViabilityVisualizer render - churn rate:', localData.calculations?.churn_rate?.monthly_rate, 'monthly acquisition:', localData.calculations?.monthly_acquisition_target?.rate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{localData.title || 'Lean Viability'}</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">Financial Analysis & Projections</span>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center relative">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">Annual Revenue Target</div>
                <div className="flex items-center gap-2">
                  <EditButton onClick={() => handleEditClick('annual_revenue_target', localData.success_criteria?.annual_revenue?.amount)} />
                  <ChatButton
                    resourceType="lean-viability-revenue"
                    resourceData={{ title: 'Annual Revenue Target', content: localData.success_criteria?.annual_revenue }}
                    onClick={handleChatClick}
                    className="!relative !top-0 !right-0"
                  />
                  {editingSection === 'annual_revenue_target' && (
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
             {editingSection === 'annual_revenue_target' ? (
               <input
                 type="number"
                 value={editedContent}
                 onChange={(e) => setEditedContent(e.target.value)}
                 className="w-full px-3 py-2 text-center text-2xl font-bold border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                 disabled={isSaving}
                 placeholder="Enter revenue amount"
               />
             ) : (
               <>
                 <div className="text-3xl mb-3">💰</div>
                 <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                   ${localData.success_criteria?.annual_revenue?.amount?.toLocaleString() || '10,000,000'}
                 </div>
               </>
             )}
           </div>
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center relative">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">Required Customers</div>

            </div>
            <div className="text-3xl mb-3">👥</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {localData.calculations?.required_customers?.count || 833}
            </div>
         </div>
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center relative">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">ARPU (Annual Revenue Per User)</div>
               <div className="flex items-center gap-2">
                 <EditButton onClick={() => handleEditClick('arpu', localData.calculations?.annual_revenue_per_customer?.amount)} />
                 <ChatButton
                   resourceType="lean-viability-arpu"
                   resourceData={{ title: 'ARPU (Annual Revenue Per User)', content: localData.calculations?.annual_revenue_per_customer }}
                   onClick={handleChatClick}
                   className="!relative !top-0 !right-0"
                 />
                 {editingSection === 'arpu' && (
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
             {editingSection === 'arpu' ? (
               <input
                 type="number"
                 value={editedContent}
                 onChange={(e) => setEditedContent(e.target.value)}
                 className="w-full px-3 py-2 text-center text-2xl font-bold border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                 disabled={isSaving}
                 placeholder="Enter ARPU amount"
               />
             ) : (
               <>
                 <div className="text-3xl mb-3">💵</div>
                 <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                   ${localData.calculations?.annual_revenue_per_customer?.amount?.toLocaleString() || '12,000'}
                 </div>
               </>
             )}
         </div>
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center relative">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">Time to Reach Target</div>

            </div>
            <div className="text-3xl mb-3">⏰</div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {localData.time_horizon?.duration || 3} {localData.time_horizon?.unit || 'years'}
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

              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Annual Revenue per Customer</span>
                   <span className="font-semibold text-gray-900 dark:text-white">${localData.calculations?.annual_revenue_per_customer?.amount?.toLocaleString() || '12,000'}</span>
                </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Customer Lifetime</span>
                    <div className="flex items-center gap-2">
                      {editingSection === 'customer_lifetime' ? (
                        <>
                          <input
                            type="number"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            disabled={isSaving}
                            step="0.1"
                            min="0.1"
                          />
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
                      ) : (
                        <>
                          <span className="font-semibold text-gray-900 dark:text-white">{localData.calculations?.customer_lifetime_value?.years || 3} years</span>
                          <EditButton onClick={() => handleEditClick('customer_lifetime', localData.calculations?.customer_lifetime_value)} />
                        </>
                      )}
                    </div>
                  </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Monthly Churn Rate</span>
                   <span className="font-semibold text-gray-900 dark:text-white">{((localData.calculations?.churn_rate?.monthly_rate || 0.05) * 100).toFixed(1)}%</span>
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
        </div>

        {/* Work-Backwards Calculations */}
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">🧮</span>
                Work-Backwards Calculations
              </h3>

              </div>
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
                     <span className="font-bold text-blue-600 dark:text-blue-400">{localData.calculations?.monthly_acquisition_target?.rate || 7} customers</span>
                  </div>
                   <div className="text-xs text-gray-500 dark:text-gray-400">Required customers × Monthly churn rate</div>
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