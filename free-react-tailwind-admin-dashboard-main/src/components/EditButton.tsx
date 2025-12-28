import React from 'react';
import { PencilIcon } from '../icons';

interface EditButtonProps {
  onClick?: (...args: any[]) => void;
  className?: string;
}

const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  className = ""
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors ${className}`}
      title="Edit manually"
    >
      <PencilIcon />
    </button>
  );
};

export default EditButton;