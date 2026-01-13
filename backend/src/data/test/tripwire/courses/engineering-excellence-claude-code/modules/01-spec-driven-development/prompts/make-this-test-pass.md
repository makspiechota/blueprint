# Make This Test Pass - Master Prompt

## The Prompt

```
I have a failing test that defines the behavior I need. Please implement the code to make this test pass.

## Test File
[paste your test here]

## Requirements
1. Make the test pass exactly as written
2. Don't modify the test
3. Match the interface the test expects
4. Handle all cases the test covers

## Context
[optional: paste relevant types, interfaces, or existing code]

## Constraints
[optional: specific libraries, patterns, or approaches to use/avoid]
```

## Why This Works

This prompt succeeds because it:

1. **Defines success clearly** - The test is the specification
2. **Constrains the output** - Must match the expected interface
3. **Provides verification** - Claude Code can check its work
4. **Focuses effort** - No ambiguity about what to build

## Variations

### Minimal Version
```
Make this test pass:
[test code]
```

### With Type Context
```
Make this test pass. Here are the relevant types:
[type definitions]

Test:
[test code]
```

### With Existing Code
```
I need to add this functionality to an existing module. Make this test pass while maintaining compatibility with the existing code.

Existing code:
[current implementation]

New test to pass:
[test code]
```

## Anti-Patterns to Avoid

**Don't say:**
- "Write a function that does X" (vague)
- "Implement something like this test" (imprecise)
- "Make tests pass however you want" (too open)

**Do say:**
- "Make this exact test pass" (specific)
- "Match this interface" (constrained)
- "Don't modify the test" (clear boundaries)
