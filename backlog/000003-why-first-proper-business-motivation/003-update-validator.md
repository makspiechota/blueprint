# Task: Update Validator with WHY Business Rules

## User Story Reference
User Story #3: As a strategist, I want to distinguish business goals (ongoing objectives) from project objectives
User Story #6: As a team member, I want validation to ensure exactly one business mission exists

## Description
Update the validator to add business rules for the new WHY structure. Add soft validation warnings for project-like wording in goals and enterprise-wide goals that should belong in North Star.

## Files to Modify/Create
- `src/parser/validator.ts` - Add WHY-specific validation rules
- `tests/validator.test.ts` - Add tests for new validation rules

## Estimated Lines of Code
~75 lines (validator: 40, tests: 35)

## Dependencies
- Task 001 (schema updated)
- Task 002 (types regenerated)

## Implementation Notes

Update `validateArchitecturalScopeBusinessRules` function:

1. **WHY Required Validation**: Check that WHY exists (schema handles structure)
2. **Mission Component Validation**: Verify mission.action, mission.service, mission.beneficiary are non-empty
3. **Goals "To" Prefix Validation**: Schema already validates pattern, but add helpful error message
4. **Project Objective Detection** (soft warning):
   - Check goal title/description for words: "implement", "migrate", "upgrade", "deploy", "install", "create", "build", "develop", "add"
   - Warning: "Goal '{title}' may be a project objective rather than ongoing business goal"
5. **Enterprise-wide Goal Detection** (soft warning):
   - Check for overly broad wording without capability context
   - Warning: "Goal '{title}' appears enterprise-wide; capability goals should be specific to this capability"

Update SCOPE_LISTS constant to use WHY-first order:
```typescript
const SCOPE_LISTS = ['why', 'what', 'how', 'where', 'who', 'when'] as const;
```

**Edge Cases**:
- WHY with mission but no goals (valid)
- Empty strings in mission components (should fail)
- Goals not starting with "To" (schema fails, but provide clear message)

## Acceptance Criteria
- [ ] Validates WHY exists and has mission
- [ ] Validates mission has all three components
- [ ] Validates mission components are non-empty
- [ ] Soft warning for project-like wording in goals
- [ ] Soft warning for enterprise-wide sounding goals
- [ ] SCOPE_LISTS updated to WHY-first order
- [ ] Tests cover all validation scenarios
- [ ] All tests pass (existing + new)
