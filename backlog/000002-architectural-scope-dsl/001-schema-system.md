# Task: Implement Pluggable Schema System

## User Story Reference
All user stories - Provides foundation for definitional knowledge that users and AI agents need to understand Blueprint layers without web searches

## Description
Create a pluggable schema architecture where each Blueprint layer has its own JSON schema file containing field definitions, validation rules, conceptual explanations, and examples. This ensures definitional knowledge is preserved, version-controlled, and accessible to both humans and AI agents.

## Files to Modify/Create
- `schemas/schema.json` - Root schema registry
- `schemas/north-star.schema.json` - Layer 1 schema with metadata
- `schemas/architectural-scope.schema.json` - Layer 2 schema with scope list definitions
- `src/parser/schema-loader.ts` - Schema loading and validation utilities
- `tests/schema-loader.test.ts` - Schema loader unit tests

## Estimated Lines of Code
~95 lines (north-star schema: 30, arch-scope schema: 40, loader: 15, tests: 10)

## Dependencies
None - foundational task

## Implementation Notes
- Use JSON Schema Draft-07 format
- Root schema.json contains registry of all layer schemas
- Each layer schema includes:
  - Standard JSON Schema validation rules
  - Custom metadata fields (methodology, purpose, examples)
  - Scope sizing rules (min/max/optimal)
  - Relationship definitions (requires, extends)
- Schema loader utility loads and caches schemas
- Validation uses schemas to provide helpful error messages
- Schemas should be human-readable and self-documenting

## Acceptance Criteria
- [x] Root schema registry created with layer references
- [x] North star schema migrated from implicit to explicit schema file
- [x] Architectural scope schema defines all six scope lists with metadata
- [x] Schema loader can load and cache schema files
- [x] Unit tests verify schema loading and structure
- [x] Tests pass

## Status
[COMPLETED] - 2025-12-18
Actual lines: 284 (schema.json: 20, north-star.schema.json: 62, architectural-scope.schema.json: 124, loader: 30, tests: 48)
Note: Architectural scope schema is larger than estimated due to comprehensive metadata for all six scope lists
Commit: [will be added by committer agent]
