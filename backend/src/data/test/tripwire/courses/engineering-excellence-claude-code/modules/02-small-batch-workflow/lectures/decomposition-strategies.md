# Decomposition Strategies

## Strategy 1: Vertical Slicing

Cut through all layers for one small feature.

**Instead of:**
- Build all database models
- Build all API endpoints
- Build all UI components

**Do:**
- Build create user (DB + API + UI)
- Build list users (DB + API + UI)
- Build edit user (DB + API + UI)

Each slice is deployable and demonstrable.

## Strategy 2: Test-Driven Decomposition

Let tests guide batch boundaries.

1. Write one test
2. Implement to pass
3. Write next test
4. Implement to pass

Each test-implementation pair is a batch.

## Strategy 3: Interface First

Define interfaces, then implement behind them.

**Batch 1:** Define types and interfaces
```typescript
interface UserRepository {
  create(user: CreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | null>;
}
```

**Batch 2:** Implement repository
**Batch 3:** Implement service using repository
**Batch 4:** Implement controller using service

## Strategy 4: Happy Path First

Implement the success case, then edge cases.

**Batch 1:** Login with valid credentials works
**Batch 2:** Login with wrong password fails correctly
**Batch 3:** Login with non-existent user fails correctly
**Batch 4:** Login rate limiting works

## Strategy 5: Scaffold, Then Flesh Out

Create structure, then add behavior.

**Batch 1:** Create empty components with props
**Batch 2:** Add state management
**Batch 3:** Add event handlers
**Batch 4:** Add styling

## Choosing a Strategy

| Situation | Best Strategy |
|-----------|---------------|
| New feature from scratch | Vertical slicing |
| Adding to existing code | Test-driven |
| Complex domain logic | Interface first |
| Well-understood feature | Happy path first |
| UI-heavy work | Scaffold first |

## The Decomposition Test

For any batch, ask:
1. Can I describe it in one sentence?
2. Does it have clear inputs and outputs?
3. Can I write a test for it?
4. Can Claude Code complete it in 30 minutes?
5. Can I review it thoroughly?

All yes? Good batch. Any no? Decompose further.
