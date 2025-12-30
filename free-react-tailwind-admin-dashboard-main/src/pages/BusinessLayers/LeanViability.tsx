import { useParams } from 'react-router';
import { useEffect } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import LeanViabilityVisualizer from "../../components/LeanViabilityVisualizer";
import LayerWrapper from "../../components/LayerWrapper";

export default function LeanViability() {
  const { productName: urlProductName } = useParams<{ productName: string }>();
  const safeProductName = urlProductName || 'blueprint';
  const { leanViability, setProductName, leanCanvas } = useBusinessData();

  useEffect(() => {
    setProductName?.(safeProductName);
  }, [safeProductName, setProductName]);

  return (
    <>
      <PageMeta
        title="Lean Viability | Business Blueprint Dashboard"
        description="Lean Viability business layer visualization"
      />
      <LayerWrapper
        layerKey="leanViability"
        title="Lean Viability Not Found"
        description="The Lean Viability layer hasn't been created yet. Use AI to generate it based on your Architectural Scope."
        resourceType="generate-lean-viability"
        dependencies={['architecturalScope']}
      >
        <LeanViabilityVisualizer data={leanViability} leanCanvasData={leanCanvas} productName={safeProductName} />
      </LayerWrapper>
    </>
  );
}