import React, { useState } from 'react';
import ChatButton from './ChatButton';
import DownloadButton from './DownloadButton';
import { useChat } from '../context/ChatContext';

interface ContentItem {
  id: string;
  name: string;
  path?: string;
}

interface ModuleData {
  id: string;
  name: string;
  duration?: string;
  purpose?: string;
  deliverables?: string[];
  lectures?: ContentItem[];
  prompts?: ContentItem[];
  templates?: ContentItem[];
}

interface ModuleVisualizerProps {
  data: ModuleData;
  onBack?: () => void;
  onContentClick?: (type: string, contentId: string) => void;
}

const ModuleVisualizer: React.FC<ModuleVisualizerProps> = ({
  data,
  onBack,
  onContentClick
}) => {
  const { openChat } = useChat();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    lectures: true,
    prompts: true,
    templates: true
  });

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderContentList = (
    title: string,
    items: ContentItem[] | undefined,
    type: string,
    icon: React.ReactNode,
    bgColor: string
  ) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection(type)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-lg ${bgColor}`}>
              {icon}
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {title}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({items.length})
            </span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections[type] ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections[type] && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            {items.map((item, index) => (
              <div
                key={item.id}
                onClick={() => onContentClick?.(type, item.id)}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 dark:text-gray-500 w-6">
                    {index + 1}.
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.name}
                  </span>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="module-visualizer">
      {/* Breadcrumb / Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Course
        </button>
      </div>

      {/* Module Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {data.name}
            </h1>
            {data.duration && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {data.duration}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DownloadButton data={data} filename={`module-${data.id}.yaml`} />
            <ChatButton
              resourceType="tripwire-module"
              resourceData={{ title: data.name, content: data }}
              onClick={handleChatClick}
              className="!relative !top-0 !right-0"
            />
          </div>
        </div>

        {/* Purpose */}
        {data.purpose && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Purpose
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {data.purpose}
            </p>
          </div>
        )}

        {/* Deliverables */}
        {data.deliverables && data.deliverables.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Deliverables
            </h3>
            <ul className="space-y-2">
              {data.deliverables.map((deliverable, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {deliverable}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Content Sections */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Module Content
        </h2>

        {renderContentList(
          'Lectures',
          data.lectures,
          'lectures',
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>,
          'bg-blue-100 dark:bg-blue-900'
        )}

        {renderContentList(
          'Claude Prompts',
          data.prompts,
          'prompts',
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>,
          'bg-yellow-100 dark:bg-yellow-900'
        )}

        {renderContentList(
          'Templates',
          data.templates,
          'templates',
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>,
          'bg-green-100 dark:bg-green-900'
        )}

        {/* Empty state */}
        {(!data.lectures || data.lectures.length === 0) &&
         (!data.prompts || data.prompts.length === 0) &&
         (!data.templates || data.templates.length === 0) && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No content items in this module yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleVisualizer;
