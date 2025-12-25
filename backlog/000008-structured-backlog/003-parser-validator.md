# Task: Add Parser and Validator Functions

## User Story Reference
User Story 5: "As an AI agent, I want to validate that every feature links to business layers so that nothing is orphaned"

## Description
Add parseBacklogFeature and validateBacklogFeature functions with three-level validation: reference existence, type consistency, and logical consistency.

## Files to Modify/Create
- `src/parser/index.ts` - Add parseBacklogFeature function
- `src/parser/validator.ts` - Add validateBacklogFeature and validateBacklogFeatureBusinessRules functions
- `src/parser/types.ts` - Add BacklogFeature type export

## Estimated Lines of Code
~150 lines

## Dependencies
Task 001 (schema), Task 002 (priority algorithm)

## Implementation Notes
- Level 1: Validate references exist (policy_charter, arch_scope, aaarr_metrics files)
- Level 2: Validate type consistency (references point to correct entity types)
- Level 3: Logical consistency (feature impact aligns with linked goal impact)
- Include priority staleness validation (>30 days old → needs_recalculation)
- Implement circular dependency detection for blocks/blocked_by relationships
- Validate that orphaned features (no business layer links) are flagged as errors

## Acceptance Criteria
- [ ] parseBacklogFeature function parses YAML to BacklogFeature type
- [ ] Level 1 validation: All referenced files exist
- [ ] Level 2 validation: References point to correct entity types
- [ ] Level 3 validation: Feature impact aligns with linked goal impact
- [ ] Priority staleness validation (>30 days → needs_recalculation)
- [ ] Circular dependency detection implemented
- [ ] Orphaned features flagged as validation errors
- [ ] BacklogFeature type exported from types.ts