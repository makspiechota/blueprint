# Task: Add Parser and Validator Functions

## User Story Reference
- As a developer, I want to parse and validate Policy Charter YAML files so that I can process them programmatically

## Description
Add `parsePolicyCharter` function to parser/index.ts and `validatePolicyCharter` function to validator.ts. Implement three-level validation: reference existence, type consistency, and logical consistency.

## Files to Modify/Create
- `src/parser/index.ts` - Add parsePolicyCharter function
- `src/parser/validator.ts` - Add validatePolicyCharter function with three-level validation

## Estimated Lines of Code
~150 lines

## Dependencies
- 002-generate-types.md (PolicyCharter type must exist)

## Implementation Notes

### Parser Function

Add to `src/parser/index.ts` following existing pattern:

```typescript
export function parsePolicyCharter(filePath: string): PolicyCharter {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);

  validatePolicyCharter(data);

  return data;
}
```

Also import PolicyCharter type and add to validator import.

### Three-Level Validation

#### Level 1: Reference Existence
- All goal addresses point to existing Arch Scope goals
- All KPI justifications point to existing AAARR metrics
- All tactic drives_policies point to existing policies
- All policy driven_by_tactic points to existing tactics
- All risk mitigations point to existing tactics/policies

#### Level 2: Type Consistency
- Goal addresses reference Arch Scope goal IDs (not other entity types)
- KPI justifications reference AAARR metric IDs
- Tactic drives_policies reference policy IDs
- Policy driven_by_tactic references tactic IDs
- Risk mitigations reference tactic/policy IDs

#### Level 3: Logical Consistency
- Goals must address at least one Arch Scope WHY goal
- Tactics must drive at least one policy
- Policies must be driven by exactly one tactic
- KPIs must justify AAARR metrics in goal's aaarr_impact
- Risk mitigation references must be valid

### Validator Implementation

```typescript
export function validatePolicyCharter(data: any): asserts data is PolicyCharter {
  // Level 1: Basic schema validation using JSON Schema
  const schema = loadSchema('policy-charter');
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  
  if (!validate(data)) {
    throw new ValidationError('Schema validation failed', validate.errors);
  }

  // Level 2: Cross-reference validation
  validatePolicyCharterReferences(data);

  // Level 3: Logical consistency validation
  validatePolicyCharterLogic(data);
}
```

### Helper Functions Needed

- `validatePolicyCharterReferences()` - Level 2 validation
- `validatePolicyCharterLogic()` - Level 3 validation
- Load referenced Arch Scope and AAARR files for validation

## Acceptance Criteria
- [ ] parsePolicyCharter function added to src/parser/index.ts
- [ ] validatePolicyCharter function added to src/parser/validator.ts
- [ ] Level 1 validation: JSON Schema compliance
- [ ] Level 2 validation: Reference existence and type consistency
- [ ] Level 3 validation: Logical consistency (Ross framework rules)
- [ ] Proper error messages for all validation levels
- [ ] Functions export correctly and integrate with existing patterns