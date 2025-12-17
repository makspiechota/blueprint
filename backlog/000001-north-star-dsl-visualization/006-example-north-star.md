# Task: Create Example North Star File

## User Story Reference
User Story #1: As a product strategist, I want to define my north star using a simple DSL
User Story #4: As a product manager, I want the DSL to be intuitive and easy to write

## Description
Create a comprehensive example North Star DSL file using the real Software Factory north star document. This will demonstrate the syntax and serve as a template for users, showcasing the actual product strategy for BLUEPRINT with multiple levels of goals.

## Files to Modify/Create
- `examples/sample-north-star.yaml` - Example north star file
- `examples/README.md` - Guide to the example

## Estimated Lines of Code
~95 lines (The actual north star is comprehensive with ~80 lines, README: ~15)

## Dependencies
- Task 001 (DSL specification)

## Implementation Notes
- Use the actual Software Factory north star document as the example
- The real north star demonstrates:
  - YAML frontmatter format (type, version, last_updated)
  - Markdown content with clear hierarchical structure
  - Vision statement and problem definition
  - Solution components (3-part strategy)
  - Target market (dual ICP strategy)
  - Business model and phases
  - Success metrics and timeline
- This is a comprehensive, real-world example that users can learn from
- Include comments in YAML to guide users
- README should explain:
  - What the example demonstrates (Software Factory vision)
  - How to use it with the CLI tool
  - How to customize for their needs
  - The structure and format (frontmatter + markdown)

Example structure from actual north star:
```yaml
---
type: north-star
version: 2.0
last_updated: 2025-01-28
---

# Business North Star: The Software Factory

## The Vision: Software Factory
[Detailed vision and strategy content...]

## The Problem We Solve
[Problem definition...]

## Our Solution
[Solution components...]
```

## Acceptance Criteria
- [ ] Example file uses valid DSL syntax
- [ ] Demonstrates hierarchical goal structure
- [ ] Goals are realistic and relatable
- [ ] Comments explain key concepts
- [ ] README provides clear usage instructions
- [ ] Example can be successfully parsed and visualized
