# Task: Generate TypeScript Types for AAARR Metrics

## User Story Reference
- As an AI agent, I want to validate that Policy Charter KPIs link to AAARR metrics so that all goals are measurable

## Description
Generate TypeScript types from the AAARR metrics schema to enable type-safe access to AAARR data in code.

## Files to Modify/Create
- `src/parser/types.generated.ts` - Auto-generated (via npm run generate-types)
- `src/parser/types.ts` - Add export for AARRRMetrics type

## Estimated Lines of Code
~1 line (export statement)

## Dependencies
- Task 001: Schema must exist

## Implementation Notes

### Run Type Generator

```bash
npm run generate-types
```

This runs `scripts/generate-types.js` which uses `dtsgenerator` to convert JSON schemas to TypeScript interfaces.

### Export Clean Type Name

Add to `src/parser/types.ts`:
```typescript
export type AARRRMetrics = Schemas.AARRRMetrics;
```

### Expected Generated Types

The generator will create:
- `AARRRMetrics` - Main interface
- `AARRRMetrics.Definitions.AARRRStage`
- `AARRRMetrics.Definitions.Metric`
- `AARRRMetrics.Definitions.MetricValue`
- `AARRRMetrics.Definitions.GapValue`

### Testing

Verify types compile:
```bash
npm run build
```

## Acceptance Criteria
- [x] npm run generate-types executes successfully
- [x] AARRRMetrics type exported from types.ts
- [x] TypeScript compiles without errors
- [x] Generated types include all schema definitions
- [x] Types support all 5 AAARR stages
- [x] MetricValue type includes rate/period, amount/currency, percentage, imported_from
- [x] GapValue type includes calculated difference fields

## Status
✅ COMPLETED - 2025-12-22

**Actual lines:** 1 line (export statement)
**Generated:** 48 lines (auto-generated types)
**Estimated:** ~1 line
**Variance:** Exact match

**Files Modified:**
- `src/parser/types.ts` - Added AARRRMetrics export (+1 line)
- `src/parser/types.generated.ts` - Auto-generated AAARR types (+48 lines)

**Generated Types:**
- `AaarrMetrics` - Main interface with all 5 AAARR stages
- `AaarrMetrics.Definitions.AARRRStage` - Stage structure with stage_goal and metrics
- `AaarrMetrics.Definitions.Metric` - Metric with id, name, target, current, gap
- `AaarrMetrics.Definitions.MetricValue` - Structured types (rate/period, amount/currency, percentage, imported_from)
- `AaarrMetrics.Definitions.GapValue` - Calculated differences (rate, amount, percentage)

**TypeScript Compilation:** ✅ Success (no errors)

**Commit:** [will be added by committer agent]
