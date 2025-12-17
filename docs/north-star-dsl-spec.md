# North Star DSL Specification

Version: 1.0
Last Updated: 2025-12-17

## Overview

The North Star DSL is a YAML-based domain-specific language for defining the highest-level strategic direction of a product or organization. It captures the vision, problem, solution, and strategic goals in a structured, version-controlled format.

## Purpose

The North Star layer represents the aspirational future state and foundational strategic elements. It is deliberately focused and concise, containing only:
- **Vision**: The transformational future state
- **Problem**: The high-level challenges being addressed
- **Solution**: The strategic approach to solving the problem
- **Strategic Goals**: Top-level objectives that drive everything below

**Important**: Detailed information such as target markets, business models, positioning, phases, and metrics belong in lower layers (e.g., strategy layer), not in the North Star.

## Format

North Star documents use pure YAML format with structured properties. This provides:
- Human readability
- Git-friendly version control
- Machine parseability
- Structured validation

## Schema

### Required Fields

All North Star documents must include these fields:

| Field | Type | Description | Format |
|-------|------|-------------|--------|
| `type` | string | Document type identifier | Must be "north-star" |
| `version` | string | Semantic version | e.g., "2.0", "1.5.3" |
| `last_updated` | string | Last modification date | ISO date: YYYY-MM-DD |
| `title` | string | North star title/name | Short, descriptive |
| `vision` | string | Future state and transformation | Multi-line string |
| `problem` | string | High-level problem being solved | Multi-line string |
| `solution` | string | High-level solution approach | Multi-line string |
| `strategic_goals` | array | Top-level strategic objectives | Array of goal objects |

### Strategic Goals Structure

Each goal in the `strategic_goals` array must contain:

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `title` | string | Goal title | Yes |
| `description` | string | Goal description | Yes |

## Multi-line Strings

For rich text content in `vision`, `problem`, and `solution` fields, use YAML multi-line string syntax:

- `|` (literal) - Preserves line breaks
- `>` (folded) - Folds line breaks into spaces

## Validation Rules

A valid North Star document must:

1. Contain all required fields
2. Have `type` set to "north-star"
3. Have `version` in semantic version format (major.minor or major.minor.patch)
4. Have `last_updated` in ISO date format (YYYY-MM-DD)
5. Have non-empty `title`, `vision`, `problem`, and `solution`
6. Have `strategic_goals` as an array with at least one goal
7. Each goal must have non-empty `title` and `description`

## Complete Example

```yaml
type: north-star
version: "2.0"
last_updated: 2025-01-28
title: "Software Factory"

vision: |
  Software development operates like modern manufacturing.
  Engineers design products and supervise production.
  AI agents execute the manufacturing.
  The result: systematic, scalable, high-quality software delivery.

problem: |
  Post-PMF B2B SaaS companies (5-15 engineers) face critical challenges:
  - No systematic production process (ad-hoc, hero-driven development)
  - Can't scale engineering velocity proportionally with team growth
  - Can't leverage AI effectively without systematic foundations
  - Fragmented context (strategy, specs, and code are disconnected)

solution: |
  Build Software Factories through three integrated components:
  1. Engineering Excellence - 6 practices that serve as factory operating procedures
  2. BLUEPRINT Platform - Context system that acts as factory control
  3. Services - Consulting and training to support the transformation

strategic_goals:
  - title: "Enable Strategic Clarity"
    description: "Teams have clear, shared understanding of vision and strategic direction"
  - title: "Scale Engineering Velocity"
    description: "Achieve systematic AI-augmented development with 3-6x productivity improvement"
  - title: "Pioneer Software Factory Category"
    description: "Lead the global transformation of how software is built"
```

## Usage Guidelines

### What Belongs in North Star

- **Vision**: The aspirational future state (3-5 years out)
- **Problem**: High-level challenges you're addressing
- **Solution**: Your strategic approach (not tactical details)
- **Strategic Goals**: Top 3-5 objectives that everything else supports

### What Belongs in Lower Layers

The following should be defined in strategy, product, or other layers:
- Detailed target market analysis (ICP profiles, psychographics)
- Business model specifics (pricing, revenue streams)
- Competitive positioning and messaging
- Detailed phases and timelines
- Success metrics and KPIs
- Tactical initiatives and features

### Best Practices

1. **Keep it concise**: North Star should fit on one screen
2. **Make it aspirational**: Focus on the transformational future state
3. **Avoid tactical details**: Save those for lower layers
4. **Update periodically**: Review quarterly, update when strategy shifts
5. **Make it memorable**: Team should be able to recall the vision

## File Naming Convention

North Star files should be named:
- `north-star.yaml` (for single north star)
- `north-star-[name].yaml` (for multiple north stars)

## Version Control

- Store North Star files in the root or a dedicated `north-star/` directory
- Commit changes with clear messages explaining strategic shifts
- Use git tags for major version updates
- Maintain a changelog for significant updates

## Tooling Support

North Star DSL files can be:
- Parsed and validated using the North Star CLI tool
- Visualized as hierarchical trees
- Referenced by other BLUEPRINT layers
- Used as input for strategic planning tools
