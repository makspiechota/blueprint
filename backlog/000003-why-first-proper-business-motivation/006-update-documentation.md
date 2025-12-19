# Task: Update Documentation for Business Motivation Framework

## User Story Reference
All user stories (ensures users understand the framework)

## Description
Update all documentation to explain Ronald Ross's business motivation framework, WHY-first ordering, mission structure, capability-specific goals vs enterprise strategy, and the new validation rules.

## Files to Modify/Create
- `README.md` - Update quick start examples with new WHY structure
- `docs/user-guide.md` - Add business motivation framework explanation
- `docs/architectural-scope-guide.md` - Update WHY section with mission/goals
- `docs/troubleshooting.md` - Add troubleshooting for new validation rules

## Estimated Lines of Code
~95 lines (README: 20, user-guide: 40, arch-scope-guide: 25, troubleshooting: 10)

## Dependencies
- Task 001-005 (implementation complete for documentation accuracy)

## Implementation Notes

### README.md Updates
Update the architectural scope example:
```yaml
why:
  mission:
    action: "to provide"
    service: "online retail shopping experience"
    beneficiary: "customers worldwide"
  goals:
    - title: "To increase customer satisfaction"
      description: "..."
```

### docs/user-guide.md Updates
Add section "Understanding Business Motivation (WHY-First)":
- Explain Ronald Ross's framework
- Business capability concept
- Mission vs goals distinction
- Capability goals vs enterprise strategy (North Star)
- Why WHY comes first
- The three mission components
- Goals starting with "To"

### docs/architectural-scope-guide.md Updates
Update WHY section:
- New structure with mission + goals
- Mission requirements (3 components)
- Goals requirements ("To" prefix, ongoing nature)
- Examples of good vs bad goals
- Capability-specific vs enterprise-wide distinction

### docs/troubleshooting.md Updates
Add new error scenarios:
- "Mission missing required component: action/service/beneficiary"
- "Goal title must start with 'To'"
- "WHY is required for architectural scope"
- Warning: "Goal appears to be project objective"
- Warning: "Goal appears enterprise-wide"

## Acceptance Criteria
- [x] README examples use new WHY structure
- [x] User guide explains business motivation framework
- [x] User guide explains capability vs enterprise distinction
- [x] User guide explains WHY-first ordering
- [x] Architectural scope guide updated with mission/goals structure
- [x] Examples of good capability-specific goals provided
- [x] Troubleshooting covers new validation errors
- [x] All documentation references Ross's methodology
- [x] Documentation clarifies North Star (enterprise) vs WHY (capability)

## Status
[COMPLETED] - 2025-12-19
Actual lines: 153 (README: 28, user-guide: 74, arch-scope-guide: 88, troubleshooting: 63)
All 49 tests passing
All documentation updated with WHY-first framework
Examples demonstrate proper mission and capability-specific goals
