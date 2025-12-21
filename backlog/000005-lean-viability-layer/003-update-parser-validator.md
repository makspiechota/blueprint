# Task: Add Viability Parser and Validator

## User Story Reference
- As a business analyst, I want to see transparent calculation formulas so that I can understand how targets were derived
- As an executive, I want to understand if our business model is viable so that I can make informed investment decisions

## Description
Extend the parser and validator to support lean-viability files. Add validation function and business rule validation that checks for realistic assumptions and enforces unidirectional dependencies.

## Files to Modify/Create
- `src/parser/validator.ts` - Add validateLeanViability function and business rules
- `src/parser/types.ts` - Export LeanViability type from generated types

## Estimated Lines of Code
~75 lines

## Dependencies
- Task 001: Schema must exist
- Task 002: Types must be generated

## Implementation Notes

### Update validator.ts

Add new validation function following existing pattern:
```typescript
export function validateLeanViability(data: any): asserts data is LeanViability {
  validate(data, 'lean-viability');
}
```

Add new business rules validation function:
```typescript
export function validateLeanViabilityBusinessRules(
  data: any,
  baseDir: string = process.cwd()
): string[] {
  const warnings: string[] = [];

  // 1. Validate lean_canvas_ref exists
  const leanCanvasPath = path.isAbsolute(data.lean_canvas_ref)
    ? data.lean_canvas_ref
    : path.join(baseDir, data.lean_canvas_ref);

  if (!fs.existsSync(leanCanvasPath)) {
    throw new Error(`Lean canvas file not found: ${data.lean_canvas_ref}`);
  }

  // 2. Validate time horizon (warn if < 2 or > 5 years)
  const horizonYears = data.time_horizon.unit === 'years'
    ? data.time_horizon.duration
    : data.time_horizon.duration / 12;

  if (horizonYears < 2) {
    warnings.push(`Time horizon of ${horizonYears} years may be too short (recommended: 2-5 years)`);
  } else if (horizonYears > 5) {
    warnings.push(`Time horizon of ${horizonYears} years may be too long (recommended: 2-5 years)`);
  }

  // 3. Currency consistency check
  const currencies = new Set<string>();
  if (data.success_criteria?.annual_revenue) {
    currencies.add(data.success_criteria.annual_revenue.currency);
  }
  if (data.calculations?.annual_revenue_per_customer) {
    currencies.add(data.calculations.annual_revenue_per_customer.currency);
  }

  if (currencies.size > 1) {
    throw new Error(`All currency amounts must use the same currency. Found: ${Array.from(currencies).join(', ')}`);
  }

  // 4. Sanity check: required customers should be reasonable
  if (data.calculations?.required_customers?.count > 1000000) {
    warnings.push(`Required customers (${data.calculations.required_customers.count}) is very high. Consider validating against TAM.`);
  }

  return warnings;
}
```

### Update types.ts
Add export from generated types:
```typescript
export { LeanViability } from './types.generated';
```

### Pattern to Follow
- Follow same structure as `validateArchitecturalScopeBusinessRules`
- Use warnings for soft validations (time horizon range)
- Throw errors for hard violations (missing files, currency mismatch)
- Check file existence using `fs.existsSync`

## Acceptance Criteria
- [ ] validateLeanViability function added to validator.ts
- [ ] validateLeanViabilityBusinessRules function added
- [ ] Lean canvas reference existence validated
- [ ] Time horizon range warnings implemented (< 2 or > 5 years)
- [ ] Currency consistency validation enforced
- [ ] Sanity check for required customer count added
- [ ] LeanViability type exported from types.ts
- [ ] All validations return appropriate errors/warnings
