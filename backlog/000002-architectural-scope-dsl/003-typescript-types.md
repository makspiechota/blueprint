# Task: Define TypeScript Types for Architectural Scope

## User Story Reference
All user stories - Provides type-safe foundation for parser, validator, and visualizer

## Description
Define TypeScript interfaces for architectural scope structure, including scope items, the six scope lists, business mission, business goals, and the complete architectural scope type.

## Files to Modify/Create
- `src/parser/types.ts` - Add architectural scope interfaces

## Estimated Lines of Code
~30 lines

## Dependencies
- Task 001 (schema system - types should align with schema)

## Implementation Notes
- Define ScopeItem interface (title, description)
- Define BusinessMission interface (action, service, beneficiary)
- Define BusinessGoal interface (title, description)
- Define ArchitecturalScope interface with:
  - Required: type, version, last_updated, title, north_star_ref
  - Optional: what, how, where, who, when, why (all arrays of ScopeItem)
  - Special why field structure (mission + goals)
- All scope lists are optional (teams define what's relevant)
- Types should match schema definitions exactly
- Export all types for use by parser, validator, visualizer

## Acceptance Criteria
- [ ] ScopeItem interface defined
- [ ] BusinessMission and BusinessGoal interfaces defined
- [ ] ArchitecturalScope interface includes all required and optional fields
- [ ] Six scope list fields properly typed as optional arrays
- [ ] Why field supports both simple ScopeItem[] and structured mission+goals
- [ ] Types exported and available throughout codebase
