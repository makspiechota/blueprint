import React, { createContext, useContext, useEffect, useState } from 'react';
import { processDocLinks } from '../utils/docLinkProcessor';

const API_BASE = 'http://localhost:3001';

interface BusinessData {
  productName?: string;
  setProductName?: (name: string) => void;
  northStar?: any;
  leanCanvas?: any;
  architecturalScope?: any;
  leanViability?: any;
  aaarrMetrics?: any;
  policyCharter?: any;
}

const BusinessDataContext = createContext<BusinessData>({
  productName: 'blueprint',
  setProductName: () => {},
  northStar: null,
  leanCanvas: null,
  architecturalScope: null,
  leanViability: null,
  aaarrMetrics: null,
  policyCharter: null,
});

export const useBusinessData = () => {
  const context = useContext(BusinessDataContext);
  return context;
};

// Recursively process all string values in an object to apply doc links
const processObjectDocLinks = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return processDocLinks(obj);
  if (Array.isArray(obj)) return obj.map(processObjectDocLinks);
  if (typeof obj === 'object') {
    const processed: any = {};
    for (const key in obj) {
      processed[key] = processObjectDocLinks(obj[key]);
    }
    return processed;
  }
  return obj;
};

// Merge goals from architectural-scope into policy-charter
const mergeGoalsIntoPolicyCharter = (architecturalScope: any, policyCharter: any): any => {
  if (!architecturalScope?.why?.goals || !policyCharter) {
    return policyCharter;
  }

  const mappedGoals = architecturalScope.why.goals.map((goal: any, index: number) => ({
    id: `as.goal.${index + 1}`,
    title: goal.title,
    description: goal.description,
    tactics: []
  }));

  // Add tactics to goals based on addresses_goal
  if (policyCharter.tactics) {
    policyCharter.tactics.forEach((tactic: any) => {
      if (tactic.addresses_goal) {
        const goal = mappedGoals.find((g: any) => g.id === tactic.addresses_goal);
        if (goal) {
          goal.tactics.push(tactic.id);
        }
      }
    });
  }

  return {
    ...policyCharter,
    goals: mappedGoals
  };
};

const loadData = async (productName: string) => {
  try {
    const [northStarRes, leanCanvasRes, architecturalScopeRes, leanViabilityRes, aaarrMetricsRes, policyCharterRes] = await Promise.all([
      fetch(`${API_BASE}/api/yaml/${productName}/north-star.yaml`),
      fetch(`${API_BASE}/api/yaml/${productName}/lean-canvas.yaml`),
      fetch(`${API_BASE}/api/yaml/${productName}/architectural-scope.yaml`),
      fetch(`${API_BASE}/api/yaml/${productName}/lean-viability.yaml`),
      fetch(`${API_BASE}/api/yaml/${productName}/aaarr-metrics.yaml`),
      fetch(`${API_BASE}/api/yaml/${productName}/policy-charter.yaml`),
    ]);

    const northStar = northStarRes.ok ? processObjectDocLinks((await northStarRes.json()).data) : null;
    const leanCanvas = leanCanvasRes.ok ? processObjectDocLinks((await leanCanvasRes.json()).data) : null;
    const architecturalScope = architecturalScopeRes.ok ? processObjectDocLinks((await architecturalScopeRes.json()).data) : null;
    const leanViability = leanViabilityRes.ok ? processObjectDocLinks((await leanViabilityRes.json()).data) : null;
    const aaarrMetrics = aaarrMetricsRes.ok ? processObjectDocLinks((await aaarrMetricsRes.json()).data) : null;
    const policyCharterRaw = policyCharterRes.ok ? processObjectDocLinks((await policyCharterRes.json()).data) : null;

    // Merge goals from architectural-scope into policy-charter
    const policyCharter = mergeGoalsIntoPolicyCharter(architecturalScope, policyCharterRaw);

    return {
      northStar,
      leanCanvas,
      architecturalScope,
      leanViability,
      aaarrMetrics,
      policyCharter,
    };
  } catch (error) {
    console.error('Failed to load data from backend:', error);
    return {
      northStar: null,
      leanCanvas: null,
      architecturalScope: null,
      leanViability: null,
      aaarrMetrics: null,
      policyCharter: null,
    };
  }
};

export const BusinessDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productName, setProductName] = useState('blueprint');
  const [data, setData] = useState<BusinessData>({
    northStar: null,
    leanCanvas: null,
    architecturalScope: null,
    leanViability: null,
    aaarrMetrics: null,
    policyCharter: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const loadedData = await loadData(productName);
      setData({ ...loadedData, productName, setProductName });
      setLoading(false);
    };

    fetchData();

    // WebSocket connection for real-time updates
    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'file_update') {
          const { filename, data: updatedData } = message;

          // Map filename to data key
          const keyMap = {
            'north-star.yaml': 'northStar',
            'lean-canvas.yaml': 'leanCanvas',
            'architectural-scope.yaml': 'architecturalScope',
            'lean-viability.yaml': 'leanViability',
            'aaarr-metrics.yaml': 'aaarrMetrics',
            'policy-charter.yaml': 'policyCharter',
          };

          const dataKey = keyMap[filename as keyof typeof keyMap];
           if (dataKey) {
             setData(prev => ({
               ...prev,
               [dataKey]: processObjectDocLinks(updatedData)
             }));
             console.log(`Updated ${dataKey} from WebSocket`);
           }
        } else if (message.type === 'file_delete') {
          const { filename } = message;

          // Map filename to data key
          const keyMap = {
            'north-star.yaml': 'northStar',
            'lean-canvas.yaml': 'leanCanvas',
            'architectural-scope.yaml': 'architecturalScope',
            'lean-viability.yaml': 'leanViability',
            'aaarr-metrics.yaml': 'aaarrMetrics',
            'policy-charter.yaml': 'policyCharter',
          };

          const dataKey = keyMap[filename as keyof typeof keyMap];
          if (dataKey) {
            setData(prev => ({
              ...prev,
              [dataKey]: null
            }));
            console.log(`Removed ${dataKey} from WebSocket`);
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [productName]);

  if (loading) {
    return (
      <BusinessDataContext.Provider value={data}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading blueprint data...</div>
        </div>
      </BusinessDataContext.Provider>
    );
  }

  return (
    <BusinessDataContext.Provider value={data}>
      {children}
    </BusinessDataContext.Provider>
  );
};