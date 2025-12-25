# Task: Create Orchestration Engine

## User Story Reference
1. As a business leader, I want a tabbed view of all layers so that I can see the complete picture
4. As an auditor, I want to run full validation and get a report of all issues so that I can ensure compliance

## Description
Create a new orchestration engine that loads and parses all referenced layer files from business.yaml v2.0, validates each layer individually, and provides a unified interface for accessing all business layers.

## Files to Modify/Create
- `src/parser/index.ts` - Add parseOrchestratedBusiness() function
- `src/parser/orchestration.ts` - New file for orchestration logic
- `src/parser/types.ts` - Add OrchestratedBusiness type

## Estimated Lines of Code
~150 lines

## Dependencies
001-update-business-schema.md

## Implementation Notes
- Create OrchestratedBusiness interface with parsed data for all layers
- Implement loading logic that resolves relative paths
- Add error handling for missing referenced files
- Follow existing parser patterns (load, validate, return typed data)
- Support optional layer references

## Acceptance Criteria
- [ ] parseOrchestratedBusiness() loads all referenced layers
- [ ] Validates each layer individually during loading
- [ ] Returns typed OrchestratedBusiness with all parsed data
- [ ] Handles missing optional layers gracefully
- [ ] Errors on missing required layers