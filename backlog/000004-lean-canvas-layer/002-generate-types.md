# Task: Generate TypeScript Types from Lean Canvas and Business Schemas

## User Story Reference
User stories 5, 6: Validate Lean Canvas files and version control in YAML

## Description
Generate TypeScript type definitions from the new JSON schemas (lean-canvas and business) using dtsgenerator. Update the types index to export the new types.

## Files to Modify/Create
- `src/types/generated/lean-canvas.ts` - New generated types for Lean Canvas
- `src/types/generated/business.ts` - New generated types for business entry point
- `src/types/index.ts` - Export new types

## Estimated Lines of Code
~60 lines (lean-canvas types: 40, business types: 10, index update: 10)

## Dependencies
Task 001 (schemas must exist first)

## Implementation Notes

### Generation Command
```bash
npm run generate-types
```

This will run dtsgenerator on all schemas in `schemas/` directory.

### Expected lean-canvas.ts Structure
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
  // ... other 7 canvas boxes
}
```

### Expected business.ts Structure
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

### Types Index Update
Add exports to `src/types/index.ts`:
```typescript
export * from './generated/lean-canvas';
export * from './generated/business';
```

## Acceptance Criteria
- [ ] TypeScript types generated from lean-canvas.schema.json
- [ ] TypeScript types generated from business.schema.json
- [ ] Types exported from src/types/index.ts
- [ ] npm run generate-types runs without errors
- [ ] All optional fields properly marked with `?`
- [ ] Type const values match schema exactly ("lean-canvas", "business")
- [ ] No breaking changes to existing types
