import type { Node, Edge } from "@xyflow/react";

export interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  status: "draft" | "active" | "archived";
  created_at: string;
  updated_at: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  provider?: string;
  prompt?: string;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

const API_BASE = "http://localhost:3005";

// Convert React Flow nodes/edges to workflow format
export function toWorkflowFormat(
  nodes: Node[],
  edges: Edge[],
  metadata: { id?: string; name: string; description: string }
): Omit<Workflow, "created_at" | "updated_at"> {
  return {
    id: metadata.id || `workflow-${Date.now()}`,
    name: metadata.name,
    description: metadata.description,
    version: "1.0",
    status: "draft",
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type || "agent",
      label: String(node.data?.label || ""),
      position: node.position,
      provider: node.data?.provider as string | undefined,
      prompt: node.data?.prompt as string | undefined,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || undefined,
      targetHandle: edge.targetHandle || undefined,
    })),
  };
}

// Convert workflow format to React Flow nodes/edges
export function fromWorkflowFormat(workflow: Workflow): {
  nodes: Node[];
  edges: Edge[];
} {
  return {
    nodes: workflow.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        label: node.label,
        ...(node.provider && { provider: node.provider }),
        ...(node.prompt && { prompt: node.prompt }),
      },
    })),
    edges: workflow.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      animated: true,
    })),
  };
}

// API response wrapper
interface ApiResponse<T> {
  data: T;
  error?: string;
}

// API functions
export async function listWorkflows(): Promise<Workflow[]> {
  const response = await fetch(`${API_BASE}/api/workflows`);
  if (!response.ok) {
    throw new Error(`Failed to list workflows: ${response.statusText}`);
  }
  const json: ApiResponse<Workflow[]> = await response.json();
  return json.data;
}

export async function getWorkflow(id: string): Promise<Workflow> {
  const response = await fetch(`${API_BASE}/api/workflows/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to get workflow: ${response.statusText}`);
  }
  const json: ApiResponse<Workflow> = await response.json();
  return json.data;
}

export async function createWorkflow(
  workflow: Omit<Workflow, "created_at" | "updated_at">
): Promise<Workflow> {
  const response = await fetch(`${API_BASE}/api/workflows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workflow),
  });
  if (!response.ok) {
    throw new Error(`Failed to create workflow: ${response.statusText}`);
  }
  const json: ApiResponse<Workflow> = await response.json();
  return json.data;
}

export async function updateWorkflow(
  id: string,
  workflow: Partial<Omit<Workflow, "id" | "created_at" | "updated_at">>
): Promise<Workflow> {
  const response = await fetch(`${API_BASE}/api/workflows/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workflow),
  });
  if (!response.ok) {
    throw new Error(`Failed to update workflow: ${response.statusText}`);
  }
  const json: ApiResponse<Workflow> = await response.json();
  return json.data;
}

export async function deleteWorkflow(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/workflows/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete workflow: ${response.statusText}`);
  }
}

export async function executeWorkflow(
  id: string,
  context?: Record<string, unknown>
): Promise<{ executionId: string }> {
  const response = await fetch(`${API_BASE}/api/workflows/${id}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context }),
  });
  if (!response.ok) {
    throw new Error(`Failed to execute workflow: ${response.statusText}`);
  }
  const json: ApiResponse<{ executionId: string }> = await response.json();
  return json.data;
}
