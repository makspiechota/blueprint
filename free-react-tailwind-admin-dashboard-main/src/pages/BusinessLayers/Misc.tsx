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

  // Hardcoded file contents
  const fileContents: Record<string, string> = {
    'project-notes.md': `# Project Notes

This document contains miscellaneous notes for the project.

## TODO
- Implement user authentication
- Add dark mode toggle
- Optimize performance

## Ideas
- Add export functionality
- Integrate with third-party APIs`,
    'development-guidelines.md': `# Development Guidelines

## Code Style
- Use TypeScript for all new code
- Follow ESLint rules
- Write descriptive commit messages

## Testing
- Unit tests required for new features
- Integration tests for critical paths`
  };

  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
    setContent(fileContents[fileName] || 'File not found');
  };

  useEffect(() => {
    const file = searchParams.get('file');
    if (file && miscFiles.includes(file)) {
      handleFileClick(file);
    }
  }, [searchParams]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Misc Documents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Files</h2>
          <ul className="space-y-2">
            {miscFiles.map((file) => (
              <li key={file}>
                <button
                  onClick={() => handleFileClick(file)}
                  className={`w-full text-left p-3 rounded-lg border ${
                    selectedFile === file
                      ? 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700 dark:text-white'
                      : 'bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'
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
            <h2 className="text-lg font-semibold dark:text-white">Content</h2>
            {selectedFile && (
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editMode ? 'View' : 'Edit'}
              </button>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[400px]">
            {selectedFile ? (
              editMode ? (
                // @ts-expect-error
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  preview="edit"
                />
              ) : (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
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