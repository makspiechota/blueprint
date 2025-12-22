# Task: Add CLI Integration for AAARR Metrics

## User Story Reference
- As a product manager, I want to visualize AAARR metrics from the CLI so that I can review the customer factory
- As an AI agent, I want to validate AAARR metrics files so that data quality is ensured

## Description
Extend the CLI to support `aaarr-metrics` file type in both `visualize` and `validate` commands, generating `aaarr-dashboard.html` output.

## Files to Modify/Create
- `src/index.ts` - Add aaarr-metrics support to visualize and validate commands
- `src/parser/index.ts` - Add parseAARRRMetrics function
- `tests/cli.test.ts` - Add CLI integration tests

## Estimated Lines of Code
~60 lines (40 implementation + 20 tests)

## Dependencies
- Task 003: Parser and validator must exist
- Task 005: Visualizer must exist

## Implementation Notes

### Update src/index.ts

Add imports:
```typescript
import { parseAARRRMetrics } from './parser';
import { generateAARRRMetricsHTML } from './visualizer/aaarr-visualizer';
import { validateAARRRMetricsBusinessRules } from './parser/validator';
```

Add to visualize command (after lean-viability block):
```typescript
} else if (data.type === 'aaarr-metrics') {
  const aarrr = parseAARRRMetrics(input);
  const aarrrWarnings = validateAARRRMetricsBusinessRules(data, inputDir);
  if (aarrrWarnings.length > 0) {
    console.log('\nWarnings:');
    aarrrWarnings.forEach(warning => console.log(`  ⚠ ${warning}`));
  }
  const aarrrHtml = generateAARRRMetricsHTML(aarrr, inputDir);
  const aarrrOutputPath = options.output || path.join(inputDir, 'aaarr-dashboard.html');
  fs.writeFileSync(aarrrOutputPath, aarrrHtml);
  logger.success(`AAARR Metrics visualization generated successfully: ${aarrrOutputPath}`);
}
```

Add to validate command (after lean-viability block):
```typescript
} else if (data.type === 'aaarr-metrics') {
  parseAARRRMetrics(input);
  const warnings = validateAARRRMetricsBusinessRules(data, inputDir);
  if (warnings.length > 0) {
    logger.warning('Validation warnings:');
    warnings.forEach(warning => logger.warning(`  - ${warning}`));
  }
  logger.success(`AAARR Metrics file is valid: ${input}`);
}
```

### Update src/parser/index.ts

Add parseAARRRMetrics function:
```typescript
export function parseAARRRMetrics(filePath: string): AARRRMetrics {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);

  validateAARRRMetrics(data);

  return data;
}
```

### Add CLI Integration Tests

Add to `tests/cli.test.ts`:

```typescript
describe('AAARR Metrics CLI', () => {
  test('validates aaarr-metrics file', () => {
    // Test validation command
  });

  test('generates aaarr-dashboard.html', () => {
    // Test visualization command
  });

  test('displays warnings for missing viability reference', () => {
    // Test warning display
  });
});
```

## Acceptance Criteria
- [ ] parseAARRRMetrics function added to parser/index.ts
- [ ] visualize command supports aaarr-metrics type
- [ ] validate command supports aaarr-metrics type
- [ ] Generates aaarr-dashboard.html output file
- [ ] Displays business rule warnings to console
- [ ] CLI integration tests added
- [ ] Tests verify validation and visualization
- [ ] All tests passing
- [ ] TypeScript compiles without errors
- [ ] CLI commands work end-to-end
