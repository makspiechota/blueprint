import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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
  roadmap?: any;
  reloadRoadmap?: () => Promise<void>;
  tripwire?: any;
  reloadTripwire?: () => Promise<void>;
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
  roadmap: null,
  reloadRoadmap: async () => {},
  tripwire: null,
  reloadTripwire: async () => {},
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
    const [northStarRes, leanCanvasRes, architecturalScopeRes, leanViabilityRes, aaarrMetricsRes, policyCharterRes, roadmapRes, tripwireRes] = await Promise.all([
      fetch(`${API_BASE}/api/yaml/${productName}/north-star.yaml`),
      fetch(`${API_BASE}/api/yaml/${productName}/lean-canvas.yaml`),
      fetch(`${API_BASE}/api/yaml/${productName}/architectural-scope.yaml`),
      fetch(`${API_BASE}/api/yaml/${productName}/lean-viability.yaml`),
      fetch(`${API_BASE}/api/yaml/${productName}/aaarr-metrics.yaml`),
      fetch(`${API_BASE}/api/yaml/${productName}/policy-charter.yaml`),
      fetch(`${API_BASE}/api/roadmap/${productName}`),
      fetch(`${API_BASE}/api/tripwire/${productName}/course`),
    ]);

    const northStar = northStarRes.ok ? processObjectDocLinks((await northStarRes.json()).data) : null;
    const leanCanvas = leanCanvasRes.ok ? processObjectDocLinks((await leanCanvasRes.json()).data) : null;
    const architecturalScope = architecturalScopeRes.ok ? processObjectDocLinks((await architecturalScopeRes.json()).data) : null;
    const leanViability = leanViabilityRes.ok ? processObjectDocLinks((await leanViabilityRes.json()).data) : null;
    const aaarrMetrics = aaarrMetricsRes.ok ? processObjectDocLinks((await aaarrMetricsRes.json()).data) : null;
    const policyCharterRaw = policyCharterRes.ok ? processObjectDocLinks((await policyCharterRes.json()).data) : null;
    const roadmap = roadmapRes.ok ? (await roadmapRes.json()).data : null;
    const tripwire = tripwireRes.ok ? (await tripwireRes.json()).data : null;

    // Merge goals from architectural-scope into policy-charter
    const policyCharter = mergeGoalsIntoPolicyCharter(architecturalScope, policyCharterRaw);

    return {
      northStar,
      leanCanvas,
      architecturalScope,
      leanViability,
      aaarrMetrics,
      policyCharter,
      roadmap,
      tripwire,
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
      roadmap: null,
      tripwire: null,
    };
  }
};

const WS_URL = 'ws://localhost:8080';

// Map filenames to data keys
const filenameToKey: Record<string, keyof BusinessData> = {
  'north-star.yaml': 'northStar',
  'lean-canvas.yaml': 'leanCanvas',
  'architectural-scope.yaml': 'architecturalScope',
  'lean-viability.yaml': 'leanViability',
  'aaarr-metrics.yaml': 'aaarrMetrics',
  'policy-charter.yaml': 'policyCharter',
};

export const BusinessDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productName, setProductName] = useState('blueprint');
  const productNameRef = useRef(productName);
  const [data, setData] = useState<BusinessData>({
    northStar: null,
    leanCanvas: null,
    architecturalScope: null,
    leanViability: null,
    aaarrMetrics: null,
    policyCharter: null,
    roadmap: null,
    tripwire: null,
  });
  const [loading, setLoading] = useState(true);

  const setProductNameSafe = (name: string) => {
    // Allow any product name
    setProductName(name);
  };

  const reloadRoadmap = async () => {
    try {
      const roadmapRes = await fetch(`${API_BASE}/api/roadmap/${productNameRef.current}`);
      if (roadmapRes.ok) {
        const roadmap = (await roadmapRes.json()).data;
        setData(prev => ({ ...prev, roadmap }));
      }
    } catch (error) {
      console.error('Failed to reload roadmap:', error);
    }
  };

  const reloadTripwire = async () => {
    try {
      const tripwireRes = await fetch(`${API_BASE}/api/tripwire/${productNameRef.current}/course`);
      if (tripwireRes.ok) {
        const tripwire = (await tripwireRes.json()).data;
        setData(prev => ({ ...prev, tripwire }));
      }
    } catch (error) {
      console.error('Failed to reload tripwire:', error);
    }
  };

  useEffect(() => {
    productNameRef.current = productName;
  }, [productName]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const loadedData = await loadData(productName);
      setData({ ...loadedData, productName, setProductName: setProductNameSafe, reloadRoadmap, reloadTripwire });
      setLoading(false);
    };

    fetchData();
  }, [productName]);

  // WebSocket for real-time updates
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connected for business data updates');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'file_update' && message.productName === productNameRef.current) {
            const key = filenameToKey[message.filename];
            if (key) {
              console.log(`Updating ${key} from WebSocket for ${message.productName}`);
              const processedData = processObjectDocLinks(message.data);

              setData(prev => {
                // Special handling for policy-charter to merge goals
                if (key === 'policyCharter') {
                  const merged = mergeGoalsIntoPolicyCharter(prev.architecturalScope, processedData);
                  return { ...prev, [key]: merged };
                }
                // If architectural-scope changed, also re-merge policy-charter
                if (key === 'architecturalScope' && prev.policyCharter) {
                  const mergedPolicyCharter = mergeGoalsIntoPolicyCharter(processedData, prev.policyCharter);
                  return { ...prev, [key]: processedData, policyCharter: mergedPolicyCharter };
                }
                return { ...prev, [key]: processedData };
              });
            }
          }
          // Handle tripwire updates
          if (message.type === 'tripwire_update' && message.productName === productNameRef.current) {
            console.log(`Tripwire update from WebSocket: ${message.filename}`);
            // Reload full tripwire data for simplicity (could be optimized for specific updates)
            reloadTripwire();
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected, reconnecting in 3s...');
        reconnectTimeout = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (ws) {
        ws.close();
      }
    };
  }, []);

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