import React from 'react';
import ChatButton from './ChatButton';
import { useChat } from '../context/ChatContext';

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

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
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
           <ChatButton
             resourceType="lean-viability-revenue"
             resourceData={{ title: 'Annual Revenue Target', content: data.success_criteria?.annual_revenue }}
             onClick={handleChatClick}
           />
           <div className="text-3xl mb-3">💰</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${data.success_criteria?.annual_revenue?.amount?.toLocaleString() || '10,000,000'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Annual Revenue Target</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center relative">
           <ChatButton
             resourceType="lean-viability-customers"
             resourceData={{ title: 'Required Customers', content: data.calculations?.required_customers }}
             onClick={handleChatClick}
           />
           <div className="text-3xl mb-3">👥</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {data.calculations?.required_customers?.count || 833}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Required Customers</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center relative">
           <ChatButton
             resourceType="lean-viability-arpu"
             resourceData={{ title: 'ARPU (Annual Revenue Per User)', content: data.calculations?.annual_revenue_per_customer }}
             onClick={handleChatClick}
           />
           <div className="text-3xl mb-3">💵</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            ${data.calculations?.annual_revenue_per_customer?.amount?.toLocaleString() || '12,000'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">ARPU (Annual Revenue Per User)</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center relative">
           <ChatButton
             resourceType="lean-viability-time"
             resourceData={{ title: 'Time Horizon', content: data.time_horizon }}
             onClick={handleChatClick}
           />
           <div className="text-3xl mb-3">⏰</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {data.time_horizon?.duration || 3} {data.time_horizon?.unit || 'years'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Time to Reach Target</div>
        </div>
      </div>

      {/* Detailed Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assumptions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
           <ChatButton
             resourceType="lean-viability-assumptions"
             resourceData={{ title: 'Key Assumptions', content: data.calculations }}
             onClick={handleChatClick}
           />
           <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400">📊</span>
            Key Assumptions
          </h3>
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
        </div>

        {/* Work-Backwards Calculations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
           <ChatButton
             resourceType="lean-viability-calculations"
             resourceData={{ title: 'Work-Backwards Calculations', content: data.calculations }}
             onClick={handleChatClick}
           />
           <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-green-600 dark:text-green-400">🧮</span>
            Work-Backwards Calculations
          </h3>
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