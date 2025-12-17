# Task: Implement DSL Parser

## User Story Reference
User Story #1: As a product strategist, I want to define my north star using a simple DSL so that I can capture strategic goals in a structured, version-controlled format
User Story #5: As a collaborative team, I want to version control our north star definition

## Description
Implement the parser that reads North Star DSL files (YAML format) and converts them into a structured JavaScript object representation. Include validation to ensure the DSL follows the specification.

## Files to Modify/Create
- `src/parser/index.js` - Main parser logic
- `src/parser/validator.js` - Schema validation
- `src/parser/schema.js` - JSON schema definition
- `tests/parser.test.js` - Parser unit tests

## Estimated Lines of Code
~95 lines (parser: ~40, validator: ~30, schema: ~15, tests: ~10)

## Dependencies
- Task 001 (DSL specification)
- Task 002 (project structure)

## Implementation Notes
- Use `js-yaml` to parse YAML files
- Implement validation against schema:
  - Required fields: version, title, goals
  - Each goal must have: id, title
  - Validate hierarchical structure (no circular references)
  - IDs must be unique
- Return structured object:
  ```javascript
  {
    metadata: { version, title, ... },
    goals: [
      { id, title, description, children: [...] }
    ]
  }
  ```
- Provide clear error messages for invalid DSL
- Handle file reading errors gracefully
- Export main function: `parseNorthStar(filePath)`

## Acceptance Criteria
- [ ] Parser successfully reads valid YAML DSL files
- [ ] Validation catches invalid structures
- [ ] Clear error messages for syntax errors
- [ ] Returns structured goal hierarchy
- [ ] Unit tests cover valid and invalid inputs
- [ ] Tests pass
