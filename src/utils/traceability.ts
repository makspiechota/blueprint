import { TraceabilityNode, TraceabilityEdge, TraceabilityGraph } from '../parser/types';

/**
 * Utility functions for working with traceability graphs
 */

/**
 * Get node color based on layer
 */
export function getNodeColor(layer: string): string {
  const colors: { [key: string]: string } = {
    'business': '#FF6B6B', // Red
    'north-star': '#4ECDC4', // Teal
    'lean-canvas': '#45B7D1', // Blue
    'architectural-scope': '#96CEB4', // Green
    'lean-viability': '#FFEAA7', // Yellow
    'aaarr-metrics': '#DDA0DD', // Plum
    'policy-charter': '#98D8C8' // Mint
  };
  return colors[layer] || '#CCCCCC';
}

/**
 * Find all nodes in the graph
 */
export function getAllNodes(graph: TraceabilityGraph): TraceabilityNode[] {
  return graph.nodes;
}

/**
 * Find a node by ID
 */
export function getNodeById(graph: TraceabilityGraph, id: string): TraceabilityNode | undefined {
  return graph.nodes.find(node => node.id === id);
}

/**
 * Get all edges connected to a node (incoming and outgoing)
 */
export function getConnectedEdges(graph: TraceabilityGraph, nodeId: string): TraceabilityEdge[] {
  return graph.edges.filter(edge => edge.source === nodeId || edge.target === nodeId);
}

/**
 * Get outgoing edges from a node
 */
export function getOutgoingEdges(graph: TraceabilityGraph, nodeId: string): TraceabilityEdge[] {
  return graph.edges.filter(edge => edge.source === nodeId);
}

/**
 * Get incoming edges to a node
 */
export function getIncomingEdges(graph: TraceabilityGraph, nodeId: string): TraceabilityEdge[] {
  return graph.edges.filter(edge => edge.target === nodeId);
}

/**
 * Traverse graph upward from a node (following incoming edges)
 */
export function traverseUpward(graph: TraceabilityGraph, startNodeId: string): TraceabilityNode[] {
  const visited = new Set<string>();
  const result: TraceabilityNode[] = [];

  function traverse(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = getNodeById(graph, nodeId);
    if (node) {
      result.push(node);
    }

    // Traverse incoming edges
    const incoming = getIncomingEdges(graph, nodeId);
    incoming.forEach(edge => {
      traverse(edge.source);
    });
  }

  traverse(startNodeId);
  return result;
}

/**
 * Traverse graph downward from a node (following outgoing edges)
 */
export function traverseDownward(graph: TraceabilityGraph, startNodeId: string): TraceabilityNode[] {
  const visited = new Set<string>();
  const result: TraceabilityNode[] = [];

  function traverse(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = getNodeById(graph, nodeId);
    if (node) {
      result.push(node);
    }

    // Traverse outgoing edges
    const outgoing = getOutgoingEdges(graph, nodeId);
    outgoing.forEach(edge => {
      traverse(edge.target);
    });
  }

  traverse(startNodeId);
  return result;
}

/**
 * Find all paths between two nodes
 */
export function findPaths(graph: TraceabilityGraph, startNodeId: string, endNodeId: string): TraceabilityNode[][] {
  const paths: TraceabilityNode[][] = [];

  function dfs(currentNodeId: string, path: string[], visited: Set<string>) {
    if (visited.has(currentNodeId)) return;
    visited.add(currentNodeId);
    path.push(currentNodeId);

    if (currentNodeId === endNodeId) {
      // Found a path
      const nodePath = path.map(id => getNodeById(graph, id)!).filter(Boolean);
      paths.push([...nodePath]);
    } else {
      // Continue traversing
      const outgoing = getOutgoingEdges(graph, currentNodeId);
      outgoing.forEach(edge => {
        dfs(edge.target, [...path], new Set(visited));
      });
    }

    path.pop();
  }

  dfs(startNodeId, [], new Set());
  return paths;
}

/**
 * Get nodes by layer
 */
export function getNodesByLayer(graph: TraceabilityGraph, layer: string): TraceabilityNode[] {
  return graph.nodes.filter(node => node.layer === layer);
}

/**
 * Traverse upward from a node (returns node IDs)
 */
export function traverseUp(graph: TraceabilityGraph, nodeId: string): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  function dfs(currentId: string) {
    if (visited.has(currentId)) return;
    visited.add(currentId);

    // Find all edges where current node is the target (incoming edges)
    const incomingEdges = graph.edges.filter(edge => edge.target === currentId);

    for (const edge of incomingEdges) {
      if (!visited.has(edge.source)) {
        result.push(edge.source);
        dfs(edge.source);
      }
    }
  }

  dfs(nodeId);
  return result;
}

/**
 * Traverse downward from a node (returns node IDs)
 */
export function traverseDown(graph: TraceabilityGraph, nodeId: string): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  function dfs(currentId: string) {
    if (visited.has(currentId)) return;
    visited.add(currentId);

    // Find all edges where current node is the source (outgoing edges)
    const outgoingEdges = graph.edges.filter(edge => edge.source === currentId);

    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target)) {
        result.push(edge.target);
        dfs(edge.target);
      }
    }
  }

  dfs(nodeId);
  return result;
}

/**
 * Find a path between two nodes (returns node IDs)
 */
export function findPath(graph: TraceabilityGraph, startId: string, endId: string): string[] | null {
  if (startId === endId) return [startId];

  const visited = new Set<string>();
  const queue: { nodeId: string; path: string[] }[] = [{ nodeId: startId, path: [startId] }];

  while (queue.length > 0) {
    const { nodeId, path } = queue.shift()!;
    visited.add(nodeId);

    // Get all neighbors (both incoming and outgoing edges for bidirectional search)
    const neighbors = new Set<string>();
    graph.edges.forEach(edge => {
      if (edge.source === nodeId) neighbors.add(edge.target);
      if (edge.target === nodeId) neighbors.add(edge.source);
    });

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        const newPath = [...path, neighbor];
        if (neighbor === endId) {
          return newPath;
        }
        queue.push({ nodeId: neighbor, path: newPath });
      }
    }
  }

  return null; // No path found
}

/**
 * Get graph statistics
 */
export function getGraphStats(graph: TraceabilityGraph): {
  totalNodes: number;
  totalEdges: number;
  nodesByLayer: { [layer: string]: number };
  edgesByType: { [type: string]: number };
} {
  const nodesByLayer: { [layer: string]: number } = {};
  const edgesByType: { [type: string]: number } = {};

  graph.nodes.forEach(node => {
    nodesByLayer[node.layer] = (nodesByLayer[node.layer] || 0) + 1;
  });

  graph.edges.forEach(edge => {
    edgesByType[edge.type] = (edgesByType[edge.type] || 0) + 1;
  });

  return {
    totalNodes: graph.nodes.length,
    totalEdges: graph.edges.length,
    nodesByLayer,
    edgesByType
  };
}