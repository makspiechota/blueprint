import React from 'react';

interface CourseSummary {
  id: string;
  title: string;
  subtitle?: string;
  price?: number;
  currency?: string;
  duration?: string;
  modulesCount: number;
  status?: string;
}

interface CourseCardProps {
  course: CourseSummary;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {course.title}
          </h3>
          {course.subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {course.subtitle}
            </p>
          )}
        </div>
        <span className={`ml-3 px-2 py-1 text-xs font-medium rounded ${getStatusColor(course.status)}`}>
          {course.status || 'draft'}
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mt-4 text-sm">
        {/* Modules count */}
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>{course.modulesCount} modules</span>
        </div>

        {/* Duration */}
        {course.duration && (
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{course.duration}</span>
          </div>
        )}

        {/* Price */}
        {course.price !== undefined && course.price > 0 && (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
            <span>${course.price}</span>
            {course.currency && course.currency !== 'USD' && (
              <span className="text-xs text-gray-500">{course.currency}</span>
            )}
          </div>
        )}
      </div>

      {/* Arrow indicator */}
      <div className="flex justify-end mt-4">
        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default CourseCard;
