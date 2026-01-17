import { type DragEvent } from "react";

interface NodeTemplate {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: "agent",
    label: "Agent",
    description: "AI coding agent",
    color: "bg-purple-500",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    type: "condition",
    label: "Condition",
    description: "Branch logic",
    color: "bg-amber-500",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const agentPresets = [
  { label: "Analyze Requirements", provider: "claudeCode" },
  { label: "Generate Code", provider: "claudeCode" },
  { label: "Write Tests", provider: "claudeCode" },
  { label: "Code Review", provider: "claudeCodeWithFallback" },
  { label: "Refactor", provider: "claudeCode" },
  { label: "Fix Bug", provider: "claudeCodeWithFallback" },
];

interface NodePaletteProps {
  onClose?: () => void;
}

export default function NodePalette({ onClose }: NodePaletteProps) {
  const onDragStart = (
    event: DragEvent<HTMLDivElement>,
    nodeType: string,
    data?: Record<string, unknown>
  ) => {
    event.dataTransfer.setData("application/reactflow/type", nodeType);
    event.dataTransfer.setData("application/reactflow/data", JSON.stringify(data || {}));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Add Node</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Node Types */}
      <div className="p-3">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
          Node Types
        </div>
        <div className="space-y-2">
          {nodeTemplates.map((template) => (
            <div
              key={template.type}
              draggable
              onDragStart={(e) => onDragStart(e, template.type, { label: template.label })}
              className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-grab hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            >
              <div className={`p-2 rounded ${template.color} text-white`}>
                {template.icon}
              </div>
              <div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {template.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {template.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Presets */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
          Agent Presets
        </div>
        <div className="space-y-1">
          {agentPresets.map((preset) => (
            <div
              key={preset.label}
              draggable
              onDragStart={(e) =>
                onDragStart(e, "agent", {
                  label: preset.label,
                  provider: preset.provider,
                })
              }
              className="flex items-center gap-2 p-2 rounded cursor-grab hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {preset.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Drag nodes onto the canvas to add them to your workflow.
        </p>
      </div>
    </div>
  );
}
