# The Test-First Loop

## The Four Phases

The Test-First Loop with Claude Code follows a precise rhythm:

### 1. RED: Write a Failing Test

You write the test. Not Claude Code. Why?

- You define the behavior you want
- You control the interface design
- You set the quality bar

```typescript
// You write this
it('calculates compound interest correctly', () => {
  const result = calculateInterest({
    principal: 1000,
    rate: 0.05,
    years: 10,
    compoundingFrequency: 'monthly'
  });
  expect(result.finalAmount).toBeCloseTo(1647.01, 2);
  expect(result.totalInterest).toBeCloseTo(647.01, 2);
});
```

Run the test. It fails. Good. Now you have a target.

### 2. CLAUDE CODE: Implement to Pass

Now give Claude Code the spec:

> "Make this test pass. Here's the test file and the interface it expects."

Claude Code sees:
- The exact function signature needed
- The expected input/output format
- The precision requirements
- The edge case handling

It generates an implementation. You run the test.

### 3. GREEN: Verify It Passes

The test passes. But you're not done.

- Read the implementation
- Does it make sense?
- Is it what you expected?
- Are there obvious issues?

If something's wrong, add a test that exposes the problem, then return to step 2.

### 4. REFACTOR: Improve with Safety Net

Now you can refactor with confidence:

> "Refactor this implementation for readability while keeping all tests passing."

The tests protect you. Claude Code can't accidentally break functionality because the specs will catch it.

## The Rhythm in Practice

```
Write test (2 min) ->
Claude Code implements (1 min) ->
Verify & review (2 min) ->
Refactor if needed (2 min) ->
Repeat
```

One small cycle takes 5-10 minutes. You maintain tight feedback loops and catch issues immediately.

## Common Mistakes

1. **Writing too many tests at once** - One test at a time keeps focus
2. **Letting Claude Code write the tests** - You lose control of the spec
3. **Skipping the review phase** - Trust but verify
4. **Refactoring before green** - Get it working first, then improve
