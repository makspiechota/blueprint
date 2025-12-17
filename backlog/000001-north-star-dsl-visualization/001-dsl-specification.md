# Task: Define North Star DSL Specification

## User Story Reference
User Story #1: As a product strategist, I want to define my north star using a simple DSL so that I can capture strategic goals in a structured, version-controlled format
User Story #4: As a product manager, I want the DSL to be intuitive and easy to write so that I can focus on strategy rather than syntax

## Description
Create a comprehensive specification document that defines the North Star DSL syntax, structure, and semantics. This will use YAML as the base format for simplicity and readability, with a clear schema for hierarchical goals.

## Files to Modify/Create
- `docs/north-star-dsl-spec.md` - DSL specification document

## Estimated Lines of Code
~80 lines of documentation

## Dependencies
None - this is the foundational task

## Implementation Notes
- Use YAML for the DSL format (widely known, git-friendly, supports hierarchy)
- Define schema for:
  - Goal definitions (id, title, description, metrics)
  - Hierarchical structure (parent-child relationships)
  - Metadata (version, created date, etc.)
- Include examples of valid north star files
- Keep syntax minimal and intuitive
- Document validation rules

Example structure to specify:
```yaml
north_star:
  version: "1.0"
  title: "Product North Star"
  goals:
    - id: goal-1
      title: "Main Strategic Goal"
      description: "..."
      children:
        - id: goal-1-1
          title: "Sub-goal"
          description: "..."
```

## Acceptance Criteria
- [ ] DSL syntax is clearly documented
- [ ] YAML schema is defined with examples
- [ ] Hierarchical goal structure is specified
- [ ] Validation rules are documented
- [ ] Examples demonstrate common use cases
