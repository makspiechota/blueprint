import React, { createContext, useContext, useEffect, useState } from 'react';

interface BusinessData {
  northStar?: any;
  leanCanvas?: any;
  architecturalScope?: any;
  leanViability?: any;
  aaarrMetrics?: any;
  policyCharter?: any;
}

const BusinessDataContext = createContext<BusinessData>({
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

const loadData = async () => {
  try {
    const [northStarRes, leanCanvasRes, architecturalScopeRes, leanViabilityRes, aaarrMetricsRes, policyCharterRes] = await Promise.all([
      fetch('/api/yaml/north-star.yaml'),
      fetch('/api/yaml/lean-canvas.yaml'),
      fetch('/api/yaml/architectural-scope.yaml'),
      fetch('/api/yaml/lean-viability.yaml'),
      fetch('/api/yaml/aaarr-metrics.yaml'),
      fetch('/api/yaml/policy-charter.yaml'),
    ]);

    const northStar = northStarRes.ok ? (await northStarRes.json()).data : null;
    const leanCanvas = leanCanvasRes.ok ? (await leanCanvasRes.json()).data : null;
    const architecturalScope = architecturalScopeRes.ok ? (await architecturalScopeRes.json()).data : null;
    const leanViability = leanViabilityRes.ok ? (await leanViabilityRes.json()).data : null;
    const aaarrMetrics = aaarrMetricsRes.ok ? (await aaarrMetricsRes.json()).data : null;
    const policyCharter = policyCharterRes.ok ? (await policyCharterRes.json()).data : null;

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
      const loadedData = await loadData();
      setData(loadedData);
      setLoading(false);
    };

    fetchData();

    // WebSocket connection for real-time updates
    const ws = new WebSocket('ws://localhost:8080');

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
              [dataKey]: updatedData
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