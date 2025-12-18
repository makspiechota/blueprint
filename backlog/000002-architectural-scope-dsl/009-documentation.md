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
- [ ] README includes architectural scope in overview
- [ ] User guide explains two-layer structure
- [ ] Architectural scope guide comprehensively covers the DSL
- [ ] Six scope lists explained with examples
- [ ] Tutorial walks through creating architectural scope
- [ ] Troubleshooting covers common architectural scope issues
- [ ] Documentation is well-organized and easy to navigate
- [ ] Links between docs work correctly
