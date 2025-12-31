import { useParams } from 'react-router';
import { useEffect } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import CustomersFactoryVisualizer from "../../components/CustomersFactoryVisualizer";
import LayerWrapper from "../../components/LayerWrapper";

export default function CustomersFactory() {
  const { productName: urlProductName } = useParams<{ productName: string }>();
  const { aaarrMetrics, setProductName, productName, leanViability, leanCanvas } = useBusinessData();

  useEffect(() => {
    if (urlProductName) setProductName?.(urlProductName);
  }, [urlProductName, setProductName]);

  return (
    <>
      <PageMeta
        title="Customers Factory | Business Blueprint Dashboard"
        description="Customers Factory business layer visualization"
      />
      <LayerWrapper
        layerKey="aaarrMetrics"
        title="Customers Factory Not Found"
        description="The Customers Factory layer hasn't been created yet. Use AI to generate it based on your Lean Viability."
        resourceType="generate-customers-factory"
        dependencies={['leanViability']}
      >
        <CustomersFactoryVisualizer data={aaarrMetrics} leanViabilityData={leanViability} leanCanvasData={leanCanvas} productName={productName} />
      </LayerWrapper>
    </>
  );
}