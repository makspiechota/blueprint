import React, { useState, useEffect } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

interface TextRendererProps {
  text?: string;
  className?: string;
}

const TextRenderer: React.FC<TextRendererProps> = ({ text, className = '' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  if (!text) return null;

  // If the text contains markdown link syntax [text](url), render as markdown
  if (text.includes('[') && text.includes('](') && text.includes(')')) {
    return (
      <div className={className} data-color-mode={isDarkMode ? 'dark' : 'light'}>
        <MarkdownPreview
          source={text}
          className="!bg-transparent !p-0"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
    );
  }

  // Otherwise, render as plain text
  return <p className={className}>{text}</p>;
};

export default TextRenderer;
