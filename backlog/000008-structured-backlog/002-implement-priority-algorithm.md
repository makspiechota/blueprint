# Task: Implement Priority Calculation Algorithm v1.0

## User Story Reference
User Story 1: "As a product manager, I want features auto-prioritized by AAARR impact so that I focus on high-value work"

## Description
Implement priority calculation algorithm v1.0 that calculates feature priority scores based on AAARR impact, risk mitigation, dependency weight, and policy alignment.

## Files to Modify/Create
- `src/calculator/priority-calculator.ts` - Priority calculation logic
- `src/calculator/index.ts` - Export priority calculator

## Estimated Lines of Code
~80 lines

## Dependencies
Task 001 (schema creation)

## Implementation Notes
- Implement algorithm v1.0 as specified in feature.md
- AAARR impact: metric weight × expected change (0-50 points)
- Risk mitigation: probability × impact scoring (0-30 points)
- Dependency weight: number of blocked features (0-20 points)
- Policy alignment: bonus for mandatory policies (0-10 points)
- Store algorithm version for future changes
- Return breakdown for transparency

## Acceptance Criteria
- [ ] AAARR impact calculation implemented (metric weight × expected change)
- [ ] Risk mitigation scoring implemented (probability × impact)
- [ ] Dependency weight calculation implemented (blocked features count)
- [ ] Policy alignment bonus implemented (mandatory policies)
- [ ] Total score capped at 100 points
- [ ] Priority breakdown returned for transparency
- [ ] Algorithm version stored (v1.0)