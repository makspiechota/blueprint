# Task: Define TypeScript Types for Architectural Scope

## User Story Reference
All user stories - Provides type-safe foundation for parser, validator, and visualizer

## Description
Use openapi-typescript tool to generate TypeScript interfaces from JSON schemas for architectural scope structure. This ensures types always match schema definitions and eliminates manual maintenance.

## Files to Modify/Create
- `package.json` - Add openapi-typescript dependency and generation script
- `src/parser/types.ts` - Import generated types
- `src/parser/types.generated.ts` - Auto-generated types (git ignored)

## Estimated Lines of Code
~20 lines (package.json: 5, type imports: 10, config: 5)

## Dependencies
- Task 001 (schema system - types generated from schemas)

## Implementation Notes
- Install openapi-typescript: `npm install --save-dev openapi-typescript`
- Tool: https://github.com/openapi-ts/openapi-typescript
- Add npm script: `"generate-types": "openapi-typescript schemas/**/*.schema.json -o src/parser/types.generated.ts"`
- Configure to process JSON Schema files (not just OpenAPI)
- Run generator as part of build process (pre-build script)
- Generated file should be git-ignored (.gitignore entry)
- Import generated types in src/parser/types.ts and re-export with cleaner names
- Benefits:
  - Production-grade tool with JSON Schema support
  - Schema changes automatically update types
  - No custom code to maintain
  - JSDoc comments from schema descriptions
  - Proper handling of optionality, unions, arrays

## Acceptance Criteria
- [ ] openapi-typescript installed and configured
- [ ] npm run generate-types script generates types from schemas
- [ ] Generated types include ScopeItem, BusinessMission, BusinessGoal interfaces
- [ ] ArchitecturalScope interface includes all required and optional fields
- [ ] Six scope list fields properly typed as optional arrays
- [ ] JSDoc comments generated from schema descriptions
- [ ] Generated file added to .gitignore
- [ ] Types imported and re-exported from types.ts
- [ ] Types match schemas exactly (validated in tests)
- [ ] Types available throughout codebase
