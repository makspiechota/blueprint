# Task: Update Documentation for Lean Canvas and Business.yaml

## User Story Reference
All user stories: Ensure users understand Lean Canvas layer and business.yaml orchestration

## Description
Update all documentation to explain business.yaml entry point, Lean Canvas layer, layer orchestration, and when to use Lean Canvas vs North Star.

## Files to Modify/Create
- `README.md` - Update quick start with business.yaml pattern
- `docs/user-guide.md` - Add Lean Canvas and business.yaml sections
- `docs/lean-canvas-guide.md` - New comprehensive Lean Canvas guide
- `docs/layer-orchestration.md` - New guide for business.yaml pattern

## Estimated Lines of Code
~120 lines (README: 25, user-guide: 30, lean-canvas-guide: 40, orchestration: 25)

## Dependencies
- Tasks 001-006 (all features implemented and tested)

## Implementation Notes

### README.md Updates

**Update Quick Start section:**
```markdown
## Quick Start

### 1. Create business.yaml (entry point)

BLUEPRINT uses `business.yaml` as the single entry point for all layers:

\`\`\`yaml
type: business
version: "1.0"
last_updated: "2025-12-20"
title: "My Product"

# All references are optional - use what makes sense for your project
north_star_ref: "north-star.yaml"              # Vision and strategy
lean_canvas_ref: "lean-canvas.yaml"            # Business model
architectural_scope_ref: "architectural-scope.yaml"  # Architecture
\`\`\`

### 2. Create your strategic layer(s)

**Option A: North Star** (vision-focused):
\`\`\`yaml
type: north-star
version: "1.0"
# ... vision, problem, solution, scope
\`\`\`

**Option B: Lean Canvas** (business model-focused):
\`\`\`yaml
type: lean-canvas
version: "1.0"
# ... problem, solution, customers, revenue, costs
\`\`\`

**Option C: Both** (recommended for startups):
Use both North Star for vision narrative and Lean Canvas for business details.

### 3. Validate and Visualize

\`\`\`bash
# Validate your business.yaml and all referenced layers
blueprint validate business.yaml

# Generate HTML visualization with tabbed interface
blueprint visualize business.yaml
# Opens business-visualization.html with tabs for each layer
\`\`\`
```

### docs/user-guide.md Updates

**Add section: "Understanding Layers and business.yaml"**

Explain:
- What is business.yaml and why it's the entry point
- Layer concept (strategic vs architectural)
- Valid layer combinations
- When to use what

**Add section: "Lean Canvas vs North Star"**

Comparison table:
```markdown
| Aspect | North Star | Lean Canvas |
|--------|-----------|-------------|
| Focus | Vision & problem-solution fit | Business model & economics |
| Best for | Product vision, long-term direction | Startup validation, business planning |
| Key elements | Vision, problem, solution, scope | 9 boxes: problem, solution, customers, revenue, costs |
| Audience | Product teams, developers | Founders, investors, business stakeholders |
| Updates | Quarterly or when strategy shifts | Frequently as business model evolves |
```

When to use:
- **North Star only**: Established products with clear business model
- **Lean Canvas only**: Early-stage startups focused on business model validation
- **Both**: Startups wanting vision narrative + business model details (recommended)

### docs/lean-canvas-guide.md (New File)

**Structure:**
```markdown
# Lean Canvas Guide

## What is Lean Canvas?

Lean Canvas is a 1-page business model framework created by Ash Maurya, adapted from Business Model Canvas. It helps entrepreneurs quickly sketch their business model and identify risks.

## BLUEPRINT's Lean Canvas Implementation

### The 9 Boxes

1. **Problem**: Top 3 problems your customers have
2. **Customer Segments**: Who has these problems
3. **Unique Value Proposition**: Why you're different
4. **Solution**: Top 3 features addressing problems
5. **Channels**: How you reach customers
6. **Revenue Streams**: How you make money
7. **Cost Structure**: Your main costs
8. **Key Metrics**: How you measure success
9. **Unfair Advantage**: What can't be easily copied

### YAML Structure

[Full YAML example from feature spec]

### All Fields Optional

Unlike traditional frameworks, BLUEPRINT makes all canvas boxes optional (except metadata). This allows:
- Work-in-progress business models
- Brainstorming sessions
- Partial completion as ideas evolve

### Referencing North Star

Lean Canvas can reference North Star for additional context:

\`\`\`yaml
type: lean-canvas
version: "1.0"
# ...
north_star_ref: "north-star.yaml"  # Optional link to vision
\`\`\`

This creates a complementary relationship:
- North Star: WHY we exist, WHAT problem we solve
- Lean Canvas: HOW we make money, WHO pays

## Examples

[Reference examples/lean-canvas.yaml and examples/lean-canvas-simple.yaml]

## Visualization

The HTML visualization renders a responsive 9-box grid with:
- Cost Structure and Revenue Streams side by side (bottom row)
- Mobile-friendly responsive design
- Print-friendly styling

## Best Practices

1. **Start minimal**: Fill in 3-4 boxes first, iterate
2. **Update frequently**: Lean Canvas should evolve as you learn
3. **Be specific**: "Small retail businesses" not "everyone"
4. **Focus on current reality**: Not 5-year projections
5. **Pair with North Star**: For vision + business model clarity
```

### docs/layer-orchestration.md (New File)

**Structure:**
```markdown
# Layer Orchestration with business.yaml

## Overview

BLUEPRINT uses `business.yaml` as the single entry point that orchestrates all strategic and architectural layers.

## The business.yaml Pattern

\`\`\`yaml
type: business
version: "1.0"
last_updated: "2025-12-20"
title: "Product or Company Name"

# All layer references are optional
north_star_ref: "north-star.yaml"
lean_canvas_ref: "lean-canvas.yaml"
architectural_scope_ref: "architectural-scope.yaml"
\`\`\`

## Why business.yaml?

**Benefits:**
- Single source of truth for what layers exist
- Clear entry point for visualization
- Flexible layer combinations
- Easy to discover project structure

**Without business.yaml**, you'd need to:
- Guess which files exist
- Run validate/visualize on each file separately
- Manually combine layers for stakeholder presentations

## Valid Layer Combinations

All combinations are valid since all references are optional:

1. **Lean Canvas only** - Early-stage startups
2. **North Star only** - Established products
3. **North Star + Lean Canvas** - Startups (recommended)
4. **North Star + Arch Scope** - Technical products
5. **All three layers** - Complete documentation

## Visualization

When you visualize business.yaml, BLUEPRINT:
1. Reads business.yaml
2. Discovers all referenced layer files
3. Parses each referenced file
4. Generates tabbed HTML with one tab per layer
5. Outputs business-visualization.html

## Backward Compatibility

You can still validate/visualize individual files:

\`\`\`bash
blueprint validate lean-canvas.yaml
blueprint visualize north-star.yaml
\`\`\`

This generates standalone visualizations (no tabs).

## Best Practices

1. **Use relative paths** in references: `"./lean-canvas.yaml"`
2. **Keep all files in same directory** for simplicity
3. **Version control everything** including business.yaml
4. **Update last_updated** when changing layer references
```

## Acceptance Criteria
- [ ] README shows business.yaml pattern in Quick Start
- [ ] User guide explains layer orchestration concept
- [ ] User guide includes Lean Canvas vs North Star comparison
- [ ] lean-canvas-guide.md created with complete reference
- [ ] layer-orchestration.md created explaining business.yaml pattern
- [ ] All 9 Lean Canvas boxes documented
- [ ] Examples reference created example files
- [ ] Best practices included for both frameworks
- [ ] Documentation clarifies all layer references are optional
