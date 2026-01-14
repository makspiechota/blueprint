# The Two Agents Pattern

## Adversarial Validation

The most powerful spec-driven pattern uses Claude Code against itself:

- **Agent 1**: Writes tests (the adversary)
- **Agent 2**: Writes implementation (the builder)

Neither knows the other's work in advance. This creates genuine validation.

## How It Works

### Step 1: Generate Adversarial Tests

First conversation:

> "You are a QA engineer trying to break this feature. Given this interface specification, write comprehensive tests that would catch any incorrect implementation. Focus on edge cases, boundary conditions, and error handling."

Claude Code generates tests designed to catch bugs, not just confirm happy paths.

### Step 2: Implement Against Tests

Second conversation (new context):

> "Make these tests pass. You haven't seen how they were generated - just implement the functionality they specify."

Claude Code implements without knowing the "tricks" in the tests.

### Step 3: Review the Battle

If tests pass: You likely have a solid implementation.
If tests fail: The adversary found a gap in the implementation.

Either way, you win.

## When to Use Two Agents

**Good candidates:**
- Complex business logic
- Security-sensitive code
- Financial calculations
- Data validation

**Skip for:**
- Simple CRUD operations
- Well-understood patterns
- Time-sensitive tasks

## The Trust Calibration

Two Agents helps you calibrate trust in Claude Code's output:

- If the adversary can't break it, your confidence increases
- If easy tests fail, you know to review more carefully
- Over time, you learn which domains need adversarial testing

## Example: Payment Validation

**Agent 1 (Adversary):**
```typescript
describe('validatePayment', () => {
  // Happy path
  it('accepts valid payment', () => {...});

  // Boundary attacks
  it('rejects negative amounts', () => {...});
  it('rejects amounts over limit', () => {...});
  it('handles floating point precision', () => {...});

  // Type confusion
  it('rejects string amounts', () => {...});
  it('handles null gracefully', () => {...});

  // Business logic
  it('applies daily limit per user', () => {...});
  it('requires additional auth over threshold', () => {...});
});
```

**Agent 2 (Builder):**
Implements without seeing the adversary's strategy, ensuring genuine validation.
