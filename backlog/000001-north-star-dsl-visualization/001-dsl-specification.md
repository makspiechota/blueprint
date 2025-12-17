# Task: Define North Star DSL Specification

## User Story Reference
User Story #1: As a product strategist, I want to define my north star using a simple DSL so that I can capture strategic goals in a structured, version-controlled format
User Story #4: As a product manager, I want the DSL to be intuitive and easy to write so that I can focus on strategy rather than syntax

## Description
Create a comprehensive specification document that defines the North Star DSL syntax, structure, and semantics. The DSL uses pure YAML format with structured properties for the strategic document, enabling both human readability and machine parseability.

## Files to Modify/Create
- `docs/north-star-dsl-spec.md` - DSL specification document

## Estimated Lines of Code
~80 lines of documentation

## Dependencies
None - this is the foundational task

## Implementation Notes
- Use pure YAML format (human-readable, git-friendly, structured)
- **Schema** (required fields):
  - `type`: "north-star" (document type identifier)
  - `version`: semantic version (e.g., "2.0")
  - `last_updated`: ISO date (YYYY-MM-DD)
  - `title`: North star title/name
  - `vision`: Future state and transformation (multi-line string)
  - `problem`: High-level problem being solved (multi-line string)
  - `solution`: High-level solution approach (multi-line string)
  - `strategic_goals`: Array of top-level strategic objectives
- Support multi-line strings for rich text content (using | or >)
- Support nested structures for complex goals
- Document validation rules (required fields, format)
- Include examples of valid north star files
- **Note**: Detailed information (target market, business model, positioning, phases, metrics) belongs in lower layers (e.g., strategy layer), not in the north star

Example structure to specify:
```yaml
type: north-star
version: "2.0"
last_updated: 2025-01-28
title: "Software Factory"

vision: |
  Software development operates like modern manufacturing.
  Engineers design products and supervise production.
  AI agents execute the manufacturing.

problem: |
  Post-PMF B2B SaaS companies face challenges:
  - No systematic production process
  - Can't scale engineering velocity
  - Can't leverage AI effectively

solution: |
  Build Software Factories through:
  1. Engineering Excellence (6 practices)
  2. BLUEPRINT Platform (context system)
  3. Services (consulting + training)

strategic_goals:
  - title: "Enable Strategic Clarity"
    description: "Teams have clear understanding of vision"
  - title: "Scale Engineering Velocity"
    description: "Systematic AI-augmented development"
  - title: "Pioneer Software Factory Category"
    description: "Lead the transformation of software development"
```

## Acceptance Criteria
- [ ] DSL syntax is clearly documented (pure YAML)
- [ ] Schema is defined with all required fields
- [ ] North star properties are specified (vision, problem, solution, strategic_goals)
- [ ] Validation rules are documented
- [ ] Examples demonstrate complete north star structure
