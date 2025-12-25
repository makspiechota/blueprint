# Task: Update Documentation

## User Story Reference
- As a new user, I want to understand the Policy Charter framework so that I can create effective operational policies
- As a strategist, I want documentation explaining Ronald Ross's methodology so that I can apply it correctly

## Description
Update docs/ with Policy Charter guide and user guide sections explaining the framework, usage patterns, and examples.

Follow TDD: write tests first, then implement.

## Files to Modify/Create
- `docs/policy-charter-guide.md` - New comprehensive guide
- `docs/user-guide.md` - Add Policy Charter section
- `README.md` - Mention Policy Charter layer

## Estimated Lines of Code
~150 lines

## Dependencies
- 005-create-example.md (example must exist for documentation)

## Implementation Notes

### Policy Charter Guide

Create `docs/policy-charter-guide.md` covering:

1. **Introduction to Ronald Ross Framework**
   - Goals → Tactics → Policies hierarchy
   - Means-ends relationships
   - Risk management integration
   - KPI justification

2. **Entity Definitions**
   - Goals: Operational objectives addressing Arch Scope
   - Tactics: Courses of action to achieve goals
   - Policies: Business rules driven by tactics
   - Risks: Threats with mitigation strategies
   - KPIs: Measurements justified by AAARR metrics

3. **Graduated Policy Brackets**
   - Threshold-based rules
   - Condition-rule pairs
   - Enforcement levels (mandatory vs guideline)

4. **Semantic ID Conventions**
   - pc.goal.*, pc.tactic.*, pc.policy.*, pc.risk.*, pc.kpi.*

5. **Three-Level Validation**
   - Reference existence
   - Type consistency
   - Logical consistency

### User Guide Updates

Add to `docs/user-guide.md`:
- Policy Charter in the layer hierarchy
- Creating policy-charter.yaml files
- CLI commands for validation and visualization
- Integration with other layers

### README Updates

Add Policy Charter to layer descriptions and examples.

### Examples and Patterns

Include code examples from the example file, showing:
- Complete policy charter structure
- Graduated brackets usage
- Cross-layer references
- Risk mitigation patterns

## Acceptance Criteria
- [ ] docs/policy-charter-guide.md created with comprehensive framework explanation
- [ ] docs/user-guide.md updated with Policy Charter usage instructions
- [ ] README.md mentions Policy Charter layer
- [ ] Documentation explains Ronald Ross methodology
- [ ] Examples from policy-charter.yaml included
- [ ] CLI usage documented
- [ ] Cross-layer integration explained