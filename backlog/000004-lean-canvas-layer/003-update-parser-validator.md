# Task: Update Parser and Validator for Lean Canvas and Business

## User Story Reference
User stories 5, 6: Validate Lean Canvas files and business.yaml entry point

## Description
Update the parser and validator to handle the new lean-canvas and business types. Add validation logic for business.yaml orchestration and Lean Canvas structure.

## Files to Modify/Create
- `src/parser/index.ts` - Add lean-canvas and business type handling
- `src/validator/index.ts` - Add validation logic for new types
- `tests/parser.test.ts` - Add parser tests for new types
- `tests/validator.test.ts` - Add validator tests

## Estimated Lines of Code
~95 lines (parser: 25, validator: 35, tests: 35)

## Dependencies
- Task 001 (schemas must exist)
- Task 002 (types must be generated)

## Implementation Notes

### Parser Updates

**Add to type detection:**
```typescript
// src/parser/index.ts
export function parseFile(filePath: string): ParsedFile {
  const data = yaml.load(fs.readFileSync(filePath, 'utf8'));

  // Existing: north-star, architectural-scope
  if (data.type === 'lean-canvas') {
    return { type: 'lean-canvas', data: data as LeanCanvas };
  }
  if (data.type === 'business') {
    return { type: 'business', data: data as Business };
  }
  // ...
}
```

### Validator Updates

**Add validation for business.yaml:**
```typescript
// src/validator/index.ts
export function validateBusiness(business: Business): ValidationResult {
  const errors = [];
  const warnings = [];

  // Validate metadata (required fields)
  if (!business.type || business.type !== 'business') {
    errors.push('Type must be "business"');
  }
  if (!business.version) errors.push('Version is required');
  if (!business.last_updated) errors.push('Last updated is required');
  if (!business.title) errors.push('Title is required');

  // Warn if no layers referenced
  const hasLayers = business.north_star_ref ||
                    business.lean_canvas_ref ||
                    business.architectural_scope_ref;
  if (!hasLayers) {
    warnings.push('No layers referenced - consider adding north_star_ref, lean_canvas_ref, or architectural_scope_ref');
  }

  // Validate referenced files exist (if paths provided)
  if (business.north_star_ref && !fileExists(business.north_star_ref)) {
    errors.push(`North Star reference not found: ${business.north_star_ref}`);
  }
  if (business.lean_canvas_ref && !fileExists(business.lean_canvas_ref)) {
    errors.push(`Lean Canvas reference not found: ${business.lean_canvas_ref}`);
  }
  if (business.architectural_scope_ref && !fileExists(business.architectural_scope_ref)) {
    errors.push(`Architectural Scope reference not found: ${business.architectural_scope_ref}`);
  }

  return { valid: errors.length === 0, errors, warnings };
}
```

**Add validation for lean-canvas:**
```typescript
export function validateLeanCanvas(canvas: LeanCanvas): ValidationResult {
  const errors = [];
  const warnings = [];

  // Validate metadata (required fields)
  if (!canvas.type || canvas.type !== 'lean-canvas') {
    errors.push('Type must be "lean-canvas"');
  }
  if (!canvas.version) errors.push('Version is required');
  if (!canvas.last_updated) errors.push('Last updated is required');
  if (!canvas.title) errors.push('Title is required');

  // Warn if all canvas sections are empty
  const hasSections = canvas.problem || canvas.customer_segments ||
                      canvas.unique_value_proposition || canvas.solution ||
                      canvas.channels || canvas.revenue_streams ||
                      canvas.cost_structure || canvas.key_metrics ||
                      canvas.unfair_advantage;
  if (!hasSections) {
    warnings.push('All Lean Canvas sections are empty - consider filling in at least a few boxes');
  }

  // Validate north_star_ref if provided
  if (canvas.north_star_ref && !fileExists(canvas.north_star_ref)) {
    errors.push(`North Star reference not found: ${canvas.north_star_ref}`);
  }

  return { valid: errors.length === 0, errors, warnings };
}
```

### Test Coverage

**Tests to add:**
- Valid lean-canvas file validates successfully
- Valid business file validates successfully
- Missing metadata fields fail validation
- Empty lean-canvas generates warning
- business.yaml with no layer references generates warning
- Invalid file references fail validation
- business.yaml with all three layers validates successfully

## Acceptance Criteria
- [x] Parser handles lean-canvas type
- [x] Parser handles business type
- [x] Validator enforces required metadata fields
- [x] Validator warns on empty lean-canvas
- [x] Validator warns on business.yaml with no layer references
- [x] Validator checks referenced files exist
- [x] All validation tests passing
- [x] No breaking changes to existing validators

## Status
[COMPLETED] - 2025-12-20
Actual lines: 31 (parser: 16, validator: 6, types: 2, tests: 7)
Parser and validator updated, build passing
