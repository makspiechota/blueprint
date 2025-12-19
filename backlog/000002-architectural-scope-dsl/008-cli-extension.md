# Task: Extend CLI for Architectural Scope

## User Story Reference
User Story #1: As a business analyst, I want to define architectural scope using the six scope lists
User Story #5: As a collaborative team, I want to version control architectural scope alongside the north star

## Description
Extend the existing CLI tool to handle architectural scope files, including validation and combined visualization with north star.

## Files to Modify/Create
- `src/index.ts` - Add architectural scope commands and combined visualize
- `tests/cli.test.ts` - Add CLI tests for new commands

## Estimated Lines of Code
~45 lines (CLI additions: 25, tests: 20)

## Dependencies
- Task 004 (parser)
- Task 005 (validator)
- Task 006 (visualization)

## Implementation Notes
- Extend `validate` command to detect and validate architectural scope files
- Extend `visualize` command to generate combined visualization when both files present
- Auto-detection:
  - If input is architectural-scope.yaml, load referenced north star
  - If input is north-star.yaml, check for architectural-scope.yaml in same dir
  - Generate combined visualization if both files available
  - Generate single-layer visualization if only one file
- New command options:
  - `--layer=north-star|architectural-scope|combined` to force specific view
- Colored output:
  - Green: Validation success, optimal scope size
  - Yellow: Warnings (scope size outside 3-12 range)
  - Red: Validation errors
- Error handling:
  - Clear messages for missing north star references
  - Helpful suggestions for fixing validation errors

## Acceptance Criteria
- [x] Validate command handles architectural scope files
- [x] Visualize command generates combined visualization
- [x] Auto-detection finds both layers when present
- [ ] Layer option allows forcing specific view (deferred - not in MVP)
- [x] Colored output for validation results and warnings
- [x] Clear error messages with helpful suggestions
- [x] Integration tests verify command execution
- [x] Tests pass (6 test cases)

## Status
[COMPLETED] - 2025-12-18
Actual lines: ~133 (implementation: 67, tests: 64, extra fixtures: 2)
All 34 tests passing (31 existing + 3 new)
Note: Layer option deferred to future iteration
Commit: a1bbd0f
PR: #19
