import { useParams } from 'react-router';
import { useEffect } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import NorthStarVisualizer from "../../components/NorthStarVisualizer";
import LayerWrapper from "../../components/LayerWrapper";

export default function NorthStar() {
  const { productName: urlProductName } = useParams<{ productName: string }>();
  const { northStar, setProductName, productName } = useBusinessData();

  useEffect(() => {
    if (urlProductName) setProductName?.(urlProductName);
  }, [urlProductName, setProductName]);

  return (
    <>
      <PageMeta
        title="North Star | Business Blueprint Dashboard"
        description="North Star business layer visualization"
      />
      <LayerWrapper
        layerKey="northStar"
        title="North Star Not Found"
        description="The North Star layer hasn't been created yet. Use AI to generate it."
        resourceType="generate-north-star"
        dependencies={[]}
      >
        <NorthStarVisualizer data={northStar} productName={productName} />
      </LayerWrapper>
    </>
  );
}