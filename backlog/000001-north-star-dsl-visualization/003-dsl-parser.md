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
  - Required fields: type, version, last_updated, title, vision, problem, solution, strategic_goals
  - Type must be: "north-star"
  - Version must be valid semver
  - last_updated must be ISO date (YYYY-MM-DD)
  - strategic_goals must be array with title and description
- Return structured object:
  ```javascript
  {
    type: "north-star",
    version: "2.0",
    last_updated: "2025-01-28",
    title: "Software Factory",
    vision: "...",
    problem: "...",
    solution: "...",
    strategic_goals: [
      { title: "...", description: "..." }
    ]
  }
  ```
- Provide clear error messages for invalid DSL
- Handle file reading errors gracefully
- Export main function: `parseNorthStar(filePath)`

## Acceptance Criteria
- [ ] Parser successfully reads valid YAML DSL files
- [ ] Validation catches invalid structures (missing required fields)
- [ ] Clear error messages for syntax errors
- [ ] Returns structured north star object with all properties
- [ ] Unit tests cover valid and invalid inputs
- [ ] Tests pass
