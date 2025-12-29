import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

const API_BASE = 'http://localhost:3001';

interface C4File {
  name: string;
  content: string;
}

const C4Visualizer: React.FC = () => {
  const { productName } = useParams<{ productName: string }>();
  const [files, setFiles] = useState<C4File[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Syntax highlighting helper (basic)
  const highlightSyntax = (code: string) => {
    return code
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>') // comments
      .replace(/\b(specification|model|views|view|element|style|include|exclude|title|description)\b/g, '<span class="text-purple-600 dark:text-purple-400 font-semibold">$1</span>') // keywords
      .replace(/\b(actor|system|container|component|external)\b/g, '<span class="text-blue-600 dark:text-blue-400">$1</span>') // element types
      .replace(/("[^"]*")/g, '<span class="text-green-600 dark:text-green-400">$1</span>') // strings
      .replace(/(\{|\})/g, '<span class="text-yellow-600 dark:text-yellow-400">$1</span>') // braces
      .replace(/(->)/g, '<span class="text-red-500">$1</span>'); // arrows
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold dark:text-white">C4 Architecture Model</h1>
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
        </div>
        <div className="flex items-center gap-2">
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
        {/* Left: Code Editor */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700 min-h-0">
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

        {/* Right: Preview Panel */}
        <div className="w-1/2 flex flex-col min-h-0">
          <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Live Preview (LikeC4 Server)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Run: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">npx likec4 start ./backend/src/data/blueprint/c4 --port 4000</code>
              </span>
              <button
                onClick={() => window.open('http://localhost:4000', '_blank')}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Open in New Tab
              </button>
            </div>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 relative min-h-0">
            <iframe
              src="http://localhost:4000"
              className="absolute inset-0 w-full h-full border-0"
              title="LikeC4 Preview"
              onError={() => console.log('LikeC4 server not running')}
            />
            {/* Fallback message if iframe doesn't load */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 pointer-events-none opacity-0 hover:opacity-0" id="iframe-fallback">
              <div className="text-center p-8 pointer-events-auto">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  LikeC4 Server Not Running
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Start the LikeC4 dev server to see the live diagram preview:
                </p>
                <code className="block p-3 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 mb-4">
                  npx likec4 start ./backend/src/data/blueprint/c4 --port 4000
                </code>
                <div className="flex gap-2 justify-center">
                  <a
                    href="https://likec4.dev/playground/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Use Online Playground Instead
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C4Visualizer;
