# Feature: WHY-First Architecture with Proper Business Motivation Framework

## Problem

The current architectural scope implementation has two critical issues that violate Ronald Ross's business architecture methodology:

1. **WHY is positioned last**: Currently WHY appears as the sixth scope list, but Ross emphasizes that understanding motivation (WHY) is the foundation for all other architectural decisions. Without establishing WHY first, teams define WHAT, HOW, WHERE, WHO, and WHEN without clear understanding of business purpose.

2. **Business Goals are incorrectly modeled**: The current implementation treats business goals as simple list items like other scope dimensions. This fails to capture Ross's distinction between:
   - **Business Mission** (what the capability does in day-to-day operations: action + service + beneficiary)
   - **Business Goals** (ongoing effects to achieve continuously, not project objectives)
   - The relationship: mission is achieved *directly* through operations; goals are achieved *indirectly* by executing the mission

**Important Context**: In Ross's framework, a **business capability** is a distinct unit of business functionality (e.g., "E-Commerce Platform", "Customer Support System"). Each architectural scope document describes ONE business capability. The business goals defined in WHY are **capability-specific goals**, not enterprise-wide strategic goals (those belong in the North Star). This distinction is critical: North Star defines enterprise-level strategy, while each architectural scope's WHY defines that specific capability's mission and goals.

This leads to confusion between project objectives and true business goals, and fails to represent the strategic foundation properly.

## Users

- **Business Analysts**: Need to properly define business motivation before scope
- **Product Managers**: Need to articulate WHY before WHAT
- **Architects**: Need to ensure architectural decisions trace to clear business motivation
- **Stakeholders**: Need to understand and agree on business purpose first

## User Stories

1. As a business analyst, I want WHY to be the first scope dimension so that I establish business motivation before defining entities, processes, and other scope elements

2. As a product manager, I want to define a single business mission (action + service + beneficiary) so that the core capability responsibility is clear

3. As a strategist, I want to distinguish business goals (ongoing objectives) from project objectives so that architectural scope focuses on continuous business effects, not temporary initiatives

4. As an architect, I want the business mission to inform all other scope decisions so that WHAT, HOW, WHERE, WHO, and WHEN align with WHY

5. As a stakeholder, I want to see WHY prominently displayed first in visualizations so that business purpose is immediately clear

6. As a team member, I want validation to ensure exactly one business mission exists so that the capability has a single clear responsibility

7. As a business analyst, I want to define multiple business goals that relate to the mission so that strategic objectives are explicit

## Expected Behavior

### YAML Structure

WHY becomes the first scope list with special structure:

```yaml
type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "E-Commerce Platform"
north_star_ref: "north-star.yaml"

why:
  mission:
    action: "to provide"
    service: "online retail shopping experience"
    beneficiary: "customers worldwide"
  goals:
    - title: "To increase customer satisfaction"
      description: "Continuously improve user experience and service quality for this capability"
    - title: "To expand market reach"
      description: "Enable access to products for customers in new geographic regions through this capability"
    - title: "To optimize operational efficiency"
      description: "Reduce costs while maintaining service quality for this capability"

what:
  - title: "Customer Account"
    description: "User profile and preferences"
  # ... rest of scope lists in order

how:
  # ...

where:
  # ...

who:
  # ...

when:
  # ...
```

### Order in All Representations

WHY → WHAT → HOW → WHERE → WHO → WHEN

This order follows Ross's principle: understand motivation first, then define scope accordingly.

### Validation Rules

1. **Business Mission**:
   - Required (exactly one)
   - Must have all three components: action, service, beneficiary
   - Each component must be non-empty string

2. **Business Goals**:
   - Optional (can have 0-N goals)
   - Each goal has title and description
   - Goal title must start with "To" (e.g., "To increase...", "To reduce...")
   - Goals should be ongoing effects, not project objectives (soft validation warning if wording suggests temporary objective)
   - Goals are capability-specific (not enterprise-wide strategic goals)

3. **WHY Positioning**:
   - WHY must be the first scope list in YAML file
   - Parser should warn if WHY appears after other scope lists

### Visualization Changes

**WHY Card - Special Treatment (First Position)**:
- Displayed at top of visualization (before other scope lists)
- Distinct visual styling (different background color, larger size)
- Business Mission prominently displayed with icon
- Shows the three components clearly:
  ```
  🎯 BUSINESS MISSION
  Action: [to provide]
  Service: [online retail shopping experience]
  Beneficiary: [customers worldwide]
  ```
- Business Goals listed below mission as ongoing objectives
- Visual connection showing other scope dimensions support this WHY

**Grid Layout Update**:
- Desktop: WHY card spans full width at top, then 2x3 grid for remaining lists
- Mobile: WHY card first, then other cards stack vertically

## Edge Cases

1. **Missing Business Mission**: Validation should fail if WHY list exists but has no mission
2. **Incomplete Mission**: Validation should fail if mission missing any of: action, service, beneficiary
3. **Empty WHY List**: WHY list can exist with mission but no goals (goals are optional)
4. **No WHY List**: If no WHY list defined, validation should fail (WHY is now required)
5. **WHY Not First**: Parser should warn if WHY appears after other scope lists in YAML
6. **Goals Not Starting with "To"**: Validation should fail if goal title doesn't start with "To" (case-insensitive)
7. **Project Objectives as Goals**: Soft validation warning if goal title/description contains words suggesting temporary project (e.g., "implement", "migrate", "upgrade")
8. **Multiple Missions**: Validation should fail if more than one mission defined (exactly one required)
9. **Old Format Files**: Files with WHY as simple list should be flagged with migration guidance
10. **Enterprise-wide Goals in Capability**: Soft validation warning if goal appears too broad (should reference North Star for enterprise-level strategy)

## Success Criteria

- Business analysts define WHY (mission + goals) before other scope dimensions
- Validation enforces exactly one business mission with three required components
- Validation enforces business goals start with "To"
- Validation distinguishes capability-specific goals from enterprise-wide strategic goals
- Visualization prominently displays WHY at top with special treatment
- Business mission clearly distinguishes action, service, and beneficiary
- Business goals are properly separated from project objectives
- All scope lists appear in correct order (WHY first) in YAML, CLI output, and visualization
- Documentation explains Ross's business motivation framework and capability scope
- Documentation clarifies difference between North Star (enterprise) and capability goals
- Example files demonstrate proper WHY structure with "To" format
- Migration path exists for files with old WHY structure

## Business Value

- **Strategic Alignment**: Ensures all architectural decisions trace back to clear business motivation
- **Methodology Compliance**: Properly implements Ronald Ross's proven business architecture framework
- **Clarity of Purpose**: Business mission statement provides single source of truth for capability responsibility
- **Decision Framework**: Clear business goals enable evaluation of architectural trade-offs
- **Stakeholder Agreement**: Establishing WHY first prevents downstream scope conflicts
- **Avoid Project Confusion**: Distinguishing business goals from project objectives prevents temporary initiatives from driving permanent architecture
- **Foundation for Trade-offs**: Clear goals enable strategic decisions when goals conflict (resource vs capability trade-offs)

## References

- Ronald Ross: "Business Architecture Standard: Understanding Architectural Scope" (https://www.brcommunity.com/articles.php?id=b873)
- Ronald Ross: "Business Architecture Standard: Business Motivation (Part 1)" (https://www.brcommunity.com/articles.php?id=b876)
- Ross principle: "A business capability has exactly one business mission, which identifies what the business capability is responsible for doing in day-to-day operation"
- Ross principle: Business mission is achieved *directly*; business goals are achieved *indirectly* by executing the mission

## Status

[COMPLETED] - 2025-12-19

All 6 tasks completed successfully:
- Task 001: Schema updated with mission + goals structure (PR #23, merged)
- Task 002: Types regenerated (included in Task 001)
- Task 003: Validator updated with WHY business rules (PR #24, merged)
- Task 004: Visualizer updated with WHY-first ordering (PR #25, merged)
- Task 005: Example file updated (PR #26, merged)
- Task 006: Documentation updated (PR #27, merged)

All 49 tests passing
All success criteria met
Feature fully operational
