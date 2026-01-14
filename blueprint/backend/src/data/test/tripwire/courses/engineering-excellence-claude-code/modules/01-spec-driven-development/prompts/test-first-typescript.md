# Test-First TypeScript Prompt

## The Prompt

```
I'm practicing test-first development. I've written this test that defines what I need:

```typescript
[your test here]
```

Please implement the TypeScript code to make this test pass.

Requirements:
- Use TypeScript with strict mode
- Export the function/class so the test can import it
- Include appropriate type annotations
- Handle the edge cases shown in the test
- Don't modify the test file

Relevant types (if any):
```typescript
[type definitions]
```
```

## Example Usage

### Input
```
I'm practicing test-first development. I've written this test that defines what I need:

```typescript
import { parseConfig } from './config-parser';

describe('parseConfig', () => {
  it('parses valid JSON config', () => {
    const input = '{"port": 3000, "host": "localhost"}';
    const result = parseConfig(input);
    expect(result).toEqual({ port: 3000, host: 'localhost' });
  });

  it('returns error for invalid JSON', () => {
    const input = 'not json';
    const result = parseConfig(input);
    expect(result).toEqual({ error: 'Invalid JSON format' });
  });

  it('validates required fields', () => {
    const input = '{"port": 3000}';
    const result = parseConfig(input);
    expect(result).toEqual({ error: 'Missing required field: host' });
  });
});
```

Please implement the TypeScript code to make this test pass.
```

### Expected Output
Claude Code generates a `config-parser.ts` file with proper types and all test cases passing.

## Tips for Better Results

1. **Include the import path** - Shows Claude Code where to put the file
2. **Use descriptive test names** - Helps Claude Code understand intent
3. **Test edge cases explicitly** - What you test is what you get
4. **Specify type strictness** - "strict mode" enforces better types
