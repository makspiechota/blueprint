# Task: Create Example North Star File

## User Story Reference
User Story #1: As a product strategist, I want to define my north star using a simple DSL
User Story #4: As a product manager, I want the DSL to be intuitive and easy to write

## Description
Create a comprehensive example North Star DSL file that demonstrates the syntax and serves as a template for users. This should showcase a realistic product strategy with multiple levels of goals.

## Files to Modify/Create
- `examples/sample-north-star.yaml` - Example north star file
- `examples/README.md` - Guide to the example

## Estimated Lines of Code
~55 lines (YAML: ~40, README: ~15)

## Dependencies
- Task 001 (DSL specification)

## Implementation Notes
- Create a realistic example (e.g., product strategy for BLUEPRINT itself)
- Demonstrate:
  - Multiple top-level strategic goals (2-3)
  - Hierarchical breakdown (at least 2-3 levels deep)
  - Clear goal titles and descriptions
  - Proper YAML syntax
- Goals should be meaningful and relatable
- Include comments in YAML to guide users
- README should explain:
  - What the example demonstrates
  - How to use it with the CLI tool
  - How to customize for their needs

Example structure:
```yaml
# North Star for BLUEPRINT Product
north_star:
  version: "1.0"
  title: "BLUEPRINT Product Strategy 2025"
  goals:
    - id: strategic-clarity
      title: "Enable Strategic Clarity"
      description: "Teams have clear understanding of vision"
      children:
        - id: north-star-dsl
          title: "North Star DSL and Visualization"
          # ...
```

## Acceptance Criteria
- [ ] Example file uses valid DSL syntax
- [ ] Demonstrates hierarchical goal structure
- [ ] Goals are realistic and relatable
- [ ] Comments explain key concepts
- [ ] README provides clear usage instructions
- [ ] Example can be successfully parsed and visualized
