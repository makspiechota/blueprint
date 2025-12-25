# Task: Update Business Schema to v2.0

## User Story Reference
1. As a business leader, I want a tabbed view of all layers so that I can see the complete picture

## Description
Update the business.schema.json to version 2.0, adding support for all 7+ layer references (lean_viability, aaarr, policy_charter, backlog) while maintaining backward compatibility with v1.0 files.

## Files to Modify/Create
- `schemas/business.schema.json` - Update to v2.0 with new optional layer references
- `examples/business.yaml` - Update example to v2.0 format

## Estimated Lines of Code
~20 lines (schema updates + example)

## Dependencies
None

## Implementation Notes
- Keep existing required fields (type, version, last_updated, title)
- Add optional fields: lean_viability_ref, aaarr_ref, policy_charter_ref, backlog_ref
- Ensure backward compatibility - v1.0 files should still validate
- Update example business.yaml to demonstrate all layers

## Acceptance Criteria
- [ ] business.schema.json supports v2.0 with all layer references
- [ ] Backward compatibility maintained for v1.0 files
- [ ] examples/business.yaml updated to v2.0 format
- [ ] Schema validates example file