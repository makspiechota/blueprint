# The 30-Minute Rule

## The Rule

**If Claude Code can't complete the task in 30 minutes, the batch is too big.**

This isn't arbitrary. It's calibrated to:
- Human attention span for code review
- Context window effectiveness
- Git commit granularity
- Risk tolerance for rollback

## How to Apply It

### Before Starting

Ask yourself: "Can Claude Code implement this AND can I review it in 30 minutes total?"

If no, decompose further.

### During Implementation

If Claude Code is:
- Asking many clarifying questions → batch too vague
- Generating pages of code → batch too large
- Making inconsistent decisions → batch too complex

Stop. Decompose. Restart.

### Signs of Right-Sized Batches

- Claude Code asks 0-2 clarifying questions
- Output is 50-200 lines of code
- You can review every line meaningfully
- Tests are comprehensive but not exhaustive
- One clear commit message describes the change

## Batch Size Examples

### Too Large
"Implement user authentication with login, logout, password reset, session management, and role-based access control."

### Right-Sized
1. "Implement password hashing utility with these tests"
2. "Implement session token generation with these tests"
3. "Implement login endpoint that uses the hasher and token generator"
4. "Implement logout endpoint that invalidates sessions"
5. "Implement password reset flow with email verification"

### Too Small
"Add a semicolon to line 47" - Just do this yourself.

## The Commit Rhythm

Right-sized batches create natural commits:

```
09:00 - Batch 1: Password hasher (commit)
09:30 - Batch 2: Token generator (commit)
10:00 - Batch 3: Login endpoint (commit)
10:30 - Batch 4: Logout endpoint (commit)
11:00 - Batch 5: Password reset (commit)
```

Each commit is:
- Reviewable independently
- Deployable (with feature flag)
- Reversible without losing other work
