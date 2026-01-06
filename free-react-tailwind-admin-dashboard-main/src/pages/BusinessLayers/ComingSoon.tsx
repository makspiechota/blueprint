import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";

export default function ComingSoon() {
  const { productName: urlProductName } = useParams<{ productName: string }>();
  const { setProductName, productName } = useBusinessData();
  const navigate = useNavigate();

  useEffect(() => {
    if (urlProductName) setProductName?.(urlProductName);
  }, [urlProductName, setProductName]);

  const handleSeeRoadmap = () => {
    if (productName !== 'blueprint') {
      const confirmed = window.confirm('You are about to switch to BLUEPRINT product. Continue?');
      if (!confirmed) return;
    }
    navigate('/blueprint/roadmap');
  };

  return (
    <>
      <PageMeta
        title="Coming Soon | Business Blueprint Dashboard"
        description="This feature is coming soon"
      />
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Coming Soon.
        </h1>
        <button
          onClick={handleSeeRoadmap}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          See Roadmap
        </button>
      </div>
    </>
  );
}