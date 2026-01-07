import { useParams } from 'react-router';
import { useEffect } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import RoadmapVisualizer from "../../components/RoadmapVisualizer";
import LayerWrapper from "../../components/LayerWrapper";

export default function Roadmap() {
  const { productName: urlProductName } = useParams<{ productName: string }>();
  const { roadmap, setProductName, productName } = useBusinessData();

  useEffect(() => {
    if (urlProductName) setProductName?.(urlProductName);
  }, [urlProductName, setProductName]);

  return (
    <>
      <PageMeta
        title="Roadmap | Business Blueprint Dashboard"
        description="Product roadmap visualization"
      />
      <LayerWrapper
        layerKey="roadmap"
        title="Roadmap Not Found"
        description="The Roadmap layer hasn't been created yet. Use AI to generate it based on your North Star, Lean Canvas, and Policy Charter."
        resourceType="generate-roadmap"
        dependencies={['northStar', 'leanCanvas', 'policyCharter']}
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {roadmap?.title || 'Product Roadmap'}
            </h1>
            {roadmap?.description && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {roadmap.description}
              </p>
            )}
          </div>
          <RoadmapVisualizer data={roadmap} />
        </div>
      </LayerWrapper>
    </>
  );
}
