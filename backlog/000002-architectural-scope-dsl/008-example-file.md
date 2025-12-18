# Task: Create Example Architectural Scope File

## User Story Reference
User Story #1: As a business analyst, I want to define architectural scope using the six scope lists
User Story #4: As a product strategist, I want the DSL to be intuitive and easy to write

## Description
Create a comprehensive example architectural scope file for Software Factory that demonstrates all six scope lists with realistic content, showing how architectural scope builds upon the existing north star example.

## Files to Modify/Create
- `examples/sample-architectural-scope.yaml` - Example architectural scope file
- `examples/README.md` - Update with architectural scope usage instructions

## Estimated Lines of Code
~70 lines (YAML: 50, README update: 20)

## Dependencies
- Task 001 (schema system)
- Task 002 (DSL specification)

## Implementation Notes
- Reference the existing `examples/sample-north-star.yaml` file
- Define Software Factory architectural scope with all six lists:
  - **What**: Core Blueprint entities (North Star, Architectural Scope, etc.)
  - **How**: Key processes (TDD, Code Review, Deployment, etc.)
  - **Where**: Development locations/environments
  - **Who**: Organizational units (Engineering teams, Product teams, etc.)
  - **When**: Critical timing (Sprint cycles, Release windows, etc.)
  - **Why**: Mission and goals for Software Factory capability
- Each scope list should have 5-7 items (optimal range)
- Items should be realistic and aligned with Software Factory vision
- Include YAML comments explaining each section
- Why list should demonstrate mission + goals structure
- README should explain how to use architectural scope with CLI
- Show combined visualization workflow

## Acceptance Criteria
- [ ] Example file references existing north star example
- [ ] All six scope lists defined with realistic content
- [ ] Each list has 5-7 items (optimal sizing)
- [ ] Items align with Software Factory vision
- [ ] YAML comments explain each section
- [ ] Why list demonstrates mission + goals structure
- [ ] Example validates successfully with CLI
- [ ] Combined visualization generates correctly
- [ ] README updated with architectural scope usage
