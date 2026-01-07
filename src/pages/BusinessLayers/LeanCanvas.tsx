import { useParams } from 'react-router';
import { useEffect } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import LeanCanvasVisualizer from "../../components/LeanCanvasVisualizer";
import LayerWrapper from "../../components/LayerWrapper";

export default function LeanCanvas() {
  const { productName: urlProductName } = useParams<{ productName: string }>();
  const { leanCanvas, setProductName, productName } = useBusinessData();

  useEffect(() => {
    if (urlProductName) setProductName?.(urlProductName);
  }, [urlProductName, setProductName]);

  return (
    <>
      <PageMeta
        title="Lean Canvas | Business Blueprint Dashboard"
        description="Lean Canvas business layer visualization"
      />
      <LayerWrapper
        layerKey="leanCanvas"
        title="Lean Canvas Not Found"
        description="The Lean Canvas layer hasn't been created yet. Use AI to generate it based on your North Star."
        resourceType="generate-lean-canvas"
        dependencies={['northStar']}
      >
        <LeanCanvasVisualizer canvas={leanCanvas} productName={productName} />
      </LayerWrapper>
    </>
  );
}