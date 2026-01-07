import React, { createContext, useContext, useEffect, useState } from 'react';
import { processDocLinks } from '../utils/docLinkProcessor';
import yaml from 'js-yaml';

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
    const [northStarRes, leanCanvasRes, architecturalScopeRes, leanViabilityRes, aaarrMetricsRes, policyCharterRes, roadmapRes] = await Promise.all([
      fetch(`/data/${productName}/north-star.yaml`),
      fetch(`/data/${productName}/lean-canvas.yaml`),
      fetch(`/data/${productName}/architectural-scope.yaml`),
      fetch(`/data/${productName}/lean-viability.yaml`),
      fetch(`/data/${productName}/aaarr-metrics.yaml`),
      fetch(`/data/${productName}/policy-charter.yaml`),
      fetch(`/data/${productName}/roadmap.json`),
    ]);

    const northStar = northStarRes.ok ? processObjectDocLinks(yaml.load(await northStarRes.text())) : null;
    const leanCanvas = leanCanvasRes.ok ? processObjectDocLinks(yaml.load(await leanCanvasRes.text())) : null;
    const architecturalScope = architecturalScopeRes.ok ? processObjectDocLinks(yaml.load(await architecturalScopeRes.text())) : null;
    const leanViability = leanViabilityRes.ok ? processObjectDocLinks(yaml.load(await leanViabilityRes.text())) : null;
    const aaarrMetrics = aaarrMetricsRes.ok ? processObjectDocLinks(yaml.load(await aaarrMetricsRes.text())) : null;
    const policyCharterRaw = policyCharterRes.ok ? processObjectDocLinks(yaml.load(await policyCharterRes.text())) : null;
    const roadmap = roadmapRes.ok ? (await roadmapRes.json()).data : null;

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
    };
  } catch (error) {
    console.error('Failed to load data from static files:', error);
    return {
      northStar: null,
      leanCanvas: null,
      architecturalScope: null,
      leanViability: null,
      aaarrMetrics: null,
      policyCharter: null,
      roadmap: null,
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
    roadmap: null,
  });
  const [loading, setLoading] = useState(true);

  const setProductNameSafe = (name: string) => {
    // Allow any product name
    setProductName(name);
  };





  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const loadedData = await loadData(productName);
      setData({ ...loadedData, productName, setProductName: setProductNameSafe });
      setLoading(false);
    };

    fetchData();
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