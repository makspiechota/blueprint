# Task: Generate TypeScript Types

## User Story Reference
- As a developer, I want TypeScript interfaces generated from schemas so that I can have type safety when parsing and validating

## Description
Run the type generation script to create TypeScript interfaces from the new policy-charter.schema.json. This will generate PolicyCharter, Goal, Tactic, Policy, Risk, and KPI types.

## Files to Modify/Create
- `src/parser/types.generated.ts` - Regenerated with new types
- `src/parser/types.ts` - Add PolicyCharter type export

## Estimated Lines of Code
~50 lines (in types.generated.ts)

## Dependencies
- 001-create-schema.md (schema must exist first)

## Implementation Notes

### Type Generation Process

1. Ensure `schemas/policy-charter.schema.json` exists and is valid
2. Run `node scripts/generate-types.js`
3. Verify generated types in `src/parser/types.generated.ts`
4. Add export to `src/parser/types.ts`:
   ```typescript
   export type PolicyCharter = Schemas.PolicyCharter;
   ```

### Expected Generated Types

The script should generate interfaces like:
- `PolicyCharter` - Main schema interface
- `Goal` - With id, title, addresses, aaarr_impact, etc.
- `Tactic` - With id, title, drives_policies
- `Policy` - With id, title, rule, driven_by_tactic, enforcement, brackets
- `PolicyBracket` - With condition, rule
- `Risk` - With id, description, probability, impact, mitigation
- `KPI` - With id, name, target, current, measurement_frequency, justification
- `KPIValue` - With rate, amount, percentage

### Verification

After generation, verify:
- All entity types have correct properties
- Array types use proper TypeScript array syntax
- Optional properties are marked with `?`
- Enum types use union types (e.g., "mandatory" | "guideline")

## Acceptance Criteria
- [ ] scripts/generate-types.js runs without errors
- [ ] PolicyCharter type generated in types.generated.ts
- [ ] All entity types (Goal, Tactic, Policy, Risk, KPI) properly typed
- [ ] KPIValue and PolicyBracket types generated
- [ ] src/parser/types.ts exports PolicyCharter type
- [ ] TypeScript compilation passes with new types