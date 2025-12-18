# Task: Create Architectural Scope DSL Specification

## User Story Reference
User Story #1: As a business analyst, I want to define architectural scope using the six scope lists
User Story #4: As a product strategist, I want the DSL to be intuitive and easy to write

## Description
Create comprehensive DSL specification document that defines the YAML format for architectural scope files, including the six scope lists (What, How, Where, Who, When, Why), validation rules, and relationship to north star.

## Files to Modify/Create
- `docs/architectural-scope-dsl-spec.md` - Complete DSL specification

## Estimated Lines of Code
~85 lines

## Dependencies
- Task 001 (schema system - reference schemas in spec)

## Implementation Notes
- Document YAML structure with all six scope lists
- Include the 7±2 principle (3-12 items per list)
- Explain north star reference requirement
- Provide examples for each scope list type
- Document the Why list special structure (mission + goals)
- Reference Ronald Ross and Zachman Framework methodologies
- Include validation rules and error messages
- Show complete example file
- Link to schema files for technical details

## Acceptance Criteria
- [x] Specification covers all six scope lists
- [x] YAML format clearly documented with examples
- [x] Validation rules explained (item counts, north star reference)
- [x] Relationship to north star layer documented
- [x] Complete example provided
- [x] References to methodology sources included

## Status
[COMPLETED] - 2025-12-18
Actual lines: 263 (larger than estimated due to comprehensive examples and complete example file)
Commit: [will be added by committer agent]
