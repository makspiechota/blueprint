import React, { useState } from 'react';
import ChatButton from './ChatButton';
import EditButton from './EditButton';
import { useChat } from '../context/ChatContext';
import { aiService } from '../services/aiService';
import yaml from 'js-yaml';
import { calculateLeanViabilityMetrics } from '../utils/leanViabilityCalculations';
import ReactApexChart from 'react-apexcharts';

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
    conversion_rates?: {
      prospect_acquisition_rate?: number; // prospects → users
      activation_rate?: number; // users → activated users
      acquisition_rate?: number; // activated users → customers
    };
    funnel_targets?: {
      users_target?: number; // users needed
      users_activation_target?: number; // activated users needed
      users_acquisition_target?: number; // prospects needed
    };
  };
}

interface LeanViabilityVisualizerProps {
  data: LeanViability;
  leanCanvasData?: any;
}

// Hockey Stick Chart Component
const HockeyStickChart: React.FC<{ targetCustomers: number }> = ({ targetCustomers }) => {
  console.log('HockeyStickChart targetCustomers:', targetCustomers);
  // Calculate hockey stick data points (exponential growth)
  // Year 1: target ÷ 100, Year 2: target ÷ 10, Year 3: target
  const year1 = Math.round(targetCustomers / 100);
  const year2 = Math.round(targetCustomers / 10);
  const year3 = targetCustomers;
  console.log('Chart data points:', year1, year2, year3);

  const chartData = {
    series: [{
      name: 'Customers',
      data: [year1, year2, year3]
    }],
    options: {
      chart: {
        type: 'line' as const,
        height: 300,
        toolbar: {
          show: false
        },
        background: 'transparent'
      },
      colors: ['#4f46e5'], // Indigo color
      stroke: {
        curve: 'smooth' as const,
        width: 4
      },
      markers: {
        size: 6,
        colors: ['#4f46e5'],
        strokeColors: '#fff',
        strokeWidth: 2
      },
      xaxis: {
        categories: ['Year 1', 'Year 2', 'Year 3'],
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px'
          },
          formatter: (value: number) => {
            return value.toLocaleString();
          }
        }
      },
      grid: {
        show: true,
        borderColor: '#e5e7eb',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value: number) => `${value.toLocaleString()} customers`
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.4,
          gradientToColors: ['#4f46e5'],
          inverseColors: false,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 100]
        }
      }
    }
  };

  return (
    <div className="w-full">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={300}
      />
    </div>
  );
};

const LeanViabilityVisualizer: React.FC<LeanViabilityVisualizerProps> = ({ data, leanCanvasData }) => {
  const { openChat } = useChat();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [localData, setLocalData] = useState<LeanViability>(data);

  // Update local data when prop data changes
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Recalculate when Lean Canvas data changes
  React.useEffect(() => {
    if (leanCanvasData) {
      const calculatedData = calculateLeanViabilityMetrics(data, leanCanvasData);
      setLocalData(calculatedData);
    }
  }, [leanCanvasData, data]);

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  const handleEditClick = (sectionKey: string, sectionData: any) => {
    setEditingSection(sectionKey);
    console.log('handleEditClick:', sectionKey, sectionData);
    if (sectionKey === 'arpu') {
      setEditedContent((sectionData || 12000).toString());
    } else if (sectionKey === 'prospect_acquisition_rate') {
      setEditedContent((sectionData || 0.05).toString());
    } else if (sectionKey === 'activation_rate') {
      setEditedContent((sectionData || 0.1).toString());
    } else if (sectionKey === 'acquisition_rate') {
      setEditedContent((sectionData || 0.05).toString());
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
      if (editingSection === 'arpu') {
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
      } else if (editingSection === 'activation_rate') {
        const rate = parseFloat(editedContent);
        if (!updatedData.calculations) updatedData.calculations = {};
        if (!updatedData.calculations.conversion_rates) updatedData.calculations.conversion_rates = {};
        updatedData.calculations.conversion_rates.activation_rate = rate;
      } else if (editingSection === 'prospect_acquisition_rate') {
        const rate = parseFloat(editedContent);
        if (!updatedData.calculations) updatedData.calculations = {};
        if (!updatedData.calculations.conversion_rates) updatedData.calculations.conversion_rates = {};
        updatedData.calculations.conversion_rates.prospect_acquisition_rate = rate;
      } else if (editingSection === 'acquisition_rate') {
        const rate = parseFloat(editedContent);
        if (!updatedData.calculations) updatedData.calculations = {};
        if (!updatedData.calculations.conversion_rates) updatedData.calculations.conversion_rates = {};
        updatedData.calculations.conversion_rates.acquisition_rate = rate;
      } else {
        const parsedSection = yaml.load(editedContent);
        (updatedData as any)[editingSection] = parsedSection;
      }

      // Recalculate all dependent values
      const calculatedData = calculateLeanViabilityMetrics(updatedData, leanCanvasData);
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

       {/* Primary Business Target */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center relative">
             <div className="flex items-center justify-between mb-3">
               <div className="text-sm text-gray-600 dark:text-gray-400">Annual Revenue in 3 Years</div>
               <div className="flex items-center gap-2">
                  <ChatButton
                    resourceType="lean-canvas-key-metrics"
                    resourceData={{ title: 'Annual Revenue 3 Years Target', content: leanCanvasData?.key_metrics?.annual_revenue_3_years_target }}
                    onClick={handleChatClick}
                    className="!relative !top-0 !right-0"
                  />
               </div>
             </div>
             <div className="text-3xl mb-3">🎯</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${leanCanvasData?.key_metrics?.annual_revenue_3_years_target?.amount?.toLocaleString() || '750,000'}
              </div>
             <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
               From Lean Canvas
             </div>
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
                     <span className="font-bold text-purple-600 dark:text-purple-400">
                       ${((localData.calculations?.annual_revenue_per_customer?.amount || 12000) * (localData.calculations?.customer_lifetime_value?.years || 3)).toLocaleString()}
                     </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">ARPU × Lifetime</div>
                </div>

               </div>
         </div>
       </div>

       {/* User Acquisition Funnel */}
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
         <div className="flex items-center justify-between mb-6">
           <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
             <span className="text-cyan-600 dark:text-cyan-400">🎯</span>
             User Acquisition Funnel
           </h3>
           <div className="flex items-center gap-2">
             <ChatButton
               resourceType="lean-viability-funnel"
               resourceData={{ title: 'User Acquisition Funnel', content: localData.calculations }}
               onClick={handleChatClick}
               className="!relative !top-0 !right-0"
             />
           </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Conversion Rates */}
           <div className="space-y-4">
             <h4 className="text-lg font-medium text-gray-900 dark:text-white">Conversion Rates</h4>
             <div className="space-y-3">
               <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                 <span className="text-gray-700 dark:text-gray-300">Prospect Acquisition Rate</span>
                 <div className="flex items-center gap-2">
                   {editingSection === 'prospect_acquisition_rate' ? (
                     <>
                       <input
                         type="number"
                         value={editedContent}
                         onChange={(e) => setEditedContent(e.target.value)}
                         className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                         disabled={isSaving}
                         step="0.01"
                         min="0.01"
                         max="1"
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
                       <span className="font-semibold text-gray-900 dark:text-white">{((localData.calculations?.conversion_rates?.prospect_acquisition_rate || 0.05) * 100).toFixed(1)}%</span>
                       <EditButton onClick={() => handleEditClick('prospect_acquisition_rate', localData.calculations?.conversion_rates?.prospect_acquisition_rate)} />
                     </>
                   )}
                 </div>
               </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Prospects → Users</div>

               <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                 <span className="text-gray-700 dark:text-gray-300">User Activation Rate</span>
                 <div className="flex items-center gap-2">
                   {editingSection === 'activation_rate' ? (
                     <>
                       <input
                         type="number"
                         value={editedContent}
                         onChange={(e) => setEditedContent(e.target.value)}
                         className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                         disabled={isSaving}
                         step="0.01"
                         min="0.01"
                         max="1"
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
                        <span className="font-semibold text-gray-900 dark:text-white">{((localData.calculations?.conversion_rates?.activation_rate || 0.1) * 100).toFixed(1)}%</span>
                       <EditButton onClick={() => handleEditClick('activation_rate', localData.calculations?.conversion_rates?.activation_rate)} />
                     </>
                   )}
                 </div>
               </div>
               <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Users → Activated Users</div>

               <div className="flex justify-between items-center py-2">
                 <span className="text-gray-700 dark:text-gray-300">Sale/Conversion Rate</span>
                 <div className="flex items-center gap-2">
                   {editingSection === 'acquisition_rate' ? (
                     <>
                       <input
                         type="number"
                         value={editedContent}
                         onChange={(e) => setEditedContent(e.target.value)}
                         className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                         disabled={isSaving}
                         step="0.01"
                         min="0.01"
                         max="1"
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
                        <span className="font-semibold text-gray-900 dark:text-white">{((localData.calculations?.conversion_rates?.acquisition_rate || 0.05) * 100).toFixed(1)}%</span>
                       <EditButton onClick={() => handleEditClick('acquisition_rate', localData.calculations?.conversion_rates?.acquisition_rate)} />
                     </>
                   )}
                 </div>
               </div>
               <div className="text-xs text-gray-500 dark:text-gray-400">Activated Users → Customers</div>
             </div>
           </div>

           {/* Funnel Targets */}
           <div className="space-y-4">
             <h4 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Targets</h4>
             <div className="space-y-4">
               <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-gray-700 dark:text-gray-300 font-medium">Prospects Needed</span>
                   <span className="font-bold text-cyan-600 dark:text-cyan-400">{localData.calculations?.funnel_targets?.users_acquisition_target || 2800} prospects</span>
                 </div>
                 <div className="text-xs text-gray-500 dark:text-gray-400">Raw leads required</div>
               </div>

               <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-gray-700 dark:text-gray-300 font-medium">Users Target</span>
                   <span className="font-bold text-cyan-600 dark:text-cyan-400">{localData.calculations?.funnel_targets?.users_target || 1400} users</span>
                 </div>
                 <div className="text-xs text-gray-500 dark:text-gray-400">Users after acquisition</div>
               </div>

               <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-gray-700 dark:text-gray-300 font-medium">Activated Users Target</span>
                   <span className="font-bold text-cyan-600 dark:text-cyan-400">{localData.calculations?.funnel_targets?.users_activation_target || 140} activated</span>
                 </div>
                 <div className="text-xs text-gray-500 dark:text-gray-400">Activated users needed</div>
               </div>

               <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-gray-700 dark:text-gray-300 font-medium">Customer Target</span>
                   <span className="font-bold text-green-600 dark:text-green-400">{localData.calculations?.monthly_acquisition_target?.rate || 7} customers</span>
                 </div>
                 <div className="text-xs text-gray-500 dark:text-gray-400">Paying customers needed</div>
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Financial Projections - Hockey Stick Chart */}
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
         <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
           <span className="text-indigo-600 dark:text-indigo-400">📈</span>
           3-Year Customer Growth Projection
         </h3>
         <div className="mb-4">
           <HockeyStickChart targetCustomers={localData.calculations?.required_customers?.count || 250} />
         </div>
         <div className="text-sm text-gray-600 dark:text-gray-400">
           <p className="mb-2"><strong>Hockey Stick Growth:</strong> Exponential customer acquisition following the classic hockey stick pattern where each year is 10x the previous year.</p>
           <p><strong>Year 1:</strong> {Math.round((localData.calculations?.required_customers?.count || 250) / 100)} customers</p>
           <p><strong>Year 2:</strong> {Math.round((localData.calculations?.required_customers?.count || 250) / 10)} customers</p>
           <p><strong>Year 3:</strong> {localData.calculations?.required_customers?.count || 250} customers (annual target)</p>
         </div>
       </div>
    </div>
  );
};

export default LeanViabilityVisualizer;