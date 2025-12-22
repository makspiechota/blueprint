# Task: Add AAARR Parser and Validator

## User Story Reference
- As a product manager, I want to see AAARR metrics with targets and current values so that I can identify the biggest gaps
- As an AI agent, I want to validate that Policy Charter KPIs link to AAARR metrics so that all goals are measurable

## Description
Extend the parser and validator to support aaarr-metrics files. Add validation function and business rule validation that checks for unique metric IDs, valid stage names, and type consistency.

## Files to Modify/Create
- `src/parser/validator.ts` - Add validateAARRRMetrics and validateAARRRMetricsBusinessRules
- `src/parser/types.ts` - Export AARRRMetrics type (if not done in Task 002)
- `src/parser/index.ts` - Add parseAARRRMetrics function
- `tests/validator.test.ts` - Add comprehensive unit tests

## Estimated Lines of Code
~120 lines (60 implementation + 60 tests)

## Dependencies
- Task 001: Schema must exist
- Task 002: Types must be generated

## Implementation Notes

### Update validator.ts

Add schema validation:
```typescript
export function validateAARRRMetrics(data: any): asserts data is AARRRMetrics {
  validate(data, 'aaarr-metrics');
}
```

Add business rules validation:
```typescript
export function validateAARRRMetricsBusinessRules(
  data: any,
  baseDir: string = process.cwd()
): string[] {
  const warnings: string[] = [];

  // 1. Validate lean_viability_ref exists (if provided)
  if (data.lean_viability_ref) {
    const viabilityPath = path.isAbsolute(data.lean_viability_ref)
      ? data.lean_viability_ref
      : path.join(baseDir, data.lean_viability_ref);

    if (!fs.existsSync(viabilityPath)) {
      throw new Error(`Lean viability file not found: ${data.lean_viability_ref}`);
    }
  }

  // 2. Validate metric IDs are unique across all stages
  const metricIds = new Set<string>();
  const stages = ['acquisition', 'activation', 'retention', 'referral', 'revenue'];

  stages.forEach(stageName => {
    const stage = data.stages?.[stageName];
    if (stage?.metrics) {
      stage.metrics.forEach((metric: any) => {
        if (metricIds.has(metric.id)) {
          throw new Error(`Duplicate metric ID: ${metric.id}`);
        }
        metricIds.add(metric.id);

        // Validate ID matches stage
        if (!metric.id.startsWith(`aaarr.${stageName}.`)) {
          throw new Error(`Metric ID '${metric.id}' does not match stage '${stageName}'`);
        }
      });
    }
  });

  // 3. Validate target/current type consistency
  stages.forEach(stageName => {
    const stage = data.stages?.[stageName];
    if (stage?.metrics) {
      stage.metrics.forEach((metric: any) => {
        if (metric.target && metric.current) {
          const targetType = getMetricType(metric.target);
          const currentType = getMetricType(metric.current);

          if (targetType !== currentType) {
            throw new Error(
              `Metric '${metric.id}': target type '${targetType}' does not match current type '${currentType}'`
            );
          }

          // Currency consistency
          if (targetType === 'amount' && metric.target.currency !== metric.current.currency) {
            throw new Error(
              `Metric '${metric.id}': currency mismatch (target: ${metric.target.currency}, current: ${metric.current.currency})`
            );
          }
        }
      });
    }
  });

  // 4. Warn if no viability reference
  if (!data.lean_viability_ref) {
    warnings.push('No lean_viability_ref provided - targets will not be imported automatically');
  }

  return warnings;
}

function getMetricType(value: any): 'rate' | 'amount' | 'percentage' | 'unknown' {
  if (value.rate !== undefined && value.period !== undefined) return 'rate';
  if (value.amount !== undefined && value.currency !== undefined) return 'amount';
  if (value.percentage !== undefined) return 'percentage';
  return 'unknown';
}
```

### Update parser/index.ts

```typescript
export function parseAARRRMetrics(filePath: string): AARRRMetrics {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);

  validateAARRRMetrics(data);

  return data;
}
```

### Add Unit Tests

Add to `tests/validator.test.ts`:
```typescript
describe('validateAARRRMetricsBusinessRules', () => {
  test('throws error when lean viability file does not exist', () => {
    // Test implementation
  });

  test('throws error when metric IDs are duplicated', () => {
    // Test implementation
  });

  test('throws error when metric ID does not match stage', () => {
    // Test implementation
  });

  test('throws error when target/current types mismatch', () => {
    // Test implementation
  });

  test('throws error when currencies are inconsistent', () => {
    // Test implementation
  });

  test('warns when no viability reference provided', () => {
    // Test implementation
  });

  test('passes with valid AAARR metrics', () => {
    // Test implementation
  });
});
```

## Acceptance Criteria
- [x] validateAARRRMetrics function added to validator.ts
- [x] validateAARRRMetricsBusinessRules function added
- [x] parseAARRRMetrics function added to parser/index.ts
- [x] Lean viability reference existence validated
- [x] Metric ID uniqueness enforced across all stages
- [x] Metric ID format validated against stage name
- [x] Target/current type consistency enforced
- [x] Currency consistency validated for amount types
- [x] Warning issued when no viability reference
- [x] AARRRMetrics type exported from types.ts
- [x] Unit tests added covering all validation rules
- [x] All tests passing

## Status
✅ COMPLETED - 2025-12-22

**Actual lines:** 272 lines (102 implementation + 170 tests)
**Estimated:** ~120 lines (60 implementation + 60 tests)
**Variance:** +126% (more comprehensive tests added)

**Files Modified:**
- `src/parser/validator.ts` - Added validateAARRRMetrics, validateAARRRMetricsBusinessRules, getMetricType helper (+89 lines)
- `src/parser/index.ts` - Added parseAARRRMetrics function and imports (+13 lines)
- `tests/validator.test.ts` - Added 7 comprehensive unit tests (+170 lines)

**Validation Rules Implemented:**
1. Lean viability file existence check (if provided)
2. Metric ID uniqueness across all 5 AAARR stages
3. Metric ID format validation (must match `aaarr.{stage}.{metric-name}`)
4. Target/current type consistency (rate vs amount vs percentage)
5. Currency consistency for amount types
6. Warning for missing viability reference

**Tests:** 35 passing (7 new AAARR validation tests)
**TypeScript Compilation:** ✅ Success (no errors)

**Commit:** 1f06d70 (initial implementation)
