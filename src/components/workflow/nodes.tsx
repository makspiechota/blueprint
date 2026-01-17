import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

// Node data types
export interface AgentNodeData {
  label: string;
  provider?: "claudeCode" | "openCode" | "claudeCodeWithFallback";
  prompt?: string;
  status?: "idle" | "running" | "success" | "error";
}

export interface StartNodeData {
  label: string;
}

export interface EndNodeData {
  label: string;
}

// Status colors
const statusColors = {
  idle: "bg-gray-400",
  running: "bg-yellow-400 animate-pulse",
  success: "bg-green-400",
  error: "bg-red-400",
};

// Provider icons
const providerIcons: Record<string, string> = {
  claudeCode: "CC",
  openCode: "OC",
  claudeCodeWithFallback: "CF",
};

// Start Node
export const StartNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as StartNodeData;
  return (
    <div className="px-4 py-2 rounded-full bg-emerald-500 text-white shadow-lg border-2 border-emerald-600 min-w-[100px] text-center">
      <div className="font-semibold text-sm">{nodeData.label || "Start"}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-emerald-700 border-2 border-white"
      />
    </div>
  );
});
StartNode.displayName = "StartNode";

// End Node
export const EndNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as EndNodeData;
  return (
    <div className="px-4 py-2 rounded-full bg-rose-500 text-white shadow-lg border-2 border-rose-600 min-w-[100px] text-center">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-rose-700 border-2 border-white"
      />
      <div className="font-semibold text-sm">{nodeData.label || "End"}</div>
    </div>
  );
});
EndNode.displayName = "EndNode";

// Agent Node
export const AgentNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as AgentNodeData;
  const status = nodeData.status || "idle";
  const provider = nodeData.provider || "claudeCode";

  return (
    <div
      className={`px-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow-lg border-2 min-w-[180px] ${
        selected
          ? "border-purple-500 ring-2 ring-purple-500/20"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-purple-500 border-2 border-white"
      />

      {/* Header with status and provider */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Agent
          </span>
        </div>
        <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded font-mono">
          {providerIcons[provider]}
        </span>
      </div>

      {/* Label */}
      <div className="font-semibold text-gray-900 dark:text-white text-sm">
        {nodeData.label || "Unnamed Agent"}
      </div>

      {/* Prompt preview */}
      {nodeData.prompt && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
          {nodeData.prompt}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-purple-500 border-2 border-white"
      />
    </div>
  );
});
AgentNode.displayName = "AgentNode";

// Condition Node (for future use)
export const ConditionNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 shadow-lg border-2 min-w-[140px] ${
        selected
          ? "border-amber-500 ring-2 ring-amber-500/20"
          : "border-amber-200 dark:border-amber-700"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-amber-500 border-2 border-white"
      />

      <div className="flex items-center gap-2 mb-1">
        <svg
          className="w-4 h-4 text-amber-600 dark:text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
          Condition
        </span>
      </div>

      <div className="font-semibold text-gray-900 dark:text-white text-sm">
        {(data as { label: string }).label || "If..."}
      </div>

      {/* Two output handles for true/false branches */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 !bg-green-500 border-2 border-white !left-[30%]"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 !bg-red-500 border-2 border-white !left-[70%]"
      />
    </div>
  );
});
ConditionNode.displayName = "ConditionNode";

// Export node types for React Flow
export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  agent: AgentNode,
  condition: ConditionNode,
};
