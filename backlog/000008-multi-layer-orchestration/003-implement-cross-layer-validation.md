# Task: Implement Cross-Layer Validation

## User Story Reference
4. As an auditor, I want to run full validation and get a report of all issues so that I can ensure compliance
5. As an AI agent, I want to validate cross-layer consistency so that I can detect orphaned entities

## Description
Create cross-layer validation logic that ensures all references between layers point to existing entities, detects circular dependencies, and validates logical consistency across the entire business architecture.

## Files to Modify/Create
- `src/parser/validator.ts` - Add validateCrossLayerReferences() function
- `src/parser/orchestration.ts` - Add validation methods
- `src/parser/types.ts` - Add ValidationResult type

## Estimated Lines of Code
~200 lines

## Dependencies
002-create-orchestration-engine.md

## Implementation Notes
- Validate all references point to existing entities
- Detect circular dependencies using topological sort
- Check for orphaned entities (entities not referenced by higher layers)
- Validate logical consistency (e.g., AAARR metrics align with viability targets)
- Return detailed validation report with errors/warnings by layer
- Use DFS algorithm for cycle detection

## Acceptance Criteria
- [ ] Validates all cross-layer references exist
- [ ] Detects circular dependencies
- [ ] Identifies orphaned entities
- [ ] Checks logical consistency between layers
- [ ] Returns detailed validation report
- [ ] Exit code 0 for valid, 1 for errors