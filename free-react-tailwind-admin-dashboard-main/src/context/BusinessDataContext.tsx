import React, { createContext, useContext, useEffect, useState } from 'react';
import yaml from 'js-yaml';

// Import YAML files
import northStarYaml from '../data/north-star.yaml?raw';
import leanCanvasYaml from '../data/lean-canvas.yaml?raw';
import architecturalScopeYaml from '../data/architectural-scope.yaml?raw';
import leanViabilityYaml from '../data/lean-viability.yaml?raw';
import aaarrMetricsYaml from '../data/aaarr-metrics.yaml?raw';
import policyCharterYaml from '../data/policy-charter.yaml?raw';

interface BusinessData {
  northStar?: any;
  leanCanvas?: any;
  architecturalScope?: any;
  leanViability?: any;
  aaarrMetrics?: any;
  policyCharter?: any;
}

const BusinessDataContext = createContext<BusinessData | null>(null);

export const useBusinessData = () => {
  const context = useContext(BusinessDataContext);
  if (!context) {
    throw new Error('useBusinessData must be used within BusinessDataProvider');
  }
  return context;
};

const loadData = () => ({
  northStar: yaml.load(northStarYaml),
  leanCanvas: yaml.load(leanCanvasYaml),
  architecturalScope: yaml.load(architecturalScopeYaml),
  leanViability: yaml.load(leanViabilityYaml),
  aaarrMetrics: yaml.load(aaarrMetricsYaml),
  policyCharter: yaml.load(policyCharterYaml),
});

export const BusinessDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<BusinessData>(loadData);

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.accept('../data/north-star.yaml?raw', (newModule) => {
        if (newModule) {
          setData(prev => ({ ...prev, northStar: yaml.load(newModule.default) }));
        }
      });
      import.meta.hot.accept('../data/lean-canvas.yaml?raw', (newModule) => {
        if (newModule) {
          setData(prev => ({ ...prev, leanCanvas: yaml.load(newModule.default) }));
        }
      });
      import.meta.hot.accept('../data/architectural-scope.yaml?raw', (newModule) => {
        if (newModule) {
          setData(prev => ({ ...prev, architecturalScope: yaml.load(newModule.default) }));
        }
      });
      import.meta.hot.accept('../data/lean-viability.yaml?raw', (newModule) => {
        if (newModule) {
          setData(prev => ({ ...prev, leanViability: yaml.load(newModule.default) }));
        }
      });
      import.meta.hot.accept('../data/aaarr-metrics.yaml?raw', (newModule) => {
        if (newModule) {
          setData(prev => ({ ...prev, aaarrMetrics: yaml.load(newModule.default) }));
        }
      });
      import.meta.hot.accept('../data/policy-charter.yaml?raw', (newModule) => {
        if (newModule) {
          setData(prev => ({ ...prev, policyCharter: yaml.load(newModule.default) }));
        }
      });
    }
  }, []);

  return (
    <BusinessDataContext.Provider value={data}>
      {children}
    </BusinessDataContext.Provider>
  );
};