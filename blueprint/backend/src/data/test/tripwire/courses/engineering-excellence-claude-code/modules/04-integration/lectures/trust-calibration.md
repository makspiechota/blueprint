# When to Trust, When to Override

## The Trust Spectrum

Claude Code isn't always right or always wrong. Calibrate trust based on:

### High Trust Areas
- **Boilerplate code** - Standard patterns, repetitive tasks
- **Test implementations** - Making tests pass with clear specs
- **Refactoring** - When tests protect the change
- **Well-documented patterns** - Things you've shown examples of

### Medium Trust Areas
- **Business logic** - Review carefully, verify against domain rules
- **API design** - Check naming, structure, conventions
- **Error handling** - Verify all cases covered
- **Performance** - May need optimization

### Low Trust Areas
- **Security code** - Always review thoroughly
- **Financial calculations** - Verify edge cases and precision
- **Complex algorithms** - Test extensively
- **Architectural decisions** - You make these, not Claude Code

## Trust Calibration Process

### 1. Start Skeptical
Review everything carefully in the first few sessions with a new codebase.

### 2. Note Patterns
Where does Claude Code excel? Where does it struggle?

### 3. Adjust Over Time
- Consistently good? Trust more.
- Frequent issues? Trust less.

### 4. Re-Calibrate on Changes
New domain? New patterns? Reset trust and re-evaluate.

## Override Signals

**Override immediately when:**
- Output doesn't match your conventions
- Domain rules are violated
- Security concerns arise
- Tests pass but logic is wrong
- Scope has expanded beyond specification

**Investigate further when:**
- Something feels off but you can't pinpoint it
- The solution is more complex than expected
- Claude Code asks many clarifying questions
- Multiple approaches were considered

## The Override Conversation

When you need to course-correct:

```
Your implementation doesn't match our pattern for [X].
Here's how we do it:
[example]

Please revise to follow this pattern while keeping the same functionality.
```

Or:

```
This violates our domain rule that [rule].
The correct behavior is [correct behavior].
Please fix this while keeping the test passing.
```

## Building Mutual Understanding

Over time, good context + good specs → better Claude Code output → higher trust.

The goal isn't blind trust. It's calibrated trust:
- Know what to review closely
- Know what to spot-check
- Know what to trust

This calibration is unique to you, your codebase, and your domain.
