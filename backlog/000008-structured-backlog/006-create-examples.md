# Task: Create Example Backlog Feature Files

## User Story Reference
All user stories - provides concrete examples of how structured backlog features work.

## Description
Create example backlog feature YAML files demonstrating realistic features with complete traceability links, calculated priorities, and dependencies.

## Files to Modify/Create
- `examples/backlog-feature-1.yaml` - High-priority feature example
- `examples/backlog-feature-2.yaml` - Medium-priority feature example
- `examples/backlog-feature-3.yaml` - Low-priority feature example
- `examples/README.md` - Update with backlog feature examples

## Estimated Lines of Code
~150 lines (across example files)

## Dependencies
Task 001 (schema), Task 002 (priority algorithm)

## Implementation Notes
- Create 3 example features showing different priority levels
- Include complete traceability: policy_charter, arch_scope, aaarr_impact links
- Demonstrate dependency relationships (blocks/blocked_by)
- Show priority calculation breakdown
- Include realistic user stories and acceptance criteria
- One feature should demonstrate risk mitigation
- One feature should show dependency chains

## Acceptance Criteria
- [ ] Example files parse and validate successfully
- [ ] Features show different priority levels (high/medium/low)
- [ ] Complete traceability links to all business layers
- [ ] Dependency relationships demonstrated
- [ ] Priority breakdowns included and accurate
- [ ] Realistic user stories and acceptance criteria
- [ ] Risk mitigation example included
- [ ] README.md updated with backlog feature examples