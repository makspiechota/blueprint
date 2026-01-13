# The CLAUDE.md File

## What Is CLAUDE.md?

CLAUDE.md is a special file that Claude Code automatically reads when working in your repository. It's your project's constitution - the rules and context that should always apply.

## Placement

Put CLAUDE.md in your repository root:

```
my-project/
├── CLAUDE.md          <- Here
├── src/
├── tests/
├── package.json
└── README.md
```

Claude Code reads this file automatically at the start of each session.

## Structure

### Essential Sections

```markdown
# CLAUDE.md

## Project Overview
[2-3 sentences about what this project does]

## Tech Stack
- Language: TypeScript 5.x
- Framework: Next.js 14
- Database: PostgreSQL with Prisma
- Testing: Vitest + React Testing Library

## Architecture
[Brief description of your architecture pattern]

## Key Conventions
[Your most important conventions]

## Do / Don't
### Do
- [What Claude Code should always do]

### Don't
- [What Claude Code should never do]
```

### Example CLAUDE.md

```markdown
# CLAUDE.md

## Project Overview
E-commerce platform for digital products. Handles product catalog,
checkout, and digital delivery. Multi-tenant SaaS architecture.

## Tech Stack
- TypeScript 5.3+ with strict mode
- Next.js 14 (App Router)
- PostgreSQL 15 with Prisma ORM
- Stripe for payments
- Vitest for testing

## Architecture
Hexagonal architecture with clear boundaries:
- /src/domain - Pure business logic, no external imports
- /src/application - Use cases, orchestrates domain
- /src/infrastructure - External services, DB, APIs
- /src/presentation - Next.js pages and API routes

## Key Conventions
- All async operations return Result<T, Error>
- Services are injected, never imported directly
- Tests follow Given-When-Then structure
- Database operations go through repositories only

## Do
- Use existing patterns from similar files
- Add tests for new functionality
- Use domain language (see glossary below)
- Keep functions under 20 lines

## Don't
- Import infrastructure in domain layer
- Use any type (use unknown if needed)
- Throw exceptions (return Result instead)
- Add dependencies without discussion

## Domain Glossary
- **Merchant:** Organization selling products
- **Storefront:** Public-facing shop for a merchant
- **Catalog:** Collection of products in a storefront
- **License:** Purchased entitlement to a digital product
```

## Benefits

1. **Consistency** - Every Claude Code session starts with the same context
2. **Guardrails** - Do/Don't rules prevent common mistakes
3. **Onboarding** - Also useful for new team members
4. **Maintenance** - Single source of truth for project conventions
