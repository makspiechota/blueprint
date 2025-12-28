import React, { useState, useEffect } from 'react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onSave: (newContent: string) => Promise<void>;
  isSaving?: boolean;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  onSave,
  isSaving = false
}) => {
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleSave = async () => {
    try {
      await onSave(editedContent);
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
      // Could show error toast here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
            disabled={isSaving}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-96 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            placeholder="Enter YAML content..."
            disabled={isSaving}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || editedContent === content}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;