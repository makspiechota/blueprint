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
- [ ] Validates all required fields present
- [ ] Type must be "architectural-scope"
- [ ] Date format validation (ISO)
- [ ] North star reference file must exist
- [ ] North star reference must be valid north star file
- [ ] Scope lists validated for 3-12 items (with warnings)
- [ ] Each scope item has title and description
- [ ] Why list mission/goals structure validated
- [ ] Clear error messages for all validation failures
- [ ] Unit tests cover all validation scenarios
- [ ] Tests pass (8+ test cases)
