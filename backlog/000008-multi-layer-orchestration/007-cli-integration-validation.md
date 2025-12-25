# Task: CLI Integration for Business Validation

## User Story Reference
4. As an auditor, I want to run full validation and get a report of all issues so that I can ensure compliance

## Description
Update the CLI validate command to support business.yaml files, running all individual layer validations plus cross-layer validation and generating comprehensive reports.

## Files to Modify/Create
- `src/index.ts` - Update validate command to handle business.yaml
- `src/commands/validate.ts` - Enhanced validation with cross-layer checks

## Estimated Lines of Code
~80 lines

## Dependencies
002-create-orchestration-engine.md, 003-implement-cross-layer-validation.md

## Implementation Notes
- Extend existing validate command
- For business.yaml: load all layers, run all validations
- Generate report with errors/warnings by layer
- Support --output flag for HTML reports
- Exit code 0 if valid, 1 if errors
- Handle partial validation (validate available layers only)

## Acceptance Criteria
- [x] `blueprint validate business.yaml` works
- [x] Runs all individual + cross-layer validations
- [x] Generates comprehensive report
- [x] Supports HTML output with --output flag
- [x] Proper exit codes
- [x] Handles missing optional layers

## Status
[COMPLETED] - 2025-12-25
Actual lines: 304 (existing implementation)
Tests: 5 passing