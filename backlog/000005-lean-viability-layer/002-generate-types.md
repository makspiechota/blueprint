# Task: Generate TypeScript Types from Schema

## User Story Reference
- As an AI agent, I want to parse viability calculations so that I can generate consistent AAARR metric targets

## Description
Run the existing type generation script to create TypeScript types from the new lean-viability schema. This will update `src/parser/types.generated.ts` to include the `LeanViability` interface and related types.

## Files to Modify/Create
- `src/parser/types.generated.ts` - Will be auto-generated/updated

## Estimated Lines of Code
~45 lines (generated)

## Dependencies
- Task 001: Schema must exist before types can be generated

## Implementation Notes

### Generation Command
Use existing npm script:
```bash
npm run generate-types
```

This runs `scripts/generate-types.js` which:
1. Reads all `.schema.json` files from `schemas/` directory
2. Uses `dtsgenerator` to convert JSON schemas to TypeScript interfaces
3. Writes to `src/parser/types.generated.ts`

### Expected Types
The generator should create interfaces for:
- `LeanViability` - main type
- `CurrencyAmount` - nested type for amounts with currency
- `RatePeriod` - nested type for rates with periods
- `TimeHorizon` - nested type for time durations

### Validation
After generation, verify that:
1. `LeanViability` interface is exported
2. All nested types are properly defined
3. Enums are correctly represented (currency, period)
4. No compilation errors in `src/parser/types.generated.ts`

## Acceptance Criteria
- [ ] npm run generate-types completes successfully
- [ ] src/parser/types.generated.ts includes LeanViability interface
- [ ] Structured types (CurrencyAmount, RatePeriod, TimeHorizon) are generated
- [ ] TypeScript compiles without errors (npm run build)
- [ ] Generated types match schema structure
