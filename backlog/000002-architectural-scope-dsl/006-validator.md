# Task: Implement Architectural Scope Validator

## User Story Reference
User Story #3: As a project manager, I want to validate that each scope list contains 3-12 items
User Story #6: As a product strategist, I want the architectural scope to require a reference to an existing north star

## Description
Implement validation logic for architectural scope files that checks required fields, north star reference existence, scope list sizes (3-12 items), and structural correctness.

## Files to Modify/Create
- `src/parser/validator.ts` - Add validateArchitecturalScope function
- `tests/validator.test.ts` - Add validator unit tests

## Estimated Lines of Code
~55 lines (validator: 35, tests: 20)

## Dependencies
- Task 001 (schema system)
- Task 003 (TypeScript types)
- Task 004 (parser)

## Implementation Notes
- Required field validation: type, version, last_updated, title, north_star_ref
- Type must be "architectural-scope"
- Date format validation (ISO: YYYY-MM-DD)
- North star reference validation:
  - Check if referenced file exists using fs.existsSync
  - Load and validate it's a valid north star file
  - Clear error if north star missing
- Scope list validation:
  - Each defined list must have 3-12 items (warn if outside range)
  - At least one scope list should be defined (warn if none)
  - Each scope item must have title and description
- Why list special validation:
  - If mission object exists, validate structure (action, service, beneficiary)
  - Goals array if present
- Soft validation for item counts (warn but don't fail for <3 or >12)
- Use schema definitions for validation rules

## Acceptance Criteria
- [x] Validates all required fields present (via schema validation in task 005)
- [x] Type must be "architectural-scope" (via schema validation in task 005)
- [x] Date format validation (ISO) (via schema validation in task 005)
- [x] North star reference file must exist
- [x] North star reference must be valid north star file
- [x] Scope lists validated for 3-12 items (with warnings)
- [x] Each scope item has title and description (via schema validation in task 005)
- [x] Why list mission/goals structure validated (generic scope list validation)
- [x] Clear error messages for all validation failures
- [x] Unit tests cover all validation scenarios
- [x] Tests pass (7 test cases)

## Status
[COMPLETED] - 2025-12-18
Actual lines: 100 (validator: 51, tests: 149)
All 28 tests passing (21 existing + 7 new)
Note: Schema validation implemented in task 005, this task adds business rules
Commit: [will be added by committer agent]
