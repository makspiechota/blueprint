import { useParams } from 'react-router';
import { useEffect } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import RoadmapVisualizer from "../../components/RoadmapVisualizer";

export default function Roadmap() {
  const { productName: urlProductName } = useParams<{ productName: string }>();
  const safeProductName = urlProductName || 'blueprint';
  const { roadmap, setProductName } = useBusinessData();

  useEffect(() => {
    setProductName?.(safeProductName);
  }, [safeProductName, setProductName]);

  if (!roadmap) {
    return (
      <>
        <PageMeta
          title="Roadmap | Business Blueprint Dashboard"
          description="Product roadmap visualization"
        />
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Roadmap Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            No roadmap data found for this product. Create a roadmap directory structure with roadmap.yaml, epics, features, user stories, and tasks.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Roadmap | Business Blueprint Dashboard"
        description="Product roadmap visualization"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {roadmap.title || 'Product Roadmap'}
          </h1>
          {roadmap.description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {roadmap.description}
            </p>
          )}
        </div>
        <RoadmapVisualizer data={roadmap} />
      </div>
    </>
  );
}
