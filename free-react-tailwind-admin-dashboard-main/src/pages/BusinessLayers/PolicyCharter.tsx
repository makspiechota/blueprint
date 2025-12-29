import { useParams } from 'react-router';
import { useEffect } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import PolicyCharterVisualizer from "../../components/PolicyCharterVisualizer";
import LayerWrapper from "../../components/LayerWrapper";

export default function PolicyCharter() {
  const { productName: urlProductName } = useParams<{ productName: string }>();
  const { policyCharter, setProductName, productName } = useBusinessData();

  useEffect(() => {
    if (urlProductName) setProductName?.(urlProductName);
  }, [urlProductName, setProductName]);

  return (
    <>
      <PageMeta
        title="Policy Charter | Business Blueprint Dashboard"
        description="Policy Charter business layer visualization"
      />
      <LayerWrapper
        layerKey="policyCharter"
        title="Policy Charter Not Found"
        description="The Policy Charter layer hasn't been created yet. Use AI to generate it based on your Customers Factory."
        resourceType="generate-policy-charter"
        dependencies={['aaarrMetrics']}
      >
        <PolicyCharterVisualizer charter={policyCharter} />
      </LayerWrapper>
    </>
  );
}