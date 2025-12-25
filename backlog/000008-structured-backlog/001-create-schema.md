# Task: Create Backlog Feature Schema

## User Story Reference
Addresses all user stories by establishing the data structure for structured backlog features.

## Description
Create JSON Schema for backlog feature YAML files supporting feature metadata, traceability links, priority information, dependencies, and traditional feature content.

## Files to Modify/Create
- `schemas/backlog-feature.schema.json` - Complete schema definition
- `schemas/schema.json` - Register backlog-feature layer

## Estimated Lines of Code
~200 lines

## Dependencies
None

## Implementation Notes
- Use semantic IDs: `feat.{semantic-name}` (not numeric)
- Include all fields from success criteria: metadata, traceability, priority, dependencies
- Support traditional fields: user_stories, acceptance_criteria, estimated_effort
- Follow existing schema patterns from other layers

## Acceptance Criteria
- [ ] Schema validates feature metadata (id, title, status, description)
- [ ] Schema supports traceability links (policy_charter, arch_scope, aaarr_impact)
- [ ] Schema supports priority fields (score, breakdown, last_calculated, needs_recalculation)
- [ ] Schema supports dependencies (blocks, blocked_by)
- [ ] Schema supports traditional fields (user_stories, acceptance_criteria, estimated_effort)
- [ ] Schema registered in schema registry
- [ ] Schema follows JSON Schema Draft-07
- [ ] Schema includes semantic ID pattern validation