# The Three Types of Context

Claude Code needs three types of context to make good decisions:

## 1. Architectural Context

**What it is:** How your system is structured and why.

**Includes:**
- System boundaries and components
- Data flow patterns
- Technology choices and rationale
- Deployment architecture
- Integration points

**Why Claude Code needs it:**
Without architectural context, Claude Code might:
- Put business logic in the wrong layer
- Create tight coupling where loose coupling exists
- Violate established boundaries
- Duplicate functionality that exists elsewhere

**Example:**
```
Our system follows hexagonal architecture:
- Domain layer: Pure business logic, no external dependencies
- Application layer: Use cases, orchestrates domain
- Infrastructure layer: External services, databases, APIs

Always inject dependencies. Never import infrastructure in domain.
```

## 2. Domain Context

**What it is:** The business language and rules of your domain.

**Includes:**
- Ubiquitous language (what terms mean)
- Business rules and invariants
- Entity relationships
- Domain events and workflows

**Why Claude Code needs it:**
Without domain context, Claude Code might:
- Use generic terms instead of domain language
- Miss critical business rules
- Create invalid state transitions
- Misunderstand entity relationships

**Example:**
```
In our domain:
- "Subscription" is always tied to an "Organization", never a "User"
- "Active" subscription means payment is current AND usage is within limits
- An "Organization" can have multiple "Workspaces"
- "Users" belong to "Workspaces", not directly to "Organizations"
```

## 3. Conventional Context

**What it is:** How your team does things - patterns, styles, conventions.

**Includes:**
- Naming conventions
- File organization
- Error handling patterns
- Testing patterns
- Code style preferences

**Why Claude Code needs it:**
Without conventional context, Claude Code might:
- Generate code that doesn't match your style
- Use different patterns than existing code
- Create inconsistent naming
- Handle errors differently than existing code

**Example:**
```
Our conventions:
- Services are named {Domain}Service (UserService, not UsersService)
- All async functions return Result<T, E>, never throw
- Tests use arrange-act-assert with blank line separators
- Components are in PascalCase folders with index.ts barrel
```

## Combining All Three

The most effective context includes all three types:

```
## Architecture
[hexagonal architecture overview]

## Domain
[ubiquitous language and rules]

## Conventions
[patterns and style guide]
```

Claude Code then generates code that:
- Fits your architecture
- Uses your domain language
- Follows your conventions
