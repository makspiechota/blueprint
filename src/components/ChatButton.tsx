import React from 'react';
import { ChatIcon } from '../icons';

interface ChatButtonProps {
  resourceType: string;
  resourceData: any;
  onClick?: (resourceType: string, resourceData: any) => void;
  className?: string;
  text?: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({
  resourceType,
  resourceData,
  onClick,
  className = "",
  text
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(resourceType, resourceData);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`absolute top-2 right-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition-colors duration-200 ${className}`}
      title="Chat about this"
    >
      <ChatIcon />
      {text && <span className="ml-2">{text}</span>}
    </button>
  );
};

export default ChatButton;