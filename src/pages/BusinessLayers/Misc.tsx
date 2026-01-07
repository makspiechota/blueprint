import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import MDEditor from '@uiw/react-md-editor';
import { useBusinessData } from '../../context/BusinessDataContext';
import { aiService } from '../../services/aiService';
import ChatButton from '../../components/ChatButton';
import { useChat } from '../../context/ChatContext';

const API_BASE = 'http://localhost:3001';

interface MiscFile {
  name: string;
  path: string;
}

const Misc: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { productName: urlProductName } = useParams<{ productName: string }>();
  const { setProductName } = useBusinessData();
  const { openChat } = useChat();
  const safeProductName = urlProductName || 'blueprint';

  // Sync URL productName with context
  useEffect(() => {
    if (urlProductName) setProductName?.(urlProductName);
  }, [urlProductName, setProductName]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [miscFiles, setMiscFiles] = useState<MiscFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewDoc, setShowNewDoc] = useState<boolean>(false);
  const [newDocName, setNewDocName] = useState<string>('');
  const [newDocIdea, setNewDocIdea] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);

  // Detect dark mode from .dark class on html/body
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();

    // Watch for class changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Fetch list of misc files from backend
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/misc/${safeProductName}`);
      if (!response.ok) throw new Error('Failed to fetch files');
      const data = await response.json();
      setMiscFiles(data.files);
      setError(null);
    } catch (err) {
      setError('Failed to load files. Is the backend running?');
      console.error('Error fetching misc files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [safeProductName]);

  // Fetch file content from backend
  const handleFileClick = async (fileName: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/misc/${safeProductName}/${encodeURIComponent(fileName)}`);
      if (!response.ok) throw new Error('Failed to fetch file');
      const data = await response.json();
      setSelectedFile(fileName);
      setContent(data.content);
      setError(null);
    } catch (err) {
      setError('Failed to load file content');
      console.error('Error fetching file:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save file content to backend
  const handleSave = async () => {
    if (!selectedFile) return;
    try {
      setSaving(true);
      const isExisting = miscFiles.some(f => f.name === selectedFile);
      const response = await fetch(`${API_BASE}/api/misc/${safeProductName}/${encodeURIComponent(selectedFile)}`, {
        method: isExisting ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('Failed to save file');
      setEditMode(false);
      setError(null);
      fetchFiles(); // Refresh file list
    } catch (err) {
      setError('Failed to save file');
      console.error('Error saving file:', err);
    } finally {
      setSaving(false);
    }
  };

  // Generate new document
  const handleGenerate = async () => {
    if (!newDocName.trim() || !newDocIdea.trim()) return;
    try {
      setGenerating(true);
      const result = await aiService.generateMisc(newDocIdea, safeProductName);
      if (result.success) {
        setContent(result.content);
        setSelectedFile(`${newDocName}.md`);
        setEditMode(true);
        setShowNewDoc(false);
        setNewDocName('');
        setNewDocIdea('');
        setError(null);
      } else {
        setError('Failed to generate document: ' + result.message);
      }
    } catch (err) {
      setError('Failed to generate document');
      console.error('Error generating document:', err);
    } finally {
      setGenerating(false);
    }
  };

  // Handle chat click for misc documents
  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  // Handle URL parameter for direct file access
  useEffect(() => {
    const file = searchParams.get('file');
    if (file && miscFiles.some(f => f.name === file)) {
      handleFileClick(file);
    }
  }, [searchParams, miscFiles]);

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Misc Documents</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {!selectedFile ? (
        // File list view
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Files</h2>
            <button
              onClick={() => setShowNewDoc(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create New Document
            </button>
          </div>
          {showNewDoc && (
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Create New Document</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Document Name</label>
                  <input
                    type="text"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="e.g., project-plan"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Document Idea</label>
                  <textarea
                    value={newDocIdea}
                    onChange={(e) => setNewDocIdea(e.target.value)}
                    placeholder="Describe what the document should be about..."
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerate}
                    disabled={generating || !newDocName.trim() || !newDocIdea.trim()}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                  >
                    {generating ? 'Generating...' : 'Generate with AI'}
                  </button>
                  <button
                    onClick={() => setShowNewDoc(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading files...</p>
          ) : miscFiles.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No files found</p>
          ) : (
            <ul className="space-y-2">
              {miscFiles.map((file) => (
                <li key={file.name}>
                  <button
                    onClick={() => handleFileClick(file.name)}
                    className="w-full text-left p-3 rounded-lg border bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {file.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        // Editor/Viewer view - full width
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setEditMode(false);
                }}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold dark:text-white">{selectedFile}</h2>
            </div>
             <div className="flex items-center gap-2">
               {editMode && (
                 <button
                   onClick={handleSave}
                   disabled={saving}
                   className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                 >
                   {saving ? 'Saving...' : 'Save'}
                 </button>
               )}
               <ChatButton
                 resourceType={`misc-${selectedFile?.replace('.md', '')}`}
                 resourceData={{ title: selectedFile || 'Misc Document', content }}
                 onClick={handleChatClick}
                 className="!relative !top-0 !right-0"
               />
               <button
                 onClick={() => setEditMode(!editMode)}
                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
               >
                 {editMode ? 'Cancel' : 'Edit'}
               </button>
             </div>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 overflow-auto">
            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading content...</p>
            ) : editMode ? (
              <div data-color-mode={isDarkMode ? 'dark' : 'light'} className="h-full">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  preview="edit"
                  height={500}
                  className="!bg-transparent"
                />
              </div>
            ) : (
               <div className="prose prose-sm max-w-none">
                 <ReactMarkdown>{content}</ReactMarkdown>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Misc;