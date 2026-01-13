# Why Small Batches Win

## Context Degradation

Claude Code maintains context throughout a conversation. But context has limits:

- **Attention dilutes** - More content = less focus on each part
- **Conflicts accumulate** - Multiple requirements can contradict
- **Errors compound** - One mistake cascades through implementation
- **Review becomes impossible** - Large outputs overwhelm human verification

## The Large Prompt Problem

When you ask Claude Code to "implement the entire user management system," you get:

1. **Vague interpretations** - It fills gaps with assumptions
2. **Inconsistent patterns** - Different approaches in different parts
3. **Hidden bugs** - Too much code to review carefully
4. **Integration issues** - Components don't fit together

## The Small Batch Advantage

When you ask Claude Code to "implement the password validation function" (with tests):

1. **Clear scope** - One thing to focus on
2. **Verifiable output** - You can review 50 lines, not 500
3. **Immediate feedback** - Tests pass or fail right now
4. **Easy rollback** - If it's wrong, you've lost 10 minutes, not 2 hours

## The Mathematics of Quality

```
Large batch: 1000 lines, 10 bugs, review finds 50% = 5 bugs shipped
Small batch: 100 lines, 1 bug, review finds 90% = 0.1 bugs shipped
```

Ten small batches with thorough review beat one large batch with cursory review.

## Beyond AI: The Lean Principle

Small batches aren't an AI hack. They're a core lean principle:

- **Toyota Production System** - Small lots, fast feedback
- **Continuous Delivery** - Ship small, ship often
- **Agile Development** - Working software in iterations

Claude Code just makes the feedback loop faster. The principle is universal.
