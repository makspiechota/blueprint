# Task: Add Comprehensive Tests

## User Story Reference
- As a developer, I want comprehensive tests so that Policy Charter functionality works reliably

## Description
Add unit tests for parser, validator, and visualizer functions using TDD approach. Tests will be created alongside implementation to ensure functionality works correctly. Cover happy paths, error cases, and edge cases including all three validation levels and visualization features.

## Files to Modify/Create
- `tests/policy-charter.test.ts` - New test file
- `tests/fixtures/policy-charter-valid.yaml` - Test fixture
- `tests/fixtures/policy-charter-invalid-*.yaml` - Invalid test fixtures

## Estimated Lines of Code
~300 lines

## Dependencies
- 003-parser-validator.md (functions must exist to test)
- 004-create-visualizer.md (visualizer must exist to test)
- 005-create-example.md (example must exist for fixtures)

## Implementation Notes

### Test Structure

Create `tests/policy-charter.test.ts` with test suites for:

1. **Parser Tests**
   - Parse valid policy charter
   - Handle YAML parsing errors
   - Type validation

2. **Validator Tests**
   - Level 1: Schema validation
   - Level 2: Reference existence
   - Level 3: Logical consistency
   - Error message quality

3. **Visualizer Tests**
   - HTML generation
   - Hierarchy rendering
   - Relationship visualization
   - CSS and structure validation

### Test Fixtures

Create fixtures in `tests/fixtures/`:
- `policy-charter-valid.yaml` - Complete valid example
- `policy-charter-invalid-schema.yaml` - Schema violations
- `policy-charter-invalid-references.yaml` - Broken references
- `policy-charter-invalid-logic.yaml` - Logical inconsistencies

### Test Coverage

Ensure tests cover:
- All entity types (goals, tactics, policies, risks, KPIs)
- Bidirectional relationships
- Graduated brackets
- Risk mitigation
- KPI justification
- Cross-layer references
- Error conditions and edge cases

### Jest Configuration

Tests should use existing Jest setup with:
- YAML fixtures
- HTML output validation
- Error assertion patterns
- Mock file system for isolation

## Acceptance Criteria
- [ ] tests/policy-charter.test.ts created with comprehensive test suites
- [ ] Test fixtures created for valid and invalid cases
- [ ] Parser tests cover YAML parsing and type validation
- [ ] Validator tests cover all three validation levels
- [ ] Visualizer tests validate HTML generation and structure
- [ ] Tests achieve high coverage (>90%)
- [ ] All tests pass with npm test
- [ ] Error cases provide clear failure messages