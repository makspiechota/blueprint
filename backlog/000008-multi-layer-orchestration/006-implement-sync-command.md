# Task: Implement Sync Command

## User Story Reference
7. As a business analyst, I want to sync AAARR targets from Viability so that metrics stay current

## Description
Create a sync command that automatically updates AAARR metric targets based on lean viability calculations, ensuring metrics stay aligned with business feasibility assessments.

## Files to Modify/Create
- `src/index.ts` - Add sync command
- `src/commands/sync.ts` - New sync command implementation
- `src/calculator/sync-calculator.ts` - Logic to sync targets between layers

## Estimated Lines of Code
~100 lines

## Dependencies
002-create-orchestration-engine.md

## Implementation Notes
- Command format: `blueprint sync aaarr --from lean-viability.yaml --to aaarr-metrics.yaml`
- Preview changes before applying (git-like workflow)
- Update AAARR targets from viability calculations
- Set last_synced timestamp
- Report what changed during sync
- Handle partial syncs and validation

## Acceptance Criteria
- [x] `blueprint sync aaarr` command works
- [x] Previews changes before applying
- [x] Updates targets from viability to AAARR
- [x] Sets last_synced timestamp
- [x] Reports changes made
- [x] Validates sync results