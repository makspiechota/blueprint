import React from 'react';
import yaml from 'js-yaml';
import { DownloadIcon } from '../icons';

interface DownloadButtonProps {
  data: any;
  filename: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ data, filename }) => {
  const handleDownload = () => {
    const yamlContent = yaml.dump(data);
    const dataUri = 'data:text/yaml;charset=utf-8,' + encodeURIComponent(yamlContent);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      aria-label="Download YAML"
    >
      <DownloadIcon className="w-4 h-4" />
      Download YAML
    </button>
  );
};

export default DownloadButton;