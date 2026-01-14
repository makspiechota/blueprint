# Why Specs Matter

## The Problem with Vague Requests

When you ask Claude Code "write a function that validates user input," you're giving it:
- No definition of valid vs invalid
- No edge cases to handle
- No error message format
- No integration context

Claude Code will make reasonable assumptions. But reasonable assumptions aren't YOUR assumptions.

## The Spec-First Difference

Instead of describing what you want, show Claude Code what success looks like:

```typescript
describe('validateUserInput', () => {
  it('accepts valid email format', () => {
    expect(validateUserInput('user@example.com')).toEqual({ valid: true });
  });

  it('rejects empty string with specific error', () => {
    expect(validateUserInput('')).toEqual({
      valid: false,
      error: 'Email is required'
    });
  });

  it('rejects invalid format with helpful message', () => {
    expect(validateUserInput('not-an-email')).toEqual({
      valid: false,
      error: 'Please enter a valid email address'
    });
  });
});
```

Now Claude Code knows exactly what to build. The test IS the specification.

## Why This Works with AI

Claude Code is modeled on human reasoning. Like a good contractor, it performs best when given:

1. **Clear success criteria** - The tests define "done"
2. **Concrete examples** - Not abstract requirements
3. **Verifiable output** - It can check its own work

When you write the spec first, you transform Claude Code from a guessing game into a directed search for a solution that passes your tests.

## The Engineering Benefit

Spec-driven development isn't just an "AI trick." It's how rigorous engineers have always worked:

- TDD practitioners write tests first
- Contract-first API design specifies before implementing
- Acceptance criteria define features before coding

You're not learning a new skill for AI. You're applying a proven practice that happens to make AI dramatically more effective.
