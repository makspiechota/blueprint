# Building Your Project Context Document

## What Is a Project Context Document?

A Project Context Document (PCD) is a structured briefing that gives Claude Code everything it needs to work effectively on your codebase.

Think of it as the document you'd give a senior engineer joining your team - but optimized for AI consumption.

## Structure

### Section 1: Project Overview

```markdown
## Project Overview

**Name:** [Project name]
**Purpose:** [One-paragraph description]
**Tech Stack:** [Languages, frameworks, key libraries]
**Architecture:** [Pattern name and brief description]
```

### Section 2: Architecture

```markdown
## Architecture

### Layers
- **Presentation:** [What handles user interaction]
- **Application:** [What orchestrates use cases]
- **Domain:** [What contains business logic]
- **Infrastructure:** [What handles external concerns]

### Key Patterns
- [Pattern 1]: [Why and when used]
- [Pattern 2]: [Why and when used]

### Boundaries
- [What can depend on what]
- [What must not depend on what]
```

### Section 3: Domain Model

```markdown
## Domain Model

### Core Entities
- **[Entity]:** [Definition and key attributes]
- **[Entity]:** [Definition and key attributes]

### Key Relationships
- [Entity A] has many [Entity B]
- [Entity C] belongs to [Entity D]

### Business Rules
- [Rule 1]
- [Rule 2]
```

### Section 4: Conventions

```markdown
## Conventions

### Naming
- Files: [convention]
- Functions: [convention]
- Classes: [convention]

### Error Handling
- [How errors are represented]
- [How errors are propagated]

### Testing
- [Test file location]
- [Test naming convention]
- [Mocking approach]
```

### Section 5: Examples

```markdown
## Examples

### Example Service
[Code snippet of a well-written service]

### Example Test
[Code snippet of a well-written test]

### Example Component
[Code snippet of a well-written component]
```

## Creating Your PCD

1. **Start with existing docs** - README, architecture docs, onboarding materials
2. **Extract patterns from code** - Find your best examples
3. **Document tribal knowledge** - What do seniors know that's not written?
4. **Test with Claude Code** - Does it generate code matching your standards?
5. **Iterate** - Update when Claude Code makes mistakes

## Maintenance

- Update when architecture changes
- Add examples when you write good code
- Remove outdated patterns
- Review quarterly for accuracy
