# Task: Create Dependency Graph Generator

## User Story Reference
User Story 4: "As a project manager, I want to see feature dependencies so that I can plan sprint order"

## Description
Create dependency graph generator that detects circular dependencies and visualizes feature relationships for backlog planning.

## Files to Modify/Create
- `src/graph/dependency-graph.ts` - Graph generation and cycle detection logic
- `src/graph/index.ts` - Export dependency graph functions

## Estimated Lines of Code
~100 lines

## Dependencies
Task 001 (schema)

## Implementation Notes
- Implement graph traversal to detect cycles in dependency relationships
- Support blocks/blocked_by relationships
- Generate dependency graph data structure for visualization
- Provide functions to:
  - Build dependency graph from feature list
  - Detect circular dependencies
  - Get topological sort for planning
  - Find features with no dependencies (can be implemented first)
  - Find features that block many others (high priority)

## Acceptance Criteria
- [ ] Graph traversal algorithm detects circular dependencies
- [ ] Build dependency graph from feature blocks/blocked_by relationships
- [ ] Topological sort function for sprint planning
- [ ] Find root features (no dependencies) function
- [ ] Find bottleneck features (blocks many others) function
- [ ] Error reporting for circular dependency cycles
- [ ] Graph data structure suitable for visualization