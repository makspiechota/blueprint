# Task: Update Documentation for Architectural Scope

## User Story Reference
All user stories - Ensures users can effectively use the Architectural Scope DSL

## Description
Update project documentation to include architectural scope layer, explaining the concept, usage, and relationship to north star. Add troubleshooting for common issues.

## Files to Modify/Create
- `README.md` - Add architectural scope overview
- `docs/user-guide.md` - Add architectural scope section
- `docs/architectural-scope-guide.md` - Detailed guide (new file)
- `docs/troubleshooting.md` - Add architectural scope issues

## Estimated Lines of Code
~95 lines (README: 15, user-guide: 20, arch-scope-guide: 45, troubleshooting: 15)

## Dependencies
- Task 002 (DSL specification)
- Task 007 (CLI extension)
- Task 008 (example file)

## Implementation Notes
- **README.md** updates:
  - Add architectural scope to features list
  - Quick start example with both layers
  - Reference to architectural scope guide
- **docs/user-guide.md** additions:
  - Explain two-layer Blueprint structure
  - When to use architectural scope
  - How architectural scope builds on north star
  - Combined visualization workflow
- **docs/architectural-scope-guide.md** (new):
  - What is architectural scope (Zachman/Ross methodology)
  - Detailed explanation of six scope lists
  - The 7±2 principle
  - Business mission vs business goals
  - Step-by-step tutorial
  - Best practices
- **docs/troubleshooting.md** additions:
  - Missing north star reference errors
  - Scope list size warnings
  - Combined visualization issues
  - Schema validation errors

## Acceptance Criteria
- [x] README includes architectural scope in overview
- [x] User guide explains two-layer structure
- [x] Architectural scope guide comprehensively covers the DSL
- [x] Six scope lists explained with examples
- [x] Tutorial walks through creating architectural scope
- [x] Troubleshooting covers common architectural scope issues
- [x] Documentation is well-organized and easy to navigate
- [x] Links between docs work correctly

## Status
[COMPLETED] - 2025-12-18
Actual lines: ~309 (README: 65, user-guide: 135, troubleshooting: 80, renames: 1, other: 28)

Changes:
- Updated README with two-layer architecture overview and examples
- Added comprehensive architectural scope section to user guide
- Renamed architectural-scope-dsl-spec.md to architectural-scope-guide.md
- Added architectural scope troubleshooting section with common issues
- Updated all documentation cross-references
- All documentation well-organized and easy to navigate

Commit: 77e0458
PR: #20
