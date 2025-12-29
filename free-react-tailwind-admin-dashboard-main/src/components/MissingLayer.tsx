import React, { useState } from 'react';
import { aiService } from '../services/aiService';

interface MissingLayerProps {
  title: string;
  description: string;
  resourceType: string;
  resourceData: any;
  buttonText?: string;
}

const MissingLayer: React.FC<MissingLayerProps> = ({
  title,
  description,
  resourceType,
  resourceData,
  buttonText = "Generate with AI"
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await aiService.generateLayer(resourceType, resourceData);
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
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
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