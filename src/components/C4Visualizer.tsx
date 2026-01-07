import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import { useChat } from '../context/ChatContext';
import { ChatIcon } from '../icons';
import DownloadButton from './DownloadButton';

// Import LikeC4 bundled components with isolated styles
import { LikeC4View, LikeC4ModelProvider } from '@likec4/diagram/bundle';
import { LikeC4Model } from '@likec4/core/model';



const C4Visualizer: React.FC = () => {
  const { productName } = useParams<{ productName: string }>();
  const { openChat } = useChat();
  const [dslContent, setDslContent] = useState<string>('');
  const [modelData, setModelData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedViewId, setSelectedViewId] = useState<string>('index');

  // Create the LikeC4 model from the loaded data
  const likec4Model = useMemo(() => {
    if (!modelData) return null;
    try {
      return LikeC4Model.create(modelData);
    } catch (err) {
      console.error('Error creating LikeC4 model:', err);
      return null;
    }
  }, [modelData]);

  // Get available views
  const availableViews = useMemo(() => {
    if (!modelData?.views) return [];
    return Object.entries(modelData.views).map(([id, view]: [string, any]) => ({
      id,
      title: view.title || id,
      description: view.description
    }));
  }, [modelData]);

  // Load pre-processed C4 model and DSL content
  const loadC4Data = useCallback(async () => {
    const safeProductName = productName || 'blueprint';
    try {
      setLoading(true);
      setError(null);

      // Load the DSL content (try multiple possible filenames)
      const possibleFiles = [`${safeProductName}.likec4`, 'blueprint.likec4', 'software-factory.likec4'];
      let dslContentLoaded = false;

      for (const filename of possibleFiles) {
        try {
          const dslResponse = await fetch(`/data/${safeProductName}/c4/${filename}`);
          if (dslResponse.ok) {
            const content = await dslResponse.text();
            setDslContent(content);
            dslContentLoaded = true;
            break;
          }
        } catch (e) {
          // Continue to next file
        }
      }

      if (!dslContentLoaded) {
        console.warn('No DSL content file found');
      }

      // Load the pre-processed layouted model
      const modelResponse = await fetch(`/data/${safeProductName}/c4/layouted-model.json`);
      if (modelResponse.ok) {
        const model = await modelResponse.json();
        setModelData(model);
      } else {
        console.warn('Pre-processed C4 model not found, diagram will not render');
      }

    } catch (err) {
      console.error('Error loading C4 data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load C4 data');
    } finally {
      setLoading(false);
    }
  }, [productName]);

  // Load C4 data on mount and when product changes
  useEffect(() => {
    loadC4Data();
  }, [loadC4Data]);

  const handleChatClick = () => {
    const safeProductName = productName || 'blueprint';
    openChat('c4-model', {
      productName: safeProductName,
      fileName: 'blueprint.likec4',
      content: dslContent
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading C4 Architecture...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error loading C4 Architecture</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            C4 Architecture - {productName || 'Blueprint'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Interactive system architecture diagrams
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleChatClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ChatIcon className="w-4 h-4" />
            Chat with AI
          </button>
          <DownloadButton
            data={dslContent}
            filename={`c4-${productName || 'blueprint'}.likec4`}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Architecture Diagram
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interactive C4 architecture visualization
              </p>
            </div>
            {availableViews.length > 1 && (
              <div className="flex items-center gap-2">
                <label htmlFor="view-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  View:
                </label>
                <select
                  id="view-select"
                  value={selectedViewId}
                  onChange={(e) => setSelectedViewId(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {availableViews.map((view) => (
                    <option key={view.id} value={view.id}>
                      {view.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          {likec4Model ? (
            <LikeC4ModelProvider likec4model={likec4Model}>
              <LikeC4View
                viewId={selectedViewId}
                className="w-full h-96 border rounded"
              />
            </LikeC4ModelProvider>
          ) : (
            <div className="w-full h-96 border rounded bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              <p className="text-gray-500">
                {modelData ? 'Rendering diagram...' : 'Loading diagram...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default C4Visualizer;