# Task: Regenerate TypeScript Types from Updated Schema

## User Story Reference
All user stories (foundation for type safety)

## Description
Regenerate TypeScript types from the updated architectural-scope schema using dtsgenerator. The new WHY structure (mission + goals) will be reflected in the ArchitecturalScope TypeScript interface.

## Files to Modify/Create
- `src/parser/types.ts` - Regenerated TypeScript definitions

## Estimated Lines of Code
~15 lines (type definition changes in generated file)

## Dependencies
- Task 001 (schema must be updated first)

## Implementation Notes
Run the type generation script:
```bash
npm run generate-types
```

The generated ArchitecturalScope interface should now include:
```typescript
export interface ArchitecturalScope {
  type: "architectural-scope";
  version: string;
  last_updated: string;
  title: string;
  north_star_ref: string;
  why: {
    mission: {
      action: string;
      service: string;
      beneficiary: string;
    };
    goals?: Array<{
      title: string;
      description: string;
    }>;
  };
  what?: Array<ScopeItem>;
  how?: Array<ScopeItem>;
  where?: Array<ScopeItem>;
  who?: Array<ScopeItem>;
  when?: Array<ScopeItem>;
}
```

Verify the types compile correctly and are used properly by the parser and validator.

## Acceptance Criteria
- [ ] Types regenerated from schema
- [ ] ArchitecturalScope interface has why property as object
- [ ] Mission has action, service, beneficiary fields
- [ ] Goals is optional array
- [ ] TypeScript compilation succeeds
- [ ] No type errors in existing code
