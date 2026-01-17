import { useCallback, useState, useRef, useEffect, type DragEvent } from "react";
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
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import PageMeta from "../../components/common/PageMeta";
import { nodeTypes, type AgentNodeData } from "../../components/workflow/nodes";
import NodePalette from "../../components/workflow/NodePalette";
import NodeConfigPanel from "../../components/workflow/NodeConfigPanel";
import ValidationPanel from "../../components/workflow/ValidationPanel";
import { validateWorkflow, type ValidationResult } from "../../components/workflow/validation";
import {
  listWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  toWorkflowFormat,
  fromWorkflowFormat,
  type Workflow,
} from "../../services/workflowApi";

// Empty initial state for new workflows
const emptyNodes: Node[] = [
  {
    id: "start",
    type: "start",
    data: { label: "Start" },
    position: { x: 250, y: 0 },
  },
  {
    id: "end",
    type: "end",
    data: { label: "End" },
    position: { x: 250, y: 200 },
  },
];

const emptyEdges: Edge[] = [
  { id: "e-start-end", source: "start", target: "end", animated: true },
];

let nodeId = 100;
const getNodeId = () => `node-${nodeId++}`;

function WorkflowDesignerInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(emptyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(emptyEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<{
    id?: string;
    name: string;
    description: string;
  }>({ name: "New Workflow", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();

  // Load workflow list
  const loadWorkflowList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await listWorkflows();
      setWorkflows(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load workflows");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a specific workflow
  const loadWorkflow = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        const workflow = await getWorkflow(id);
        const { nodes: loadedNodes, edges: loadedEdges } = fromWorkflowFormat(workflow);
        setNodes(loadedNodes);
        setEdges(loadedEdges);
        setCurrentWorkflow({
          id: workflow.id,
          name: workflow.name,
          description: workflow.description,
        });
        setShowLoadDialog(false);
        setTimeout(() => fitView(), 100);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load workflow");
      } finally {
        setLoading(false);
      }
    },
    [setNodes, setEdges, fitView]
  );

  // Save current workflow
  const saveWorkflow = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const workflowData = toWorkflowFormat(nodes, edges, currentWorkflow);

      if (currentWorkflow.id) {
        await updateWorkflow(currentWorkflow.id, {
          name: currentWorkflow.name,
          description: currentWorkflow.description,
          nodes: workflowData.nodes,
          edges: workflowData.edges,
        });
      } else {
        const created = await createWorkflow(workflowData);
        setCurrentWorkflow((prev) => ({ ...prev, id: created.id }));
      }
      setShowSaveDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save workflow");
    } finally {
      setLoading(false);
    }
  }, [nodes, edges, currentWorkflow]);

  // Create new workflow
  const newWorkflow = useCallback(() => {
    setNodes(emptyNodes);
    setEdges(emptyEdges);
    setCurrentWorkflow({ name: "New Workflow", description: "" });
    setSelectedNode(null);
    setTimeout(() => fitView(), 100);
  }, [setNodes, setEdges, fitView]);

  // Open load dialog and fetch list
  const openLoadDialog = useCallback(() => {
    setShowLoadDialog(true);
    loadWorkflowList();
  }, [loadWorkflowList]);

  // Validate workflow
  const runValidation = useCallback(() => {
    const result = validateWorkflow(nodes, edges);
    setValidationResult(result);
    setShowValidation(true);
  }, [nodes, edges]);

  // Select node by ID (for validation panel click)
  const selectNodeById = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setSelectedNode(node);
      }
    },
    [nodes]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow/type");
      const dataStr = event.dataTransfer.getData("application/reactflow/data");

      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let data: Record<string, unknown> = {};
      try {
        data = JSON.parse(dataStr || "{}");
      } catch {
        data = {};
      }

      const newNode: Node = {
        id: getNodeId(),
        type,
        position,
        data: {
          label: data.label || `New ${type}`,
          ...(type === "agent" && {
            provider: data.provider || "claudeCode",
            prompt: data.prompt || "",
            status: "idle",
          }),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const onUpdateNode = useCallback(
    (nodeId: string, data: Partial<AgentNodeData>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
        )
      );
      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode((prev) =>
          prev ? { ...prev, data: { ...prev.data, ...data } } : null
        );
      }
    },
    [setNodes, selectedNode]
  );

  const onDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  const onCloseConfig = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Load workflow list on mount
  useEffect(() => {
    loadWorkflowList();
  }, [loadWorkflowList]);

  return (
    <>
      <PageMeta
        title="Workflow Designer | Software Factory"
        description="Visual workflow designer for AI agent workflows"
      />
      <div
        ref={reactFlowWrapper}
        className="h-[calc(100vh-140px)] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50 dark:bg-gray-900"
          defaultEdgeOptions={{ animated: true }}
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
          <MiniMap
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            nodeColor={(node) => {
              if (node.type === "start") return "#10b981";
              if (node.type === "end") return "#f43f5e";
              if (node.type === "agent") return "#8b5cf6";
              if (node.type === "condition") return "#f59e0b";
              return "#3b82f6";
            }}
          />

          {/* Top-left toolbar */}
          <Panel
            position="top-left"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 m-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {currentWorkflow.name}
              </h3>
              {currentWorkflow.id && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded">
                  Saved
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Drag nodes from the palette onto the canvas.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowPalette(!showPalette)}
                className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Node
              </button>
              <button
                onClick={newWorkflow}
                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                New
              </button>
              <button
                onClick={() => setShowSaveDialog(true)}
                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={openLoadDialog}
                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Load
              </button>
              <button
                onClick={runValidation}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Validate
              </button>
            </div>
          </Panel>

          {/* Node Palette */}
          {showPalette && (
            <Panel position="bottom-left" className="m-4">
              <NodePalette onClose={() => setShowPalette(false)} />
            </Panel>
          )}

          {/* Node Configuration Panel */}
          {selectedNode && (
            <Panel position="top-right" className="m-4">
              <NodeConfigPanel
                node={selectedNode}
                onUpdate={onUpdateNode}
                onDelete={onDeleteNode}
                onClose={onCloseConfig}
              />
            </Panel>
          )}

          {/* Validation Panel */}
          {showValidation && validationResult && (
            <Panel position="bottom-right" className="m-4">
              <ValidationPanel
                result={validationResult}
                onClose={() => setShowValidation(false)}
                onNodeClick={selectNodeById}
              />
            </Panel>
          )}
        </ReactFlow>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-w-[90vw]">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Save Workflow
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={currentWorkflow.name}
                  onChange={(e) =>
                    setCurrentWorkflow((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter workflow name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={currentWorkflow.description}
                  onChange={(e) =>
                    setCurrentWorkflow((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Enter workflow description..."
                />
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveWorkflow}
                disabled={loading || !currentWorkflow.name.trim()}
                className="px-4 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[500px] max-w-[90vw] max-h-[80vh] flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Load Workflow
              </h3>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded mb-4">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Loading workflows...
                </div>
              ) : workflows.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No workflows found. Create your first workflow!
                </div>
              ) : (
                <div className="space-y-2">
                  {workflows.map((workflow) => (
                    <button
                      key={workflow.id}
                      onClick={() => loadWorkflow(workflow.id)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {workflow.name}
                      </div>
                      {workflow.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                          {workflow.description}
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                          {workflow.nodes.length} nodes
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                          v{workflow.version}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            workflow.status === "active"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : workflow.status === "archived"
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                          }`}
                        >
                          {workflow.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setShowLoadDialog(false)}
                className="px-4 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function WorkflowDesigner() {
  return (
    <ReactFlowProvider>
      <WorkflowDesignerInner />
    </ReactFlowProvider>
  );
}
