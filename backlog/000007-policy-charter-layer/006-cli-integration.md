# Task: CLI Integration

## User Story Reference
- As a user, I want to visualize Policy Charter files from command line so that I can review operational policies

## Description
Update CLI index.ts and visualizer/index.ts to support parsing and visualizing Policy Charter YAML files. Add policy-charter command support and integrate with existing visualization pipeline.

## Files to Modify/Create
- `src/index.ts` - Add policy-charter command support
- `src/visualizer/index.ts` - Add visualizePolicyCharter function

## Estimated Lines of Code
~50 lines

## Dependencies
- 003-parser-validator.md (parsePolicyCharter must exist)
- 004-create-visualizer.md (generatePolicyCharterHTML must exist)

## Implementation Notes

### CLI Command Support

Add to `src/index.ts` following existing pattern:

```typescript
import { parsePolicyCharter } from './parser';
import { visualizePolicyCharter } from './visualizer';

program
  .command('policy-charter <file>')
  .description('Parse and validate a Policy Charter YAML file')
  .action((file: string) => {
    try {
      const policyCharter = parsePolicyCharter(file);
      console.log(`✅ Valid Policy Charter: ${policyCharter.title}`);
      console.log(`Goals: ${policyCharter.goals.length}`);
      console.log(`Tactics: ${policyCharter.tactics.length}`);
      console.log(`Policies: ${policyCharter.policies.length}`);
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('visualize-policy-charter <file> [output]')
  .description('Generate HTML visualization for Policy Charter')
  .action((file: string, output?: string) => {
    try {
      const policyCharter = parsePolicyCharter(file);
      const htmlOutput = output || `${path.parse(file).name}-policy-charter.html`;
      visualizePolicyCharter(file, htmlOutput);
      console.log(`✅ Visualization saved to: ${htmlOutput}`);
    } catch (error) {
      console.error('❌ Visualization failed:', error.message);
      process.exit(1);
    }
  });
```

### Visualizer Integration

Add to `src/visualizer/index.ts`:

```typescript
export function visualizePolicyCharter(filePath: string, outputPath: string): void {
  const policyCharter = parsePolicyCharter(filePath);
  const html = generatePolicyCharterHTML(policyCharter);
  fs.writeFileSync(outputPath, html, 'utf8');
}
```

### Business Layer Integration

Update `visualizeBusiness` function to discover and visualize Policy Charter layers when referenced.

## Acceptance Criteria
- [ ] CLI supports `blueprint policy-charter <file>` command
- [ ] CLI supports `blueprint visualize-policy-charter <file> [output]` command
- [ ] Commands parse and validate Policy Charter files
- [ ] Visualization command generates HTML output
- [ ] Business layer visualization discovers Policy Charter references
- [ ] Error handling provides clear feedback for invalid files
- [ ] Commands integrate with existing CLI patterns