# Task: Update CLI to Support Lean Viability

## User Story Reference
- As a business strategist, I want to define a 3-year revenue target so that I can work backwards to required customer acquisition rates

## Description
Update the main CLI tool (`src/index.ts`) to recognize and process lean-viability.yaml files, generating HTML visualizations and running validations.

## Files to Modify/Create
- `src/index.ts` - Add lean-viability case to file type detection and processing

## Estimated Lines of Code
~25 lines

## Dependencies
- Task 003: Validator must exist
- Task 004: Visualizer must exist

## Implementation Notes

### Current Structure Analysis
The CLI already handles multiple file types:
- north-star
- architectural-scope
- lean-canvas
- business (orchestration)

### Add Lean Viability Support
In the switch statement that handles different types, add:

```typescript
case 'lean-viability':
  console.log('Validating Lean 1-2-3 Viability...');
  validateLeanViability(data);

  // Run business rules validation
  const viabilityWarnings = validateLeanViabilityBusinessRules(data, process.cwd());
  if (viabilityWarnings.length > 0) {
    console.log('\nWarnings:');
    viabilityWarnings.forEach(warning => console.log(`  ⚠ ${warning}`));
  }

  console.log('Generating viability dashboard...');
  const viabilityHtml = generateLeanViabilityHTML(data as LeanViability);

  const viabilityOutputPath = outputFile ||
    path.join(path.dirname(inputFile), 'viability-dashboard.html');
  fs.writeFileSync(viabilityOutputPath, viabilityHtml);

  console.log(`✓ Viability dashboard generated: ${viabilityOutputPath}`);
  break;
```

### Import Statements
Add at top of file:
```typescript
import {
  generateLeanViabilityHTML
} from './visualizer/lean-viability-visualizer';
import {
  validateLeanViability,
  validateLeanViabilityBusinessRules
} from './parser/validator';
import { LeanViability } from './parser/types';
```

### Testing
After implementation, test with:
```bash
npm run build
node dist/index.js examples/lean-viability.yaml
```

Expected output:
- Validation messages
- Any warnings (time horizon, etc.)
- Success message with output path
- Generated `viability-dashboard.html` file

## Acceptance Criteria
- [x] lean-viability case added to type switch
- [x] validateLeanViability called for schema validation
- [x] validateLeanViabilityBusinessRules called for business validation
- [x] Warnings displayed if present
- [x] generateLeanViabilityHTML called to create visualization
- [x] Output file created at correct path (viability-dashboard.html)
- [x] Import statements added for new functions
- [x] CLI successfully processes lean-viability.yaml files
- [x] Error handling for invalid viability files

## Status
✅ **COMPLETED** - 2025-12-21

**Actual lines:** 173 lines (52 implementation + 121 tests)
**Estimated:** ~25 lines
**Variance:** +148 lines (includes comprehensive CLI integration tests)

**Files Modified:**
- `src/index.ts` - Added lean-viability support in visualize and validate commands (39 lines)
- `src/parser/index.ts` - Added parseLeanViability function (13 lines)
- `tests/cli.test.ts` - Added 3 comprehensive integration tests (121 lines)

**Implementation Details:**
- Added `parseLeanViability` function following existing parser pattern
- Added lean-viability case in visualize command with warning display
- Added lean-viability case in validate command with business rules
- Updated command descriptions to include lean-viability
- Added necessary imports for visualizer and validator functions

**Test Results:**
- ✓ All 67 tests passing (64 existing + 3 new)
- ✓ TypeScript compiles without errors
- ✓ All acceptance criteria met
- ✓ validate command succeeds for lean-viability files
- ✓ visualize command generates viability dashboard
- ✓ Warnings displayed for invalid time horizons

**Tests Added:**
1. validate command succeeds for lean-viability file
2. visualize command generates viability dashboard
3. visualize command displays warnings for lean-viability

**Commit:** [Will be added by committer agent]
