import React from 'react';
import ChatButton from './ChatButton';
import { useChat } from '../context/ChatContext';

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
  const { openChat } = useChat();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
        <div className="flex justify-center">
          <ChatButton
            resourceType={resourceType}
            resourceData={resourceData}
            onClick={openChat}
            text={buttonText}
            className="!relative !bg-blue-500 hover:!bg-blue-600 !text-white !px-6 !py-3 !rounded-lg !flex !items-center"
          />
        </div>
      </div>
    </div>
  );
};

export default MissingLayer;