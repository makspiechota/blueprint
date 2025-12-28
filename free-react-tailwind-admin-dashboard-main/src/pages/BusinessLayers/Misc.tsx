import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import MDEditor from '@uiw/react-md-editor';

const Misc: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  // Hardcoded list of misc files
  const miscFiles = ['project-notes.md', 'development-guidelines.md'];

  const handleFileClick = async (fileName: string) => {
    setSelectedFile(fileName);
    try {
      const response = await fetch(`/misc/${fileName}`);
      if (response.ok) {
        const text = await response.text();
        setContent(text);
      } else {
        setContent('Error loading file');
      }
    } catch (error) {
      console.error('Error loading file:', error);
      setContent('Error loading file');
    }
  };

  useEffect(() => {
    const file = searchParams.get('file');
    if (file && miscFiles.includes(file)) {
      handleFileClick(file);
    }
  }, [searchParams, miscFiles]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Misc Documents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Files</h2>
          <ul className="space-y-2">
            {miscFiles.map((file) => (
              <li key={file}>
                <button
                  onClick={() => handleFileClick(file)}
                  className={`w-full text-left p-3 rounded-lg border ${
                    selectedFile === file
                      ? 'bg-blue-100 border-blue-300'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {file}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Content</h2>
            {selectedFile && (
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editMode ? 'View' : 'Edit'}
              </button>
            )}
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-4 min-h-[400px]">
            {selectedFile ? (
              editMode ? (
                // @ts-expect-error
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  preview="edit"
                />
              ) : (
                // @ts-expect-error
                <ReactMarkdown>{content}</ReactMarkdown>
              )
            ) : (
              <p className="text-gray-500">Select a file to view</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Misc;