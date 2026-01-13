# Scope Negotiation Prompt

## When to Use

Use this when Claude Code pushes back on scope or suggests expanding the batch.

## The Prompt

```
I want to keep this batch focused. Let's negotiate scope:

My proposed batch:
[your batch description]

Your suggestion to expand:
[Claude Code's expansion]

Questions:
1. Can the expansion be done as a separate batch after this one?
2. What's the minimum viable implementation for THIS batch?
3. What would break if we defer the expansion?

Help me understand if this truly needs to be one batch or can be sequential.
```

## Example Conversation

**You:** Implement the login endpoint with these tests.

**Claude Code:** I'll implement login, but we should also add rate limiting to prevent brute force attacks.

**You (using this prompt):**
```
I want to keep this batch focused. Let's negotiate scope:

My proposed batch: Login endpoint that validates credentials and returns token

Your suggestion: Add rate limiting

Questions:
1. Can rate limiting be a separate batch after basic login works?
2. What's the minimum login implementation?
3. What breaks if we add rate limiting in batch 6 instead of now?
```

**Claude Code:** You're right. Rate limiting can be added separately. The minimum login is: validate credentials, return token or error. Nothing breaks by deferring rate limiting - we can add it as middleware in a later batch.

## Why This Works

- Treats Claude Code as a collaborator, not just an executor
- Gets explicit reasoning about dependencies
- Often reveals the expansion isn't required for the batch
- Builds your intuition about what's truly coupled
