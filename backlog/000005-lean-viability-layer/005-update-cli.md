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
- [ ] lean-viability case added to type switch
- [ ] validateLeanViability called for schema validation
- [ ] validateLeanViabilityBusinessRules called for business validation
- [ ] Warnings displayed if present
- [ ] generateLeanViabilityHTML called to create visualization
- [ ] Output file created at correct path (viability-dashboard.html)
- [ ] Import statements added for new functions
- [ ] CLI successfully processes lean-viability.yaml files
- [ ] Error handling for invalid viability files
