import { buildTraceabilityGraph } from '../src/parser/orchestration';
import { TraceabilityGraph } from '../src/parser/types';

describe('buildTraceabilityGraph', () => {
  test('builds graph with all entities as nodes', () => {
    // Use a minimal business for testing
    const orchestrated = {
      business: {
        type: 'business' as const,
        version: '2.0',
        last_updated: '2025-12-25',
        title: 'Test Business'
      },
      northStar: {
        type: 'north-star' as const,
        version: '2.0',
        last_updated: '2025-12-25',
        title: 'Test North Star',
        vision: 'Test Vision',
        problem: 'Test Problem',
        solution: 'Test Solution',
        strategic_goals: [
          { title: 'Goal 1', description: 'Description 1' },
          { title: 'Goal 2', description: 'Description 2' }
        ]
      }
    };

    const graph = buildTraceabilityGraph(orchestrated);

    // Should have nodes for business and north star entities
    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(graph.nodes.find(n => n.id === 'business')).toBeDefined();
    expect(graph.nodes.find(n => n.id === 'north-star')).toBeDefined();
    expect(graph.nodes.find(n => n.id === 'north-star.goal.0')).toBeDefined();
    expect(graph.nodes.find(n => n.id === 'north-star.goal.1')).toBeDefined();
  });

  test('creates directed edges for all references', () => {
    const orchestrated = {
      business: {
        type: 'business' as const,
        version: '2.0',
        last_updated: '2025-12-25',
        title: 'Test Business'
      },
      northStar: {
        type: 'north-star' as const,
        version: '2.0',
        last_updated: '2025-12-25',
        title: 'Test North Star',
        vision: 'Test Vision',
        problem: 'Test Problem',
        solution: 'Test Solution',
        strategic_goals: []
      }
    };

    const graph = buildTraceabilityGraph(orchestrated);

    // Should have edge from business to north-star
    expect(graph.edges.find(e => e.source === 'business' && e.target === 'north-star')).toBeDefined();
  });

  test('nodes are colored by layer', () => {
    const orchestrated = {
      business: {
        type: 'business' as const,
        version: '2.0',
        last_updated: '2025-12-25',
        title: 'Test Business'
      },
      northStar: {
        type: 'north-star' as const,
        version: '2.0',
        last_updated: '2025-12-25',
        title: 'Test North Star',
        vision: 'Test Vision',
        problem: 'Test Problem',
        solution: 'Test Solution',
        strategic_goals: []
      }
    };

    const graph = buildTraceabilityGraph(orchestrated);

    const businessNode = graph.nodes.find(n => n.id === 'business');
    const northStarNode = graph.nodes.find(n => n.id === 'north-star');

    expect(businessNode?.layer).toBe('business');
    expect(northStarNode?.layer).toBe('north-star');
  });

  test('handles large graphs efficiently', () => {
    // Create a large orchestrated business with many entities
    const orchestrated = {
      business: {
        type: 'business' as const,
        version: '2.0',
        last_updated: '2025-12-25',
        title: 'Large Test Business'
      },
      northStar: {
        type: 'north-star' as const,
        version: '2.0',
        last_updated: '2025-12-25',
        title: 'Large North Star',
        vision: 'Vision',
        problem: 'Problem',
        solution: 'Solution',
        strategic_goals: Array.from({ length: 50 }, (_, i) => ({
          title: `Goal ${i}`,
          description: `Description ${i}`
        }))
      }
    };

    const startTime = Date.now();
    const graph = buildTraceabilityGraph(orchestrated);
    const endTime = Date.now();

    // Should complete in reasonable time (< 1 second for 50+ entities)
    expect(endTime - startTime).toBeLessThan(1000);
    expect(graph.nodes.length).toBeGreaterThan(50); // At least 1 business + 1 north-star + 50 goals
  });
});

// Import and test the utility functions that need to be implemented
describe('TraceabilityGraph utilities', () => {
  let graph: TraceabilityGraph;

  beforeAll(() => {
    const testOrchestrated = {
      business: {
        type: 'business' as const,
        version: '2.0',
        last_updated: '2025-12-25',
        title: 'Test Business'
      },
      northStar: {
        type: 'north-star' as const,
        version: '2.0',
        last_updated: '2025-12-25',
        title: 'Test North Star',
        vision: 'Test Vision',
        problem: 'Test Problem',
        solution: 'Test Solution',
        strategic_goals: [
          { title: 'Goal 1', description: 'Description 1' },
          { title: 'Goal 2', description: 'Description 2' }
        ]
      }
    };
    graph = buildTraceabilityGraph(testOrchestrated);
  });

  test('supports bidirectional traversal', () => {
    // This will fail until we implement the utility functions
    const { traverseUp, traverseDown } = require('../src/utils/traceability');

    const upward = traverseUp(graph, 'north-star.goal.0');
    expect(upward).toContain('north-star');
    expect(upward).toContain('business');

    const downward = traverseDown(graph, 'business');
    expect(downward).toContain('north-star');
    expect(downward).toContain('north-star.goal.0');
  });

  test('enables path finding between any two entities', () => {
    // This will fail until we implement the utility functions
    const { findPath } = require('../src/utils/traceability');

    const path = findPath(graph, 'north-star.goal.0', 'business');
    expect(path).toBeDefined();
    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toBe('north-star.goal.0');
    expect(path[path.length - 1]).toBe('business');
  });

  test('provides node colors by layer', () => {
    // This will fail until we implement the utility functions
    const { getNodeColor } = require('../src/utils/traceability');

    expect(getNodeColor('business')).toBeDefined();
    expect(getNodeColor('north-star')).toBeDefined();
    expect(getNodeColor('business')).not.toBe(getNodeColor('north-star'));
  });
});