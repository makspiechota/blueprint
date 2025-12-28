import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import MDEditor from '@uiw/react-md-editor';

const Misc: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

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
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Misc Documents</h1>

      {!selectedFile ? (
        // File list view
        <div>
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Files</h2>
          <ul className="space-y-2">
            {miscFiles.map((file) => (
              <li key={file}>
                <button
                  onClick={() => handleFileClick(file)}
                  className="w-full text-left p-3 rounded-lg border bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  {file}
                </button>
              </li>
            ))}
          </ul>
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
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editMode ? 'View' : 'Edit'}
            </button>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 overflow-auto">
            {editMode ? (
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