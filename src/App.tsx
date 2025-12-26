import React, { useState, useEffect } from 'react';
import * as yaml from 'js-yaml';
import NorthStarVisualizer from './components/NorthStarVisualizer';
import LeanCanvasVisualizer from './components/LeanCanvasVisualizer';
import LeanViabilityVisualizer from './components/LeanViabilityVisualizer';
import AARRRMetricsVisualizer from './components/AARRRMetricsVisualizer';
import PolicyCharterVisualizer from './components/PolicyCharterVisualizer';
import TraceabilityVisualizer from './components/TraceabilityVisualizer';
import { NorthStar, LeanCanvas, LeanViability, AARRRMetrics, PolicyCharter } from './parser/types';

function App() {
  const [activeTab, setActiveTab] = useState('north-star');
  const [data, setData] = useState<{
    northStar: NorthStar | null;
    leanCanvas: LeanCanvas | null;
    leanViability: LeanViability | null;
    aaarrMetrics: AARRRMetrics | null;
    policyCharter: PolicyCharter | null;
  }>({
    northStar: null,
    leanCanvas: null,
    leanViability: null,
    aaarrMetrics: null,
    policyCharter: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [northStarRes, leanCanvasRes, leanViabilityRes, aaarrRes, policyRes] = await Promise.all([
          fetch('/examples/complete-business/north-star.yaml'),
          fetch('/examples/complete-business/lean-canvas.yaml'),
          fetch('/examples/complete-business/lean-viability.yaml'),
          fetch('/examples/complete-business/aaarr-metrics.yaml'),
          fetch('/examples/complete-business/policy-charter.yaml'),
        ]);

        const northStar = yaml.load(await northStarRes.text()) as NorthStar;
        const leanCanvas = yaml.load(await leanCanvasRes.text()) as LeanCanvas;
        const leanViability = yaml.load(await leanViabilityRes.text()) as LeanViability;
        const aaarrMetrics = yaml.load(await aaarrRes.text()) as AARRRMetrics;
        const policyCharter = yaml.load(await policyRes.text()) as PolicyCharter;

        setData({
          northStar,
          leanCanvas,
          leanViability,
          aaarrMetrics,
          policyCharter,
        });
      } catch (error) {
        console.error('Failed to load business data:', error);
      }
    };

    loadData();
  }, []);

  // Fallback sample data for development
  const sampleNorthStar = {
    type: 'north-star' as const,
    version: '1.0',
    last_updated: '2025-12-25',
    title: 'AI Support Assistant',
    vision: 'Revolutionize customer support by making expert-level assistance instantly accessible to every business',
    problem: 'Small and medium businesses struggle with inconsistent, slow, and expensive customer support that damages customer relationships and limits growth',
    solution: 'Build an AI-powered support assistant that learns from expert interactions and provides 24/7 intelligent responses across all channels',
    strategic_goals: [
      {
        title: 'Achieve Product-Market Fit',
        description: 'Validate that businesses are willing to pay for AI support that matches human expert quality'
      },
      {
        title: 'Scale to 1000 Active Customers',
        description: 'Grow the user base to demonstrate market demand and network effects'
      },
      {
        title: 'Establish Thought Leadership',
        description: 'Become recognized as the leading AI solution for customer support automation'
      }
    ]
  };

  const sampleLeanCanvas = {
    type: 'lean-canvas' as const,
    version: '1.0',
    last_updated: '2025-12-25',
    title: 'AI Support Assistant Business Model',
    problem: {
      top_3_problems: [
        'Support tickets take 24-48 hours to resolve, frustrating customers',
        'Hiring skilled support agents is expensive and difficult',
        'Inconsistent responses across different support channels'
      ],
      existing_alternatives: 'Generic chatbots, outsourced support teams, basic ticketing systems'
    },
    solution: {
      top_3_features: [
        'Context-aware responses using company knowledge base',
        'Seamless handoff to human agents when needed',
        'Multi-channel support (email, chat, voice)'
      ]
    },
    unique_value_proposition: {
      single_clear_message: 'Get expert-level customer support that never sleeps',
      high_level_concept: 'AI assistant trained on your expert team\'s responses'
    },
    unfair_advantage: {
      cant_be_copied: 'Proprietary training data from Fortune 500 support interactions'
    },
    customer_segments: {
      target_customers: 'Small to medium businesses (50-500 employees) in B2B SaaS, e-commerce, and professional services',
      early_adopters: 'Tech-savvy SaaS companies already using basic automation'
    },
    key_metrics: {
      activities_to_measure: [
        'Response accuracy rate (>95%)',
        'Customer satisfaction score',
        'Resolution time reduction'
      ]
    },
    channels: {
      path_to_customers: [
        'Content marketing on support automation',
        'Partnerships with CRM and helpdesk platforms',
        'Direct sales to enterprise customers'
      ]
    },
    revenue_streams: {
      revenue_model: 'SaaS subscription based on support volume',
      lifetime_value: '$50,000+ for mid-sized businesses'
    },
    cost_structure: {
      customer_acquisition_cost: '$500 per customer through content marketing',
      distribution_costs: '$100 per customer for cloud infrastructure',
      hosting_costs: '$200 per customer for AI processing',
      people_costs: '$300 per customer for ongoing model training'
    }
  };

  const sampleLeanViability = {
    type: 'lean-viability' as const,
    version: '1.0',
    last_updated: '2025-12-25',
    title: 'AI Support Assistant Viability Analysis',
    time_horizon: { duration: 3, unit: 'years' as const },
    success_criteria: {
      annual_revenue: { amount: 10000000, currency: 'USD' as const },
      target_year: 3
    },
    calculations: {
      annual_revenue_per_customer: {
        amount: 12000,
        currency: 'USD' as const,
        basis: 'Average contract value for SMB customers'
      },
      required_customers: {
        count: 833,
        formula: 'Annual revenue target / Annual revenue per customer'
      },
      customer_acquisition_rate: {
        rate: 25,
        period: 'month' as const,
        formula: 'Required customers / (Time horizon in months)'
      },
      monthly_acquisition_target: {
        rate: 25,
        period: 'month' as const,
        formula: 'Customer acquisition rate adjusted for churn'
      },
      customer_lifetime_value: {
        years: 3,
        formula: 'Annual revenue per customer * Customer lifetime'
      },
      churn_rate: {
        monthly_rate: 0.05,
        formula: 'Industry average for SaaS support tools'
      },
      conversion_rate: {
        rate: 0.15,
        basis: 'Website visitors to paying customers'
      },
      monthly_visitors: {
        rate: 166,
        period: 'month' as const,
        formula: 'Monthly acquisition target / Conversion rate'
      }
    },
    targets: {
      acquisition: {
        monthly_signups: { rate: 25, period: 'month' as const }
      },
      revenue: {
        arpu: { amount: 1000, currency: 'USD' as const, period: 'month' as const }
      }
    }
  };

  const sampleAARRRMetrics = {
    type: 'aaarr-metrics' as const,
    version: '1.0',
    last_updated: '2025-12-25',
    title: 'AI Support Assistant AAARR Metrics',
    stages: {
      acquisition: {
        stage_goal: 'Attract businesses to try our AI support solution',
        metrics: [
          {
            id: 'aaarr.acquisition.website-visitors',
            name: 'Website Visitors',
            description: 'Unique visitors to marketing pages',
            target: { rate: 200, period: 'month' as const },
            current: { rate: 150, period: 'month' as const },
            gap: { rate: 50, period: 'month' as const }
          },
          {
            id: 'aaarr.acquisition.visitor-conversion',
            name: 'Visitor to Trial Conversion',
            description: 'Percentage of visitors who start free trial',
            target: { percentage: 15 },
            current: { percentage: 12 },
            gap: { percentage: 3 }
          }
        ]
      },
      activation: {
        stage_goal: 'Get customers successfully using AI support',
        metrics: [
          {
            id: 'aaarr.activation.first-response-rate',
            name: 'First AI Response Rate',
            description: 'Customers who receive their first AI response within 1 hour',
            target: { percentage: 95 },
            current: { percentage: 88 },
            gap: { percentage: 7 }
          },
          {
            id: 'aaarr.activation.core-feature-usage',
            name: 'Core Feature Usage',
            description: 'Customers using AI responses for >50% of support volume',
            target: { percentage: 70 },
            current: { percentage: 45 },
            gap: { percentage: 25 }
          }
        ]
      },
      retention: {
        stage_goal: 'Keep customers subscribed and expanding usage',
        metrics: [
          {
            id: 'aaarr.retention.monthly-churn',
            name: 'Monthly Churn Rate',
            description: 'Percentage of customers canceling subscription',
            target: { percentage: 5 },
            current: { percentage: 7 },
            gap: { percentage: -2 }
          }
        ]
      },
      referral: {
        stage_goal: 'Turn satisfied customers into advocates',
        metrics: [
          {
            id: 'aaarr.referral.nps',
            name: 'Net Promoter Score',
            description: 'Customer satisfaction and likelihood to recommend',
            target: null,
            current: null,
            gap: null
          }
        ]
      },
      revenue: {
        stage_goal: 'Generate sustainable recurring revenue',
        metrics: [
          {
            id: 'aaarr.revenue.monthly-recurring',
            name: 'Monthly Recurring Revenue',
            description: 'Total MRR from all customers',
            target: { amount: 8333, currency: 'USD' },
            current: { amount: 5000, currency: 'USD' },
            gap: { amount: 3333, currency: 'USD' }
          }
        ]
      }
    }
  };

  const samplePolicyCharter = {
    type: 'policy-charter' as const,
    version: '1.0',
    last_updated: '2025-12-25',
    title: 'AI Support Assistant Operational Policies',
    architectural_scope_ref: 'architectural-scope.yaml',
    aaarr_metrics_ref: 'aaarr-metrics.yaml',
    goals: [
      {
        title: 'Reduce average response time',
        description: 'Deliver instant AI responses instead of hours-long waits'
      },
      {
        title: 'Lower support operational costs',
        description: 'Reduce expenses while scaling support capacity'
      },
      {
        title: 'Maintain expert-level response quality',
        description: 'Ensure AI responses match or exceed human expert responses'
      }
    ]
  };

  const tabs = [
    {
      id: 'north-star',
      label: 'North Star',
      component: data.northStar ? <NorthStarVisualizer northstar={data.northStar} /> : <NorthStarVisualizer northstar={sampleNorthStar} />
    },
    {
      id: 'lean-canvas',
      label: 'Lean Canvas',
      component: data.leanCanvas ? <LeanCanvasVisualizer canvas={data.leanCanvas} /> : <LeanCanvasVisualizer canvas={sampleLeanCanvas} />
    },
    {
      id: 'lean-viability',
      label: 'Lean Viability',
      component: data.leanViability ? <LeanViabilityVisualizer viability={data.leanViability} /> : <LeanViabilityVisualizer viability={sampleLeanViability} />
    },
    {
      id: 'aaarr-metrics',
      label: 'AAARR Metrics',
      component: data.aaarrMetrics ? <AARRRMetricsVisualizer metrics={data.aaarrMetrics} /> : <div className="container"><p>Loading AAARR Metrics...</p></div>
    },
    {
      id: 'policy-charter',
      label: 'Policy Charter',
      component: data.policyCharter ? <PolicyCharterVisualizer charter={data.policyCharter} /> : <div className="container"><p>Loading Policy Charter...</p></div>
    },
    { id: 'traceability', label: 'Traceability Graph', component: <TraceabilityVisualizer /> },
  ];

  return (
    <div className="app">
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>

      <style jsx>{`
        .app {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
          overflow-x: auto;
        }

        .tab-button {
          padding: 12px 24px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          font-size: 1rem;
          font-weight: 500;
          color: #7f8c8d;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .tab-button:hover {
          color: #2c3e50;
          background: #f5f5f5;
        }

        .tab-button.active {
          color: #3498db;
          border-bottom-color: #3498db;
        }

        .tab-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          min-height: 80vh;
        }
      `}</style>
    </div>
  );
}

export default App;