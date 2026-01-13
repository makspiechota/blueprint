import { useParams, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import CourseVisualizer from "../../components/CourseVisualizer";
import ModuleVisualizer from "../../components/ModuleVisualizer";
import ContentEditor from "../../components/ContentEditor";

const API_BASE = 'http://localhost:3001';

export default function Tripwire() {
  const { productName: urlProductName } = useParams<{ productName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const safeProductName = urlProductName || 'blueprint';
  const { tripwire, setProductName, reloadTripwire } = useBusinessData();

  // Navigation state from URL params
  const moduleId = searchParams.get('module');
  const contentType = searchParams.get('type') as 'lectures' | 'prompts' | 'templates' | null;
  const contentId = searchParams.get('content');

  // Module data for drill-down
  const [moduleData, setModuleData] = useState<any>(null);
  const [contentData, setContentData] = useState<{ id: string; content: string; type: string; moduleId: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProductName?.(safeProductName);
  }, [safeProductName, setProductName]);

  // Load module data when moduleId changes
  useEffect(() => {
    if (moduleId && !contentId) {
      setLoading(true);
      fetch(`${API_BASE}/api/tripwire/${safeProductName}/modules/${moduleId}`)
        .then(res => res.json())
        .then(data => {
          setModuleData(data.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load module:', err);
          setLoading(false);
        });
    } else if (!moduleId) {
      setModuleData(null);
    }
  }, [moduleId, safeProductName, contentId]);

  // Load content data when contentId changes
  useEffect(() => {
    if (moduleId && contentType && contentId) {
      setLoading(true);
      fetch(`${API_BASE}/api/tripwire/${safeProductName}/modules/${moduleId}/${contentType}/${contentId}`)
        .then(res => res.json())
        .then(data => {
          setContentData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load content:', err);
          setLoading(false);
        });
    } else if (!contentId) {
      setContentData(null);
    }
  }, [moduleId, contentType, contentId, safeProductName]);

  // Navigation handlers
  const handleModuleClick = (id: string) => {
    setSearchParams({ module: id });
  };

  const handleContentClick = (type: string, id: string) => {
    if (moduleId) {
      setSearchParams({ module: moduleId, type, content: id });
    }
  };

  const handleBackToCourse = () => {
    setSearchParams({});
    setModuleData(null);
    setContentData(null);
  };

  const handleBackToModule = () => {
    if (moduleId) {
      setSearchParams({ module: moduleId });
      setContentData(null);
    }
  };

  const handleSaveContent = async (newContent: string): Promise<boolean> => {
    if (!moduleId || !contentType || !contentId) return false;

    try {
      const response = await fetch(
        `${API_BASE}/api/tripwire/${safeProductName}/modules/${moduleId}/${contentType}/${contentId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newContent }),
        }
      );

      if (response.ok) {
        setContentData(prev => prev ? { ...prev, content: newContent } : null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save content:', error);
      return false;
    }
  };

  // Determine what to render based on navigation state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      );
    }

    // Content editor view
    if (contentId && contentData && moduleId && contentType) {
      return (
        <ContentEditor
          content={contentData.content}
          contentId={contentId}
          contentType={contentType}
          moduleName={moduleData?.name || moduleId}
          onBack={handleBackToModule}
          onSave={handleSaveContent}
        />
      );
    }

    // Module detail view
    if (moduleId && moduleData) {
      return (
        <ModuleVisualizer
          data={moduleData}
          onBack={handleBackToCourse}
          onContentClick={handleContentClick}
        />
      );
    }

    // Course overview (default)
    if (!tripwire) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Course Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The Tripwire course hasn't been created yet for this product.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Create a course.yaml file in the tripwire directory to get started.
          </p>
        </div>
      );
    }

    return (
      <CourseVisualizer
        data={tripwire}
        productName={safeProductName}
        onModuleClick={handleModuleClick}
      />
    );
  };

  return (
    <>
      <PageMeta
        title="Tripwire Course | Software Layers"
        description="Educational content layer for course management"
      />
      <div className="p-6">
        {renderContent()}
      </div>
    </>
  );
}
