import type { Node, Edge } from "@xyflow/react";

export interface ValidationError {
  type: "error" | "warning";
  nodeId?: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validates a workflow graph for common issues
 */
export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check for start node
  const startNodes = nodes.filter((n) => n.type === "start");
  if (startNodes.length === 0) {
    errors.push({
      type: "error",
      message: "Workflow must have a Start node",
    });
  } else if (startNodes.length > 1) {
    errors.push({
      type: "error",
      message: "Workflow can only have one Start node",
    });
  }

  // Check for end node
  const endNodes = nodes.filter((n) => n.type === "end");
  if (endNodes.length === 0) {
    errors.push({
      type: "error",
      message: "Workflow must have an End node",
    });
  } else if (endNodes.length > 1) {
    warnings.push({
      type: "warning",
      message: "Workflow has multiple End nodes",
    });
  }

  // Build adjacency maps
  const outgoingEdges = new Map<string, string[]>();
  const incomingEdges = new Map<string, string[]>();

  for (const edge of edges) {
    if (!outgoingEdges.has(edge.source)) {
      outgoingEdges.set(edge.source, []);
    }
    outgoingEdges.get(edge.source)!.push(edge.target);

    if (!incomingEdges.has(edge.target)) {
      incomingEdges.set(edge.target, []);
    }
    incomingEdges.get(edge.target)!.push(edge.source);
  }

  // Check each node
  for (const node of nodes) {
    const hasIncoming = incomingEdges.has(node.id) && incomingEdges.get(node.id)!.length > 0;
    const hasOutgoing = outgoingEdges.has(node.id) && outgoingEdges.get(node.id)!.length > 0;

    // Start node should have outgoing but no incoming
    if (node.type === "start") {
      if (!hasOutgoing) {
        errors.push({
          type: "error",
          nodeId: node.id,
          message: "Start node must have at least one outgoing connection",
        });
      }
      if (hasIncoming) {
        errors.push({
          type: "error",
          nodeId: node.id,
          message: "Start node cannot have incoming connections",
        });
      }
    }
    // End node should have incoming but no outgoing
    else if (node.type === "end") {
      if (!hasIncoming) {
        errors.push({
          type: "error",
          nodeId: node.id,
          message: "End node must have at least one incoming connection",
        });
      }
      if (hasOutgoing) {
        errors.push({
          type: "error",
          nodeId: node.id,
          message: "End node cannot have outgoing connections",
        });
      }
    }
    // Agent and condition nodes should have both
    else if (node.type === "agent" || node.type === "condition") {
      if (!hasIncoming) {
        warnings.push({
          type: "warning",
          nodeId: node.id,
          message: `${node.type === "agent" ? "Agent" : "Condition"} node "${node.data?.label || node.id}" is not connected to any input`,
        });
      }
      if (!hasOutgoing) {
        warnings.push({
          type: "warning",
          nodeId: node.id,
          message: `${node.type === "agent" ? "Agent" : "Condition"} node "${node.data?.label || node.id}" is not connected to any output`,
        });
      }

      // Check agent configuration
      if (node.type === "agent") {
        if (!node.data?.label || String(node.data.label).trim() === "") {
          warnings.push({
            type: "warning",
            nodeId: node.id,
            message: `Agent node is missing a label`,
          });
        }
        if (!node.data?.prompt || String(node.data.prompt).trim() === "") {
          warnings.push({
            type: "warning",
            nodeId: node.id,
            message: `Agent node "${node.data?.label || node.id}" is missing a prompt`,
          });
        }
      }
    }
  }

  // Check for orphan nodes (not reachable from start)
  if (startNodes.length === 1) {
    const reachable = new Set<string>();
    const queue = [startNodes[0].id];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (reachable.has(current)) continue;
      reachable.add(current);

      const neighbors = outgoingEdges.get(current) || [];
      for (const neighbor of neighbors) {
        if (!reachable.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }

    for (const node of nodes) {
      if (!reachable.has(node.id)) {
        warnings.push({
          type: "warning",
          nodeId: node.id,
          message: `Node "${node.data?.label || node.id}" is not reachable from Start`,
        });
      }
    }
  }

  // Check for cycles (optional - workflows might allow them)
  const hasCycle = detectCycle(nodes, outgoingEdges);
  if (hasCycle) {
    warnings.push({
      type: "warning",
      message: "Workflow contains a cycle. Make sure this is intentional.",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Detects if there's a cycle in the graph using DFS
 */
function detectCycle(nodes: Node[], outgoingEdges: Map<string, string[]>): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = outgoingEdges.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}
