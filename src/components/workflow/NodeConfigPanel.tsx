import { type Node } from "@xyflow/react";
import { type AgentNodeData } from "./nodes";

interface NodeConfigPanelProps {
  node: Node;
  onUpdate: (nodeId: string, data: Partial<AgentNodeData>) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
}

export default function NodeConfigPanel({
  node,
  onUpdate,
  onDelete,
  onClose,
}: NodeConfigPanelProps) {
  const data = node.data as unknown as AgentNodeData;
  const isAgent = node.type === "agent";

  return (
    <div className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Configure Node
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        {/* Node Type Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Type:
          </span>
          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded capitalize">
            {node.type}
          </span>
          <span className="text-xs text-gray-400">ID: {node.id}</span>
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Label
          </label>
          <input
            type="text"
            value={data.label || ""}
            onChange={(e) => onUpdate(node.id, { label: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter node label..."
          />
        </div>

        {/* Provider (only for agent nodes) */}
        {isAgent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Provider
            </label>
            <select
              value={data.provider || "claudeCode"}
              onChange={(e) =>
                onUpdate(node.id, {
                  provider: e.target.value as AgentNodeData["provider"],
                })
              }
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="claudeCode">Claude Code</option>
              <option value="openCode">OpenCode</option>
              <option value="claudeCodeWithFallback">Claude Code + Fallback</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {data.provider === "claudeCodeWithFallback"
                ? "Uses Claude Code with OpenCode fallback on rate limits"
                : data.provider === "openCode"
                ? "Uses OpenCode AI agent"
                : "Uses Claude Code CLI agent"}
            </p>
          </div>
        )}

        {/* Prompt (only for agent nodes) */}
        {isAgent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prompt
            </label>
            <textarea
              value={data.prompt || ""}
              onChange={(e) => onUpdate(node.id, { prompt: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Enter agent prompt...&#10;&#10;Use {{input}} for previous node output.&#10;Use {{context}} for workflow context."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Available variables: {"{{input}}"}, {"{{context}}"}, {"{{workdir}}"}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <button
          onClick={() => onDelete(node.id)}
          className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
        >
          Delete Node
        </button>
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
