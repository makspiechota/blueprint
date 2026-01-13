import React from 'react';
import ChatButton from './ChatButton';
import DownloadButton from './DownloadButton';
import { useChat } from '../context/ChatContext';

interface ModuleData {
  id: string;
  name: string;
  duration?: string;
  purpose?: string;
  lectures?: any[];
  prompts?: any[];
  templates?: any[];
}

interface CourseData {
  title?: string;
  subtitle?: string;
  price?: number;
  currency?: string;
  duration?: string;
  description?: string;
  target_audience?: {
    profile?: string;
    why_they_buy?: string;
  };
  outcomes?: string[];
  modules?: ModuleData[];
}

interface CourseVisualizerProps {
  data: CourseData;
  productName?: string;
  onModuleClick?: (moduleId: string) => void;
}

const CourseVisualizer: React.FC<CourseVisualizerProps> = ({
  data,
  productName = 'blueprint',
  onModuleClick
}) => {
  const { openChat } = useChat();

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  const getContentCount = (module: ModuleData) => {
    const lectures = module.lectures?.length || 0;
    const prompts = module.prompts?.length || 0;
    const templates = module.templates?.length || 0;
    return { lectures, prompts, templates, total: lectures + prompts + templates };
  };

  return (
    <div className="course-visualizer">
      {/* Course Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {data.title || 'Untitled Course'}
            </h1>
            {data.subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-400 italic">
                {data.subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DownloadButton data={data} filename={`course-${productName}.yaml`} />
            <ChatButton
              resourceType="tripwire-course"
              resourceData={{ title: data.title, content: data }}
              onClick={handleChatClick}
              className="!relative !top-0 !right-0"
            />
          </div>
        </div>

        {/* Course Meta */}
        <div className="flex flex-wrap gap-4 mb-4">
          {data.price !== undefined && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              ${data.price} {data.currency || 'USD'}
            </span>
          )}
          {data.duration && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {data.duration}
            </span>
          )}
          {data.modules && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {data.modules.length} Modules
            </span>
          )}
        </div>

        {/* Description */}
        {data.description && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {data.description}
            </p>
          </div>
        )}

        {/* Outcomes */}
        {data.outcomes && data.outcomes.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What You'll Get
            </h3>
            <ul className="space-y-2">
              {data.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Course Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.modules?.map((module, index) => {
            const counts = getContentCount(module);
            return (
              <div
                key={module.id}
                onClick={() => onModuleClick?.(module.id)}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium">
                    {index + 1}
                  </span>
                  {module.duration && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {module.duration}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {module.name}
                </h3>
                {module.purpose && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {module.purpose}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 text-xs">
                  {counts.lectures > 0 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      {counts.lectures} lecture{counts.lectures !== 1 ? 's' : ''}
                    </span>
                  )}
                  {counts.prompts > 0 && (
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded">
                      {counts.prompts} prompt{counts.prompts !== 1 ? 's' : ''}
                    </span>
                  )}
                  {counts.templates > 0 && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                      {counts.templates} template{counts.templates !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseVisualizer;
