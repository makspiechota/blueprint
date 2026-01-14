# CLAUDE.md Starter Template

Copy this to your repository root and customize.

---

```markdown
# CLAUDE.md

## Project Overview

[2-3 sentences describing what this project does and who it's for]

## Tech Stack

- **Language:** [e.g., TypeScript 5.x with strict mode]
- **Framework:** [e.g., Next.js 14 App Router]
- **Database:** [e.g., PostgreSQL 15 with Prisma ORM]
- **Testing:** [e.g., Vitest + Testing Library]
- **Key Libraries:** [e.g., Zod for validation, TanStack Query]

## Architecture

[One paragraph describing your architecture pattern]

### Structure
```
/src
  /domain         - Business logic, no external dependencies
  /application    - Use cases, orchestrates domain
  /infrastructure - External services, database, APIs
  /presentation   - UI components and pages
```

### Dependency Rules
- Domain has no external imports
- Application imports domain only
- Infrastructure implements domain interfaces
- Presentation can import from any layer

## Conventions

### Naming
- Files: `kebab-case.ts`
- Components: `PascalCase.tsx`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### Async Operations
All async operations return `Result<T, Error>` instead of throwing.

### Testing
- Test files: `*.test.ts` next to source
- Pattern: Given-When-Then with AAA structure
- Mocking: Use dependency injection, not module mocks

## Do

- Use existing patterns from similar files
- Add tests for all new functionality
- Use domain language from the glossary
- Keep functions under 20 lines
- Return early for error cases

## Don't

- Import infrastructure in domain layer
- Use `any` type (use `unknown` if needed)
- Throw exceptions (return Result)
- Add dependencies without team discussion
- Write comments for obvious code

## Domain Glossary

| Term | Definition |
|------|------------|
| [Term] | [What it means in this codebase] |
| [Term] | [What it means in this codebase] |

## Example Patterns

### Service Pattern
```typescript
export class ExampleService {
  constructor(private repo: ExampleRepository) {}

  async execute(input: Input): Promise<Result<Output, Error>> {
    // Implementation
  }
}
```

### Test Pattern
```typescript
describe('ExampleService', () => {
  it('should do something', async () => {
    // Given
    const repo = createMockRepo();
    const service = new ExampleService(repo);

    // When
    const result = await service.execute(input);

    // Then
    expect(result.isOk()).toBe(true);
  });
});
```
```
