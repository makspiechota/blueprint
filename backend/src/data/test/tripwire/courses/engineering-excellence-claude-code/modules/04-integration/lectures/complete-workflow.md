# The Complete Workflow

## The Five Phases

Engineering Excellence with Claude Code follows a predictable workflow:

```
Context → Spec → Small Batch → Implement → Review → Repeat
```

### Phase 1: Context

Before starting any work:

1. **Review CLAUDE.md** - Is it current?
2. **Gather relevant context** - Architecture, domain rules, examples
3. **Identify affected areas** - What files will change?

Time: 5 minutes

### Phase 2: Spec

Define what success looks like:

1. **Write failing tests** - Red phase
2. **Cover edge cases** - Think adversarially
3. **Define the interface** - Types and contracts

Time: 10-15 minutes

### Phase 3: Small Batch

Decompose into Claude-Code-sized chunks:

1. **Apply 30-minute rule** - Each batch completable in 30 min
2. **Identify dependencies** - What order?
3. **Scope explicitly** - What's in, what's out

Time: 5 minutes

### Phase 4: Implement

Execute with Claude Code:

1. **Provide context + spec** - Structured prompt
2. **Review output** - Every line
3. **Run tests** - Verify green

Time: 15-25 minutes per batch

### Phase 5: Review

Before moving on:

1. **All tests pass** - Green
2. **Code matches patterns** - Consistency
3. **No scope creep** - Only what was specified
4. **Commit** - One batch, one commit

Time: 5 minutes

## Example: Complete Workflow

**Task:** Add password reset functionality

### Context (5 min)
- Review auth module architecture
- Check existing email service patterns
- Note security requirements

### Spec (15 min)
```typescript
describe('PasswordResetService', () => {
  it('sends reset email for valid user');
  it('returns success even for unknown email (security)');
  it('generates time-limited token');
  it('resets password with valid token');
  it('rejects expired token');
  it('rejects already-used token');
});
```

### Small Batch (5 min)
1. Token generation + storage
2. Send reset email
3. Validate token + reset password
4. Integration with auth flow

### Implement (60 min total)
- Batch 1: 15 min
- Batch 2: 15 min
- Batch 3: 20 min
- Batch 4: 10 min

### Review + Commit
- 4 commits, each reviewed
- All tests green
- Ready for PR

**Total time:** ~90 minutes for a complete, tested, reviewable feature.
