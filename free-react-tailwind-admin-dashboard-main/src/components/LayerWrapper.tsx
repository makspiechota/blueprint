import React from 'react';
import { useBusinessData } from '../context/BusinessDataContext';
import MissingLayer from './MissingLayer';

interface LayerWrapperProps {
  layerKey: string;
  title: string;
  description: string;
  resourceType: string;
  dependencies: string[];
  children: React.ReactNode;
}

const LayerWrapper: React.FC<LayerWrapperProps> = ({
  layerKey,
  title,
  description,
  resourceType,
  dependencies,
  children
}) => {
  const businessData = useBusinessData();
  const layerData = (businessData as any)[layerKey];
  const dependencyData = dependencies.reduce((acc, dep) => ({
    ...acc,
    [dep]: (businessData as any)[dep]
  }), {});
  const { productName } = businessData;

  if (!layerData || Object.keys(layerData).length === 0) {
    return (
      <MissingLayer
        title={title}
        description={description}
        resourceType={resourceType}
        resourceData={{ ...dependencyData, productName }}
      />
    );
  }

  return <>{children}</>;
};

export default LayerWrapper;