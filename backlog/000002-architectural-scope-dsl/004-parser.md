# Task: Implement Architectural Scope Parser

## User Story Reference
User Story #1: As a business analyst, I want to define architectural scope using the six scope lists
User Story #2: As a solution architect, I want to reference the north star and build upon it

## Description
Implement YAML parser for architectural scope files that loads, parses, and validates architectural scope structure including north star reference validation.

## Files to Modify/Create
- `src/parser/index.ts` - Add parseArchitecturalScope function
- `tests/parser.test.ts` - Add architectural scope parser tests

## Estimated Lines of Code
~40 lines (parser: 20, tests: 20)

## Dependencies
- Task 001 (schema system)
- Task 003 (TypeScript types)

## Implementation Notes
- Follow same pattern as parseNorthStar function
- Use js-yaml to load YAML file
- Load architectural scope schema for validation
- Parse all six optional scope lists
- Handle special Why list structure (mission + goals)
- Return typed ArchitecturalScope object
- Throw helpful errors for invalid YAML or structure
- Tests should cover:
  - Valid architectural scope with all lists
  - Valid with subset of lists (optional nature)
  - Invalid YAML syntax
  - Missing required fields
  - Invalid scope list structures

## Acceptance Criteria
- [ ] parseArchitecturalScope function loads and parses YAML
- [ ] Returns properly typed ArchitecturalScope object
- [ ] Handles all six scope lists correctly
- [ ] Handles optional lists (some may be undefined)
- [ ] Special Why list structure parsed correctly
- [ ] Clear error messages for invalid input
- [ ] Unit tests cover valid and invalid cases
- [ ] Tests pass (5+ test cases)
