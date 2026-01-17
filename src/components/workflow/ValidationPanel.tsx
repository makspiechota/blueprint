import type { ValidationResult, ValidationError } from "./validation";

interface ValidationPanelProps {
  result: ValidationResult;
  onClose: () => void;
  onNodeClick?: (nodeId: string) => void;
}

export default function ValidationPanel({
  result,
  onClose,
  onNodeClick,
}: ValidationPanelProps) {
  const { isValid, errors, warnings } = result;

  const renderItem = (item: ValidationError, index: number) => (
    <div
      key={index}
      className={`flex items-start gap-2 p-2 rounded ${
        item.type === "error"
          ? "bg-red-50 dark:bg-red-900/20"
          : "bg-yellow-50 dark:bg-yellow-900/20"
      } ${item.nodeId && onNodeClick ? "cursor-pointer hover:opacity-80" : ""}`}
      onClick={() => item.nodeId && onNodeClick?.(item.nodeId)}
    >
      <span
        className={`flex-shrink-0 w-5 h-5 ${
          item.type === "error"
            ? "text-red-500 dark:text-red-400"
            : "text-yellow-500 dark:text-yellow-400"
        }`}
      >
        {item.type === "error" ? (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        )}
      </span>
      <span
        className={`text-sm ${
          item.type === "error"
            ? "text-red-700 dark:text-red-300"
            : "text-yellow-700 dark:text-yellow-300"
        }`}
      >
        {item.message}
      </span>
    </div>
  );

  return (
    <div className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between ${
          isValid
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
        }`}
      >
        <div className="flex items-center gap-2">
          {isValid ? (
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          <h3
            className={`font-semibold ${
              isValid
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            }`}
          >
            {isValid ? "Workflow Valid" : "Validation Failed"}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-80 overflow-y-auto space-y-2">
        {errors.length === 0 && warnings.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No issues found. Your workflow is ready!
          </p>
        ) : (
          <>
            {errors.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-red-600 dark:text-red-400 uppercase">
                  Errors ({errors.length})
                </div>
                {errors.map(renderItem)}
              </div>
            )}
            {warnings.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-yellow-600 dark:text-yellow-400 uppercase mt-3">
                  Warnings ({warnings.length})
                </div>
                {warnings.map(renderItem)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {errors.length > 0
            ? "Fix errors before saving the workflow."
            : warnings.length > 0
            ? "Warnings don't prevent saving but may cause issues."
            : "Click nodes to select and configure them."}
        </p>
      </div>
    </div>
  );
}
