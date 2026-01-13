import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import MarkdownPreview from '@uiw/react-markdown-preview';
import ChatButton from './ChatButton';
import { useChat } from '../context/ChatContext';

interface ContentEditorProps {
  content: string;
  contentId: string;
  contentType: 'lectures' | 'prompts' | 'templates';
  moduleName: string;
  onBack: () => void;
  onSave: (content: string) => Promise<boolean>;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  contentId,
  contentType,
  moduleName,
  onBack,
  onSave
}) => {
  const { openChat } = useChat();
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [saving, setSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Update content when prop changes
  useEffect(() => {
    setEditedContent(content);
    setHasChanges(false);
  }, [content]);

  // Track changes
  useEffect(() => {
    setHasChanges(editedContent !== content);
  }, [editedContent, content]);

  // Keyboard shortcut for save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (editMode && hasChanges) {
          handleSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode, hasChanges, editedContent]);

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave(editedContent);
    setSaving(false);
    if (success) {
      setEditMode(false);
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(content);
    setEditMode(false);
    setHasChanges(false);
  };

  const getTypeLabel = () => {
    switch (contentType) {
      case 'lectures': return 'Lecture';
      case 'prompts': return 'Prompt';
      case 'templates': return 'Template';
      default: return 'Content';
    }
  };

  const getTypeColor = () => {
    switch (contentType) {
      case 'lectures': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'prompts': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'templates': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTitle = (id: string) => {
    return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="content-editor h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <button onClick={onBack} className="hover:text-gray-700 dark:hover:text-gray-200">
            {moduleName}
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor()}`}>
            {getTypeLabel()}
          </span>
        </div>

        {/* Title and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {formatTitle(contentId)}
            </h1>
            {hasChanges && (
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                Unsaved changes
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <ChatButton
                  resourceType={`tripwire-${contentType}`}
                  resourceData={{ title: formatTitle(contentId), content: editedContent, type: contentType }}
                  onClick={handleChatClick}
                  className="!relative !top-0 !right-0"
                />
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        {editMode ? (
          <div data-color-mode={isDarkMode ? 'dark' : 'light'} className="h-full">
            <MDEditor
              value={editedContent}
              onChange={(val) => setEditedContent(val || '')}
              preview="live"
              height="100%"
              className="!bg-transparent h-full"
              style={{ height: '100%', minHeight: '500px' }}
            />
          </div>
        ) : (
          <div className="p-6 overflow-auto h-full" data-color-mode={isDarkMode ? 'dark' : 'light'}>
            <MarkdownPreview
              source={editedContent}
              className="!bg-transparent"
              style={{ backgroundColor: 'transparent' }}
            />
          </div>
        )}
      </div>

      {/* Footer hint */}
      {editMode && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
          Press Ctrl+S (Cmd+S on Mac) to save
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
