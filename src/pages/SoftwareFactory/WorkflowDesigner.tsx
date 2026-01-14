import { useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import PageMeta from "../../components/common/PageMeta";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Start" },
    position: { x: 250, y: 0 },
    style: {
      background: "#10b981",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "10px 20px",
    },
  },
  {
    id: "2",
    data: { label: "Agent: Analyze Requirements" },
    position: { x: 250, y: 100 },
    style: {
      background: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "10px 20px",
    },
  },
  {
    id: "3",
    data: { label: "Agent: Generate Code" },
    position: { x: 250, y: 200 },
    style: {
      background: "#8b5cf6",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "10px 20px",
    },
  },
  {
    id: "4",
    data: { label: "Agent: Write Tests" },
    position: { x: 250, y: 300 },
    style: {
      background: "#f59e0b",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "10px 20px",
    },
  },
  {
    id: "5",
    type: "output",
    data: { label: "Complete" },
    position: { x: 250, y: 400 },
    style: {
      background: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "10px 20px",
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
  { id: "e3-4", source: "3", target: "4", animated: true },
  { id: "e4-5", source: "4", target: "5", animated: true },
];

export default function WorkflowDesigner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  return (
    <>
      <PageMeta
        title="Workflow Designer | Software Factory"
        description="Visual workflow designer for AI agent workflows"
      />
      <div className="h-[calc(100vh-140px)] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          className="bg-gray-50 dark:bg-gray-900"
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
          <MiniMap
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            nodeColor={(node) => {
              if (node.type === "input") return "#10b981";
              if (node.type === "output") return "#ef4444";
              return "#3b82f6";
            }}
          />
          <Panel position="top-left" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 m-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Workflow Designer
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Drag nodes to reposition. Click to select and configure.
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors">
                + Add Agent
              </button>
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Save
              </button>
            </div>
          </Panel>
          {selectedNode && (
            <Panel position="top-right" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 m-4 border border-gray-200 dark:border-gray-700 w-72">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Node Configuration
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={String(selectedNode.data.label || "")}
                    onChange={(e) => {
                      setNodes((nds) =>
                        nds.map((n) =>
                          n.id === selectedNode.id
                            ? { ...n, data: { ...n.data, label: e.target.value } }
                            : n
                        )
                      );
                      setSelectedNode({
                        ...selectedNode,
                        data: { ...selectedNode.data, label: e.target.value },
                      });
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Provider
                  </label>
                  <select className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                    <option value="claudeCode">Claude Code</option>
                    <option value="openCode">OpenCode</option>
                    <option value="claudeCodeWithFallback">
                      Claude Code + Fallback
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Prompt
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter agent prompt..."
                    className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                  />
                </div>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </>
  );
}
