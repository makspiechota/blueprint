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
      className={`p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition-colors duration-200 ${className}`}
      title="Edit manually"
    >
      <PencilIcon />
    </button>
  );
};

export default EditButton;