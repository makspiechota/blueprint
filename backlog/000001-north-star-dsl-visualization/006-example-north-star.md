# Task: Create Example North Star File

## User Story Reference
User Story #1: As a product strategist, I want to define my north star using a simple DSL
User Story #4: As a product manager, I want the DSL to be intuitive and easy to write

## Description
Create a comprehensive example North Star DSL file by extracting the north star layer content (vision, problem, solution, strategic goals) from the actual Software Factory document. This will demonstrate the YAML DSL syntax and serve as a template for users.

## Files to Modify/Create
- `examples/sample-north-star.yaml` - Example north star file
- `examples/README.md` - Guide to the example

## Estimated Lines of Code
~95 lines (The actual north star is comprehensive with ~80 lines, README: ~15)

## Dependencies
- Task 001 (DSL specification)

## Implementation Notes
- Extract north star layer content from the actual Software Factory document:
  - **Vision**: Software development as manufacturing, engineers design/supervise, AI agents execute
  - **Problem**: Post-PMF companies can't scale, no systematic process, can't leverage AI
  - **Solution**: Build Software Factories through 3 components (practices, platform, services)
  - **Strategic Goals**: Enable strategic clarity, scale velocity, pioneer category
- Use pure YAML format following the DSL specification
- Include comments in YAML to guide users on each section
- Use multi-line strings (|) for vision, problem, and solution
- Structure strategic_goals as array with title and description
- README should explain:
  - What the example demonstrates (Software Factory north star)
  - How to use it with the CLI tool
  - How to customize for their needs
  - The DSL structure (type, version, content properties)

Example structure (comprehensive Software Factory north star):
```yaml
type: north-star
version: "2.0"
last_updated: 2025-01-28
title: "Software Factory"

# Vision: Future state and transformation
vision: |
  Software development operates like modern manufacturing.
  Engineers design products and supervise production.
  AI agents execute the manufacturing.
  The result: systematic, scalable, high-quality software delivery.

# Problem: High-level challenges
problem: |
  Post-PMF B2B SaaS companies (5-15 engineers) face:
  - No systematic production process (ad-hoc, hero-driven)
  - Can't scale engineering velocity proportionally
  - Can't leverage AI effectively (no foundation)
  - Fragmented context (strategy, specs, code disconnected)

# Solution: High-level approach
solution: |
  Build Software Factories through three components:
  1. Engineering Excellence - 6 practices (operating procedures)
  2. BLUEPRINT Platform - Context system (factory control)
  3. Services - Consulting + training (transformation support)

# Strategic Goals: Top-level objectives
strategic_goals:
  - title: "Enable Strategic Clarity"
    description: "Teams have clear, shared understanding of vision and direction"
  - title: "Scale Engineering Velocity"
    description: "Systematic AI-augmented development, 3-6x productivity improvement"
  - title: "Pioneer Software Factory Category"
    description: "Lead the transformation of how software is built globally"
```

## Acceptance Criteria
- [x] Example file uses valid YAML DSL syntax
- [x] Contains all required fields (type, version, last_updated, title, vision, problem, solution, strategic_goals)
- [x] Content extracted from real Software Factory north star
- [x] Comments explain each section
- [x] README provides clear usage instructions
- [x] Example can be successfully parsed and visualized

## Status
[COMPLETED] - 2025-12-17
Actual lines: 145 (sample-north-star.yaml: 63, README.md: 82)
Verified with CLI validate and visualize commands
Commit: [will be added by committer agent]
