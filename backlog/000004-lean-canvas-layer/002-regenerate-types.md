# Task: Regenerate TypeScript Types for Lean Canvas and Business

## User Story Reference
User stories 5, 6: Type-safe validation and development

## Description
Regenerate TypeScript types from the new JSON schemas (lean-canvas and business) to enable type-safe TypeScript development.

## Files to Modify/Create
- `src/types/generated/` - Auto-generated types from schemas
- Update type exports if needed

## Estimated Lines of Code
~70 lines (auto-generated from schemas)

## Dependencies
- Task 001 (schemas must exist first)

## Implementation Notes

### Generation Command
```bash
npm run generate-types
```

This uses dtsgenerator to create TypeScript types from JSON schemas.

### Expected Type Structure

**LeanCanvas interface:**
```typescript
export interface LeanCanvas {
  type: "lean-canvas";
  version: string;
  last_updated: string;
  title: string;
  north_star_ref?: string;
  problem?: {
    top_3_problems?: string[];
    existing_alternatives?: string;
  };
  customer_segments?: {
    target_customers?: string;
    early_adopters?: string;
  };
  unique_value_proposition?: {
    single_clear_message?: string;
    high_level_concept?: string;
  };
  solution?: {
    top_3_features?: string[];
  };
  channels?: {
    path_to_customers?: string[];
  };
  revenue_streams?: {
    revenue_model?: string;
    lifetime_value?: string;
  };
  cost_structure?: {
    customer_acquisition_cost?: string;
    distribution_costs?: string;
    hosting_costs?: string;
    people_costs?: string;
  };
  key_metrics?: {
    activities_to_measure?: string[];
  };
  unfair_advantage?: {
    cant_be_copied?: string;
  };
}
```

**Business interface:**
```typescript
export interface Business {
  type: "business";
  version: string;
  last_updated: string;
  title: string;
  north_star_ref?: string;
  lean_canvas_ref?: string;
  architectural_scope_ref?: string;
}
```

### Verification
- Run `npm run build` to verify types compile
- Check that all optional fields are marked with `?`
- Verify required fields (type, version, last_updated, title) are not optional

## Acceptance Criteria
- [x] TypeScript types generated from lean-canvas.schema.json
- [x] TypeScript types generated from business.schema.json
- [x] All canvas sections properly typed as optional
- [x] All metadata fields properly typed as required
- [x] Types exported from appropriate module
- [x] Build succeeds with new types
- [x] No type errors in existing code

## Status
[COMPLETED] - 2025-12-20
Actual lines: 64 (schemas: 6, types: 58)
Types generated successfully, build passing
