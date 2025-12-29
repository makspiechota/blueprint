import React, { useState } from 'react';
import ChatButton from './ChatButton';
import EditButton from './EditButton';
import { useChat } from '../context/ChatContext';
import { aiService } from '../services/aiService';
import { unprocessObjectDocLinks } from '../utils/docLinkProcessor';
import yaml from 'js-yaml';

interface AAARRData {
  title?: string;
  stages?: {
    acquisition?: {
      stage_goal?: string;
      current?: any;
      metrics?: Array<{
        name?: string;
        description?: string;
        target?: any;
        current?: any;
      }>;
    };
    activation?: {
      stage_goal?: string;
      current?: any;
      metrics?: Array<{
        name?: string;
        description?: string;
        target?: any;
        current?: any;
      }>;
    };
    retention?: {
      stage_goal?: string;
      current?: any;
      metrics?: Array<{
        name?: string;
        description?: string;
        target?: any;
        current?: any;
      }>;
    };
    referral?: {
      stage_goal?: string;
      current?: any;
      metrics?: Array<{
        name?: string;
        description?: string;
        target?: any;
        current?: any;
      }>;
    };
    revenue?: {
      stage_goal?: string;
      current?: any;
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
  leanViabilityData?: any;
  leanCanvasData?: any;
}

const CustomersFactoryVisualizer: React.FC<CustomersFactoryVisualizerProps> = ({ data, leanViabilityData, leanCanvasData }) => {
  const { openChat } = useChat();
  const [selectedStage, setSelectedStage] = useState('acquisition');

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [editingCurrent, setEditingCurrent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = (sectionKey: string, sectionData: any) => {
    setEditingSection(sectionKey);
    if (sectionKey.includes('-current')) {
      // For current, extract the main value for editing
      setEditingCurrent(sectionData?.rate?.toString() || sectionData?.amount?.toString() || sectionData?.score?.toString() || '');
    } else {
      setEditedContent(yaml.dump(sectionData || {}));
    }
  };

  const handleSaveEdit = async () => {
    if (!editingSection) return;

    const content = editingSection.includes('-current') ? editingCurrent : editedContent;
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      const parsedSection = yaml.load(content);

      // For customers factory, we need to update the specific stage
      const updatedData = { ...data };
      if (editingSection.includes('-metric-')) {
        // Handle metric editing: customers-factory-{stage}-metric-{index}
        const parts = editingSection.split('-metric-');
        const stageKey = parts[0].replace('customers-factory-', '');
        const metricIndex = parseInt(parts[1]);

        if (updatedData.stages?.[stageKey as keyof typeof updatedData.stages]?.metrics?.[metricIndex]) {
          (updatedData.stages[stageKey as keyof typeof updatedData.stages] as any).metrics[metricIndex] = parsedSection;
        }
      } else if (editingSection.includes('-current')) {
        // Handle current editing: customers-factory-{stage}-current
        const stageKey = editingSection.replace('customers-factory-', '').replace('-current', '');
        if (updatedData.stages?.[stageKey as keyof typeof updatedData.stages]) {
          // Reconstruct the current object based on stage
          let currentObj: any = {};
          const value = parseFloat(editingCurrent);
          if (stageKey === 'acquisition' || stageKey === 'activation' || stageKey === 'retention') {
            currentObj.rate = value;
          } else if (stageKey === 'revenue') {
            currentObj.amount = value;
            currentObj.currency = 'USD';
          } else if (stageKey === 'referral') {
            currentObj.score = value;
          }
          (updatedData.stages[stageKey as keyof typeof updatedData.stages] as any).current = currentObj;
        }
      } else if (editingSection.startsWith('customers-factory-')) {
        // Handle stage editing
        const stageKey = editingSection.replace('customers-factory-', '');
        if (updatedData.stages?.[stageKey as keyof typeof updatedData.stages]) {
          (updatedData.stages as any)[stageKey] = parsedSection;
        }
      }

      // Convert HTML links back to [[doc-name]] syntax before saving
      const cleanedData = unprocessObjectDocLinks(updatedData);
      const yamlContent = yaml.dump(cleanedData);
      const result = await aiService.saveFileContent('src/data/aaarr-metrics.yaml', yamlContent);

      if (result.success) {
        setEditingSection(null);
        setEditedContent('');
        setEditingCurrent('');
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
    setEditingCurrent('');
  };

  const stages = [
    { key: 'acquisition', label: 'Acquisition', color: 'blue', bgClass: 'bg-blue-100 dark:bg-blue-900/30', borderClass: 'border-blue-300 dark:border-blue-700', bulletClass: 'bg-blue-500', textClass: 'text-blue-900 dark:text-blue-100' },
    { key: 'activation', label: 'Activation', color: 'green', bgClass: 'bg-green-100 dark:bg-green-900/30', borderClass: 'border-green-300 dark:border-green-700', bulletClass: 'bg-green-500', textClass: 'text-green-900 dark:text-green-100' },
    { key: 'retention', label: 'Retention', color: 'yellow', bgClass: 'bg-yellow-100 dark:bg-yellow-900/30', borderClass: 'border-yellow-300 dark:border-yellow-700', bulletClass: 'bg-yellow-500', textClass: 'text-yellow-900 dark:text-yellow-100' },
    { key: 'referral', label: 'Referral', color: 'purple', bgClass: 'bg-purple-100 dark:bg-purple-900/30', borderClass: 'border-purple-300 dark:border-purple-700', bulletClass: 'bg-purple-500', textClass: 'text-purple-900 dark:text-purple-100' },
    { key: 'revenue', label: 'Revenue', color: 'indigo', bgClass: 'bg-indigo-100 dark:bg-indigo-900/30', borderClass: 'border-indigo-300 dark:border-indigo-700', bulletClass: 'bg-indigo-500', textClass: 'text-indigo-900 dark:text-indigo-100' },
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{data.title || 'Customers Factory'}</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">AAARR Growth Framework</span>
      </div>

      {/* Stage Selection Menu */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
         {stages.map((stage) => (
            <div key={stage.key}>
               <button
                onClick={() => setSelectedStage(stage.key)}
                className={`w-full p-4 rounded-lg border text-left hover:shadow-md transition-all h-full flex flex-col ${
                selectedStage === stage.key
                  ? `${stage.bgClass} ${stage.borderClass}`
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
           >
            <>
              {/* Top section: Stage name and goal */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 ${stage.bulletClass} rounded-full`}></div>
                  <span className={`font-semibold ${stage.textClass}`}>
                    {stage.label}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {data.stages?.[stage.key as keyof typeof data.stages]?.stage_goal || 'Loading...'}
                </p>
              </div>
              {/* Bottom section: Target metrics - pushed to bottom with mt-auto */}
              {(() => {
                let targetValue = '';
                let currentValue = '';
                let unit = '';
                if (stage.key === 'acquisition') {
                  const rate = leanViabilityData?.calculations?.conversion_rates?.prospect_acquisition_rate;
                  if (rate) targetValue = `${(rate * 100).toFixed(1)}%`;
                  unit = 'Prospect Acquisition Rate';
                } else if (stage.key === 'activation') {
                  const rate = leanViabilityData?.calculations?.conversion_rates?.acquisition_rate;
                  if (rate) targetValue = `${(rate * 100).toFixed(1)}%`;
                  unit = 'Conversion Rate';
                } else if (stage.key === 'retention') {
                  const rate = leanViabilityData?.calculations?.churn_rate?.monthly_rate;
                  if (rate) targetValue = `${(rate * 100).toFixed(1)}%`;
                  unit = 'Monthly Churn Rate (Lower is Better)';
                } else if (stage.key === 'revenue') {
                  const amount = leanCanvasData?.key_metrics?.annual_revenue_3_years_target?.amount;
                  if (amount) targetValue = `$${amount.toLocaleString()}`;
                  unit = 'Annual Revenue Target';
                }
              const currentData = data.stages?.[stage.key as keyof typeof data.stages]?.current;
              currentValue = currentData ? (
                stage.key === 'revenue' ?
                  `$${currentData.amount?.toLocaleString() || '0'}` :
                  `${((currentData.rate || 0) * 100).toFixed(1)}%`
              ) : 'Not set';
                return targetValue ? (
                  <div className="space-y-2 mt-auto pt-3 w-full">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{unit}</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Target:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {targetValue}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Current:</span>
                      {editingSection === `customers-factory-${stage.key}-current` ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editingCurrent}
                            onChange={(e) => setEditingCurrent(e.target.value)}
                            className="w-16 px-1 py-0 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            autoFocus
                            step="0.01"
                          />
                          <button
                            onClick={handleSaveEdit}
                            disabled={isSaving}
                            className="px-1 py-0 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white text-xs rounded"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="px-1 py-0 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white text-xs rounded"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {currentValue || 'Not set'}
                        </span>
                      )}
                    </div>
                    {stage.key === 'revenue' && (() => {
                      const saleRate = leanViabilityData?.calculations?.conversion_rates?.acquisition_rate;
                      const saleTarget = saleRate ? `${(saleRate * 100).toFixed(1)}%` : '';
                      const saleCurrentData = data.stages?.revenue?.current;
                      const saleCurrent = saleCurrentData ? `${((saleCurrentData.rate || 0) * 100).toFixed(1)}%` : 'Not set';
                      return saleTarget ? (
                        <>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Sale Conversion Rate</div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Target:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {saleTarget}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Current:</span>
                            {editingSection === 'customers-factory-revenue-sale-current' ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={editingCurrent}
                                  onChange={(e) => setEditingCurrent(e.target.value)}
                                  className="w-16 px-1 py-0 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                  autoFocus
                                  step="0.01"
                                />
                                <button
                                  onClick={handleSaveEdit}
                                  disabled={isSaving}
                                  className="px-1 py-0 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white text-xs rounded"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  disabled={isSaving}
                                  className="px-1 py-0 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white text-xs rounded"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <span className="font-medium text-blue-600 dark:text-blue-400">
                                {saleCurrent}
                              </span>
                            )}
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                ) : null;
              })()}
            </>
            </button>
           </div>
         ))}
      </div>

      {/* Stage Metrics Display */}
      {currentStage && (
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
             <div className={`w-4 h-4 ${stages.find(s => s.key === selectedStage)?.bulletClass} rounded-full`}></div>
             {stages.find(s => s.key === selectedStage)?.label} Metrics
           </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {currentStage.metrics?.map((metric, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {metric.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <EditButton onClick={() => handleEditClick(`customers-factory-${selectedStage}-metric-${index}`, metric)} />
                      <ChatButton
                        resourceType={`customers-factory-${selectedStage}-metric`}
                        resourceData={{ title: `${metric.name} Metric`, content: metric }}
                        onClick={handleChatClick}
                        className="!relative !top-0 !right-0"
                      />
                      {editingSection === `customers-factory-${selectedStage}-metric-${index}` && (
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
                  {editingSection === `customers-factory-${selectedStage}-metric-${index}` ? (
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full h-32 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      disabled={isSaving}
                    />
                  ) : (
                    <>
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
                    </>
                  )}
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