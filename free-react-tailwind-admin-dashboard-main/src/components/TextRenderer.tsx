import React from 'react';
import ReactMarkdown from 'react-markdown';

interface TextRendererProps {
  text?: string;
  className?: string;
}

const TextRenderer: React.FC<TextRendererProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // If the text contains markdown link syntax [text](url), render as markdown
  if (text.includes('[') && text.includes('](') && text.includes(')')) {
    return (
      <div className={`prose prose-sm max-w-none ${className}`}>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  }

  // Otherwise, render as plain text
  return <p className={className}>{text}</p>;
};

export default TextRenderer;