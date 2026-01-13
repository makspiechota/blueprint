# Project Context Document Template

Copy and customize this template for your project.

---

# [Project Name] - Context Document

## Project Overview

**Name:** [Project name]

**Purpose:** [What does this project do? Who is it for? 2-3 sentences]

**Repository:** [URL]

**Tech Stack:**
- Language: [e.g., TypeScript 5.x]
- Framework: [e.g., Next.js 14]
- Database: [e.g., PostgreSQL with Prisma]
- Testing: [e.g., Vitest]
- Other: [Key libraries]

---

## Architecture

### Pattern
[e.g., Hexagonal Architecture, Clean Architecture, MVC, etc.]

### Layer Structure
```
/src
  /domain          - [What goes here]
  /application     - [What goes here]
  /infrastructure  - [What goes here]
  /presentation    - [What goes here]
```

### Dependency Rules
- [What can depend on what]
- [What CANNOT depend on what]

### Key Patterns Used
| Pattern | Usage | Example Location |
|---------|-------|------------------|
| [Pattern] | [When used] | [File path] |
| [Pattern] | [When used] | [File path] |

---

## Domain Model

### Core Entities
| Entity | Description | Key Attributes |
|--------|-------------|----------------|
| [Entity] | [What it represents] | [Important fields] |
| [Entity] | [What it represents] | [Important fields] |

### Relationships
- [Entity A] has many [Entity B]
- [Entity B] belongs to [Entity A]

### Business Rules
1. [Rule: e.g., "Orders can only be cancelled in pending state"]
2. [Rule: e.g., "Users must have verified email to purchase"]
3. [Rule]

### Domain Events
- [Event: e.g., "OrderPlaced" - triggers inventory reservation]
- [Event]

---

## Conventions

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Tests: `*.test.ts` or `*.spec.ts`

### Code Style
- [Key style point]
- [Key style point]

### Error Handling
```typescript
// How we handle errors:
[Code example]
```

### Testing Pattern
```typescript
// Test structure we follow:
[Code example]
```

---

## Examples

### Well-Written Service
```typescript
// [File path]
[Code]
```

### Well-Written Test
```typescript
// [File path]
[Code]
```

### Well-Written Component
```typescript
// [File path]
[Code]
```

---

## Do / Don't

### Always Do
- [ ] [Practice to follow]
- [ ] [Practice to follow]

### Never Do
- [ ] [Practice to avoid]
- [ ] [Practice to avoid]

---

## Glossary

| Term | Definition |
|------|------------|
| [Term] | [What it means in this project] |
| [Term] | [What it means in this project] |
