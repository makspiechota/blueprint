# Small Batch Prompt Framework

## The Framework

```
## Task
[One sentence description of what to implement]

## Scope
This batch ONLY includes:
- [Specific item 1]
- [Specific item 2]

This batch does NOT include:
- [Explicitly excluded item 1]
- [Explicitly excluded item 2]

## Tests to Pass
[Paste the specific tests this batch must pass]

## Context
[Relevant existing code, types, or interfaces]

## Constraints
- [Time/complexity constraints]
- [Patterns to follow]
- [Libraries to use/avoid]

## Definition of Done
- [ ] All tests pass
- [ ] Code follows existing patterns
- [ ] No changes outside scope
```

## Why Explicit Scope Works

Claude Code, like humans, tends to expand scope when it sees opportunities to "improve" or "complete" things. By explicitly stating what's NOT included, you prevent scope creep.

## Example: User Authentication Batch 3

```
## Task
Implement the login endpoint using existing password hasher and token generator.

## Scope
This batch ONLY includes:
- POST /api/auth/login endpoint
- Request validation
- Calling existing passwordHasher.verify()
- Calling existing tokenGenerator.generate()
- Response with token or error

This batch does NOT include:
- Logout functionality (batch 4)
- Session storage (already implemented)
- Rate limiting (batch 6)
- Password reset (batch 5)

## Tests to Pass
[paste login endpoint tests]

## Context
// Existing implementations to use:
import { passwordHasher } from './password-hasher';
import { tokenGenerator } from './token-generator';
import { userRepository } from './user-repository';

## Definition of Done
- [ ] POST /api/auth/login returns 200 with token for valid credentials
- [ ] Returns 401 for invalid credentials
- [ ] Returns 400 for malformed requests
- [ ] Uses existing hasher and generator (no new implementations)
```
