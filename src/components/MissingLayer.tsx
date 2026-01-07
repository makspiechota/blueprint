import React, { useState } from 'react';
import { aiService } from '../services/aiService';

interface MissingLayerProps {
  title: string;
  description: string;
  resourceType: string;
  resourceData: any;
  buttonText?: string;
  showBusinessDescription?: boolean;
}

const MissingLayer: React.FC<MissingLayerProps> = ({
  title,
  description,
  resourceType,
  resourceData,
  buttonText = "Generate with AI",
  showBusinessDescription = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [businessDescription, setBusinessDescription] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = showBusinessDescription ? { ...resourceData, businessDescription } : resourceData;
      const result = await aiService.generateLayer(resourceType, data);
      if (result.success) {
        // Success, the data should reload automatically via WebSocket
      } else {
        alert('Failed to generate layer: ' + result.message);
      }
    } catch (error) {
      alert('Error generating layer: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
        {showBusinessDescription && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Description
            </label>
            <textarea
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              placeholder="Describe what your business will be about..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              rows={4}
            />
          </div>
        )}
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || (showBusinessDescription && !businessDescription.trim())}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <span>{isGenerating ? 'Generating...' : buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissingLayer;