# Task: Build Traceability Graph

## User Story Reference
2. As a strategist, I want to click an AAARR metric and see everything it impacts so that I understand ripple effects
3. As a product manager, I want to trace a feature back to strategic vision so that I can justify priority
6. As a developer, I want to see a traceability graph so that I understand how my work connects to business goals

## Description
Create a traceability graph data structure that represents all entities and their relationships across all layers, enabling interactive exploration of how business goals cascade through all layers.

## Files to Modify/Create
- `src/parser/orchestration.ts` - Add buildTraceabilityGraph() function
- `src/parser/types.ts` - Add TraceabilityNode, TraceabilityEdge, TraceabilityGraph types
- `src/utils/traceability.ts` - New utility file for graph operations

## Estimated Lines of Code
~180 lines

## Dependencies
002-create-orchestration-engine.md

## Implementation Notes
- Create graph with nodes for all entities across layers
- Add directed edges for all references between entities
- Include metadata on edges (reference type, strength, etc.)
- Support graph traversal (upward/downward from any node)
- Enable path finding (feature → vision)
- Color-code nodes by layer for visualization
- Handle large graphs with 100+ entities efficiently

## Acceptance Criteria
- [ ] Graph contains all entities as nodes
- [ ] All references represented as directed edges
- [ ] Supports bidirectional traversal
- [ ] Enables path finding between any two entities
- [ ] Nodes colored by layer
- [ ] Handles large graphs efficiently