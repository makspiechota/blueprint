import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import { useChat } from '../context/ChatContext';
import { ChatIcon } from '../icons';
import DownloadButton from './DownloadButton';

// Import LikeC4 diagram components with model provider
import { LikeC4Diagram, LikeC4ModelProvider } from '@likec4/diagram';
import { LikeC4Model } from '@likec4/core/model';
import { createRoot } from 'react-dom/client';

// @ts-ignore - CSS import for shadow DOM injection
import likec4Styles from '@likec4/diagram/styles.css?inline';

// WeakMap to track roots by container element - persists across React Strict Mode remounts
const rootsMap = new WeakMap<HTMLElement, ReturnType<typeof createRoot>>();

// Shadow DOM wrapper to isolate LikeC4 styles from the rest of the app
interface ShadowDiagramProps {
  view: any;
  layoutedModel: any;
  onNavigateTo: (viewId: string) => void;
}

const ShadowDiagram: React.FC<ShadowDiagramProps> = ({ view, layoutedModel, onNavigateTo }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountPointRef = useRef<HTMLDivElement | null>(null);

  // Initialize shadow DOM and render
  useEffect(() => {
    if (!containerRef.current || !view || !layoutedModel) return;

    // Create shadow root if it doesn't exist
    let shadowRoot = containerRef.current.shadowRoot;
    if (!shadowRoot) {
      shadowRoot = containerRef.current.attachShadow({ mode: 'open' });

      // Inject styles into shadow DOM
      const styleEl = document.createElement('style');
      styleEl.textContent = likec4Styles;
      shadowRoot.appendChild(styleEl);

      // Create mount point
      const mountPoint = document.createElement('div');
      mountPoint.style.width = '100%';
      mountPoint.style.height = '100%';
      shadowRoot.appendChild(mountPoint);
      mountPointRef.current = mountPoint;
    } else {
      // Shadow root exists, find the mount point
      const existingMountPoint = shadowRoot.querySelector('div');
      if (existingMountPoint) {
        mountPointRef.current = existingMountPoint as HTMLDivElement;
      }
    }

    if (!mountPointRef.current) return;

    // Get or create root using WeakMap to avoid duplicate createRoot calls
    let root = rootsMap.get(mountPointRef.current);
    if (!root) {
      root = createRoot(mountPointRef.current);
      rootsMap.set(mountPointRef.current, root);
    }

    // Render the diagram with model provider
    root.render(
      <LikeC4ModelProvider likec4model={layoutedModel}>
        <LikeC4Diagram
          view={view}
          pannable
          zoomable
          controls
          fitView
          onNavigateTo={onNavigateTo}
        />
      </LikeC4ModelProvider>
    );

    return () => {
      // Don't unmount - let WeakMap manage it
    };
  }, [view, layoutedModel, onNavigateTo]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

const API_BASE = 'http://localhost:3001';
const WS_URL = 'ws://localhost:8080';

interface C4File {
  name: string;
  content: string;
}

interface ViewInfo {
  id: string;
  title: string;
  description?: string;
}

const C4Visualizer: React.FC = () => {
  const { productName } = useParams<{ productName: string }>();
  const { openChat } = useChat();
  const [files, setFiles] = useState<C4File[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // LikeC4 views state
  const [viewsData, setViewsData] = useState<Record<string, any>>({});
  const [modelData, setModelData] = useState<any>(null);
  const [viewsList, setViewsList] = useState<ViewInfo[]>([]);
  const [selectedViewId, setSelectedViewId] = useState<string>('index');
  const [modelError, setModelError] = useState<string | null>(null);
  const [modelLoading, setModelLoading] = useState(false);

  // Create the layouted model from model data
  const layoutedModel = useMemo(() => {
    if (!modelData) return null;
    try {
      return LikeC4Model.create(modelData);
    } catch (err) {
      console.error('Error creating layouted model:', err);
      return null;
    }
  }, [modelData]);

  const handleChatClick = () => {
    const safeProductName = productName || 'blueprint';
    openChat(`c4-model:${selectedFile}`, {
      productName: safeProductName,
      fileName: selectedFile,
      content: editedContent
    });
  };

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Toggle body class for hiding header
  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add('c4-fullscreen');
    } else {
      document.body.classList.remove('c4-fullscreen');
    }
    return () => document.body.classList.remove('c4-fullscreen');
  }, [isFullscreen]);

  // Fetch layouted views from backend
  const fetchModel = useCallback(async () => {
    const safeProductName = productName || 'blueprint';
    try {
      setModelLoading(true);
      setModelError(null);

      const response = await fetch(`${API_BASE}/api/c4-model/${safeProductName}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch C4 model');
      }

      const data = await response.json();
      if (data.success && data.modelData) {
        // Store views data for rendering
        setViewsData(data.modelData.views || {});

        // Store the full model $data for LikeC4Model.create()
        setModelData(data.modelData);

        // Extract views list for the selector
        const views = data.modelData.views || {};
        const list = Object.entries(views).map(([id, view]: [string, any]) => ({
          id,
          title: view.title || id,
          description: view.description
        }));
        setViewsList(list);

        // Select first view if current selection is invalid
        if (list.length > 0 && !list.find(v => v.id === selectedViewId)) {
          setSelectedViewId(list[0].id);
        }

        if (data.errors && data.errors.length > 0) {
          console.warn('C4 model has validation warnings:', data.errors);
        }
      }
    } catch (err) {
      console.error('Error fetching C4 model:', err);
      setModelError(err instanceof Error ? err.message : 'Failed to load C4 model');
    } finally {
      setModelLoading(false);
    }
  }, [productName, selectedViewId]);

  // Fetch list of C4 files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/c4/${productName || 'blueprint'}`);
        if (!response.ok) throw new Error('Failed to fetch C4 files');
        const data = await response.json();
        setFiles(data.files || []);

        // Auto-select first file
        if (data.files && data.files.length > 0) {
          handleFileSelect(data.files[0].name);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load C4 files. Is the backend running?');
        console.error('Error fetching C4 files:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [productName]);

  // Fetch model when product changes
  useEffect(() => {
    fetchModel();
  }, [fetchModel]);

  // Refs for WebSocket to avoid stale closures
  const selectedFileRef = useRef(selectedFile);
  const isEditingRef = useRef(isEditing);

  useEffect(() => {
    selectedFileRef.current = selectedFile;
  }, [selectedFile]);

  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  // WebSocket for real-time updates
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    const currentProductName = productName || 'blueprint';

    const connect = () => {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connected for C4 updates');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          // Handle C4 file updates
          if (message.type === 'c4_update' && message.productName === currentProductName) {
            console.log(`C4 file ${message.filename} updated via WebSocket`);

            // Update the files list
            setFiles(prev => {
              const exists = prev.some(f => f.name === message.filename);
              if (exists) {
                return prev.map(f =>
                  f.name === message.filename ? { ...f, content: message.content } : f
                );
              } else {
                return [...prev, { name: message.filename, content: message.content }];
              }
            });

            // Update content if this is the selected file and user is not editing
            if (selectedFileRef.current === message.filename && !isEditingRef.current) {
              setContent(message.content);
              setEditedContent(message.content);
            }

            // Refresh the layouted model
            fetchModel();
          }

          // Handle C4 file deletions
          if (message.type === 'c4_delete' && message.productName === currentProductName) {
            console.log(`C4 file ${message.filename} deleted via WebSocket`);
            setFiles(prev => prev.filter(f => f.name !== message.filename));

            // If deleted file was selected, clear selection
            if (selectedFileRef.current === message.filename) {
              setSelectedFile(null);
              setContent('');
              setEditedContent('');
            }

            // Refresh the layouted model
            fetchModel();
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected, reconnecting in 3s...');
        reconnectTimeout = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (ws) {
        ws.close();
      }
    };
  }, [productName, fetchModel]);

  const handleFileSelect = async (fileName: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/c4/${productName || 'blueprint'}/${encodeURIComponent(fileName)}`);
      if (!response.ok) throw new Error('Failed to fetch file');
      const data = await response.json();
      setSelectedFile(fileName);
      setContent(data.content);
      setEditedContent(data.content);
      setError(null);
    } catch (err) {
      setError('Failed to load file content');
      console.error('Error fetching file:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE}/api/c4/${productName || 'blueprint'}/${encodeURIComponent(selectedFile)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedContent }),
      });
      if (!response.ok) throw new Error('Failed to save file');
      setContent(editedContent);
      setIsEditing(false);
      setError(null);

      // Refresh the model after saving
      await fetchModel();
    } catch (err) {
      setError('Failed to save file');
      console.error('Error saving file:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex flex-col bg-white dark:bg-gray-900 ${
        isFullscreen
          ? 'fixed inset-0 z-50'
          : ''
      }`}
      style={{ height: isFullscreen ? '100vh' : 'calc(100vh - 140px)' }}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold dark:text-white">AI-Generated Architecture based on the BLUEPRINT's higher layers</h1>
          <DownloadButton data={{ content }} filename={`c4-${selectedFile || 'diagram'}-${productName}.yaml`} />
          {files.length > 1 && (
            <select
              value={selectedFile || ''}
              onChange={(e) => handleFileSelect(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
            >
              {files.map((file) => (
                <option key={file.name} value={file.name}>
                  {file.name}
                </option>
              ))}
            </select>
          )}
          {viewsList.length > 0 && (
            <select
              value={selectedViewId}
              onChange={(e) => setSelectedViewId(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
            >
              {viewsList.map((view) => (
                <option key={view.id} value={view.id}>
                  {view.title}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleChatClick}
            disabled={!selectedFile}
            className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            title="Chat with AI about C4 model"
          >
            <ChatIcon />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
          {editedContent !== content && (
            <>
              <span className="text-sm text-orange-500">Unsaved changes</span>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-400"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex-shrink-0 m-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: Code Editor - Hidden for now */}
        <div className="w-0 flex flex-col border-r border-gray-200 dark:border-gray-700 min-h-0 overflow-hidden">
          <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {selectedFile || 'No file selected'} - LikeC4 DSL
            </span>
          </div>
          <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 min-h-0">
            {loading ? (
              <div className="p-4 text-gray-500 dark:text-gray-400">Loading...</div>
            ) : (
              <textarea
                value={editedContent}
                onChange={(e) => {
                  setEditedContent(e.target.value);
                  if (!isEditing) setIsEditing(true);
                }}
                className="w-full h-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 dark:text-gray-100 resize-none focus:outline-none"
                spellCheck={false}
                placeholder="Enter LikeC4 DSL code..."
              />
            )}
          </div>
        </div>

        {/* Right: LikeC4 Diagram Panel */}
        <div className="w-full flex flex-col min-h-0">
          <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Architecture Diagrams {selectedViewId && `- ${viewsList.find(v => v.id === selectedViewId)?.title || selectedViewId}`}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchModel()}
                disabled={modelLoading}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {modelLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 relative min-h-0 overflow-hidden">
            {modelLoading && Object.keys(viewsData).length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading C4 model...</p>
                </div>
              </div>
            ) : modelError ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Failed to Load C4 Model
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {modelError}
                  </p>
                  <button
                    onClick={() => fetchModel()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : layoutedModel && viewsData[selectedViewId] ? (
               <div className="absolute inset-0">
                 <ShadowDiagram
                   view={viewsData[selectedViewId]}
                   layoutedModel={layoutedModel}
                   onNavigateTo={(viewId: string) => {
                     if (viewsData[viewId]) {
                       setSelectedViewId(viewId);
                     }
                   }}
                 />
               </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No C4 Model Found
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Create a .likec4 file in the {productName || 'blueprint'}/c4 directory to get started.
                  </p>
                  <a
                    href="https://likec4.dev/docs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm inline-block"
                  >
                    View LikeC4 Documentation
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default C4Visualizer;
