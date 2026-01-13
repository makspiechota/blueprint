import { useParams, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import CourseList from "../../components/CourseList";
import CourseVisualizer from "../../components/CourseVisualizer";
import ModuleVisualizer from "../../components/ModuleVisualizer";
import ContentEditor from "../../components/ContentEditor";

const API_BASE = 'http://localhost:3001';

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

export default function Tripwire() {
  const { productName: urlProductName } = useParams<{ productName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const safeProductName = urlProductName || 'blueprint';
  const { setProductName } = useBusinessData();

  // Navigation state from URL params
  const courseId = searchParams.get('course');
  const moduleId = searchParams.get('module');
  const contentType = searchParams.get('type') as 'lectures' | 'prompts' | 'templates' | null;
  const contentId = searchParams.get('content');

  // Data state
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [courseData, setCourseData] = useState<any>(null);
  const [moduleData, setModuleData] = useState<any>(null);
  const [contentData, setContentData] = useState<{ id: string; content: string; type: string; moduleId: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProductName?.(safeProductName);
  }, [safeProductName, setProductName]);

  // Load courses list
  useEffect(() => {
    if (!courseId) {
      setLoading(true);
      fetch(`${API_BASE}/api/tripwire/${safeProductName}/courses`)
        .then(res => res.json())
        .then(data => {
          setCourses(data.data || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load courses:', err);
          setLoading(false);
        });
    }
  }, [safeProductName, courseId]);

  // Load course data when courseId changes
  useEffect(() => {
    if (courseId && !moduleId) {
      setLoading(true);
      fetch(`${API_BASE}/api/tripwire/${safeProductName}/courses/${courseId}`)
        .then(res => res.json())
        .then(data => {
          setCourseData(data.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load course:', err);
          setLoading(false);
        });
    } else if (!courseId) {
      setCourseData(null);
    }
  }, [courseId, safeProductName, moduleId]);

  // Load module data when moduleId changes
  useEffect(() => {
    if (courseId && moduleId && !contentId) {
      setLoading(true);
      fetch(`${API_BASE}/api/tripwire/${safeProductName}/courses/${courseId}/modules/${moduleId}`)
        .then(res => res.json())
        .then(data => {
          setModuleData(data.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load module:', err);
          setLoading(false);
        });
    } else if (!moduleId) {
      setModuleData(null);
    }
  }, [courseId, moduleId, safeProductName, contentId]);

  // Load content data when contentId changes
  useEffect(() => {
    if (courseId && moduleId && contentType && contentId) {
      setLoading(true);
      fetch(`${API_BASE}/api/tripwire/${safeProductName}/courses/${courseId}/modules/${moduleId}/${contentType}/${contentId}`)
        .then(res => res.json())
        .then(data => {
          setContentData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load content:', err);
          setLoading(false);
        });
    } else if (!contentId) {
      setContentData(null);
    }
  }, [courseId, moduleId, contentType, contentId, safeProductName]);

  // Navigation handlers
  const handleCourseClick = (id: string) => {
    setSearchParams({ course: id });
  };

  const handleModuleClick = (id: string) => {
    if (courseId) {
      setSearchParams({ course: courseId, module: id });
    }
  };

  const handleContentClick = (type: string, id: string) => {
    if (courseId && moduleId) {
      setSearchParams({ course: courseId, module: moduleId, type, content: id });
    }
  };

  const handleBackToCourseList = () => {
    setSearchParams({});
    setCourseData(null);
    setModuleData(null);
    setContentData(null);
  };

  const handleBackToCourse = () => {
    if (courseId) {
      setSearchParams({ course: courseId });
      setModuleData(null);
      setContentData(null);
    }
  };

  const handleBackToModule = () => {
    if (courseId && moduleId) {
      setSearchParams({ course: courseId, module: moduleId });
      setContentData(null);
    }
  };

  const handleCreateCourse = async (courseData: { id: string; title: string; subtitle?: string; price?: number }): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/api/tripwire/${safeProductName}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        // Reload courses list
        const coursesRes = await fetch(`${API_BASE}/api/tripwire/${safeProductName}/courses`);
        const coursesData = await coursesRes.json();
        setCourses(coursesData.data || []);
        // Navigate to new course
        setSearchParams({ course: courseData.id });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create course:', error);
      return false;
    }
  };

  const handleSaveContent = async (newContent: string): Promise<boolean> => {
    if (!courseId || !moduleId || !contentType || !contentId) return false;

    try {
      const response = await fetch(
        `${API_BASE}/api/tripwire/${safeProductName}/courses/${courseId}/modules/${moduleId}/${contentType}/${contentId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newContent }),
        }
      );

      if (response.ok) {
        setContentData(prev => prev ? { ...prev, content: newContent } : null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save content:', error);
      return false;
    }
  };

  // Determine what to render based on navigation state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      );
    }

    // Content editor view
    if (courseId && contentId && contentData && moduleId && contentType) {
      return (
        <ContentEditor
          content={contentData.content}
          contentId={contentId}
          contentType={contentType}
          moduleName={moduleData?.name || moduleId}
          onBack={handleBackToModule}
          onSave={handleSaveContent}
        />
      );
    }

    // Module detail view
    if (courseId && moduleId && moduleData) {
      return (
        <ModuleVisualizer
          data={moduleData}
          onBack={handleBackToCourse}
          onContentClick={handleContentClick}
        />
      );
    }

    // Course overview
    if (courseId && courseData) {
      return (
        <div>
          {/* Back to courses list */}
          <div className="mb-4">
            <button
              onClick={handleBackToCourseList}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Courses
            </button>
          </div>
          <CourseVisualizer
            data={courseData}
            productName={safeProductName}
            onModuleClick={handleModuleClick}
          />
        </div>
      );
    }

    // Course list (default)
    return (
      <CourseList
        courses={courses}
        onCourseClick={handleCourseClick}
        onCreateCourse={handleCreateCourse}
      />
    );
  };

  return (
    <>
      <PageMeta
        title="Tripwire Courses | Software Layers"
        description="Educational content layer for course management"
      />
      <div className="p-6">
        {renderContent()}
      </div>
    </>
  );
}
