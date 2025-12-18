# Task: Define TypeScript Types for Architectural Scope

## User Story Reference
All user stories - Provides type-safe foundation for parser, validator, and visualizer

## Description
Generate TypeScript interfaces from JSON schemas for architectural scope structure. This ensures types always match schema definitions and reduces manual maintenance burden.

## Files to Modify/Create
- `scripts/generate-types.ts` - Schema to TypeScript generator
- `src/parser/types.ts` - Add generated architectural scope interfaces
- `package.json` - Add type generation script

## Estimated Lines of Code
~45 lines (generator: 25, types: 15, package.json: 5)

## Dependencies
- Task 001 (schema system - types generated from schemas)

## Implementation Notes
- Create type generator that reads JSON schemas and outputs TypeScript interfaces
- Generator should:
  - Parse schemas/architectural-scope.schema.json
  - Generate interfaces for ScopeItem, BusinessMission, BusinessGoal
  - Generate ArchitecturalScope interface with proper optionality
  - Add JSDoc comments from schema descriptions
  - Export all types
- Add npm script: `npm run generate-types`
- Run generator as part of build process
- Types should match schema definitions exactly (single source of truth)
- Benefits:
  - Schema changes automatically update types
  - No manual sync between schemas and types
  - JSDoc generated from schema metadata
  - Reduces maintenance and errors

## Acceptance Criteria
- [ ] Type generator reads JSON schemas and outputs TypeScript
- [ ] Generator creates ScopeItem, BusinessMission, BusinessGoal interfaces
- [ ] ArchitecturalScope interface includes all required and optional fields
- [ ] Six scope list fields properly typed as optional arrays
- [ ] JSDoc comments generated from schema descriptions
- [ ] npm run generate-types script works correctly
- [ ] Types match schemas exactly (validated in tests)
- [ ] Types exported and available throughout codebase
