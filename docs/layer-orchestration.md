# Layer Orchestration with business.yaml

## Overview

BLUEPRINT uses `business.yaml` as the single entry point that orchestrates all strategic and architectural layers.

## The business.yaml Pattern

```yaml
type: business
version: "1.0"
last_updated: "2025-12-20"
title: "Product or Company Name"

# All layer references are optional
north_star_ref: "north-star.yaml"
lean_canvas_ref: "lean-canvas.yaml"
architectural_scope_ref: "architectural-scope.yaml"
```

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

```bash
blueprint validate lean-canvas.yaml
blueprint visualize north-star.yaml
```

This generates standalone visualizations (no tabs).

## Best Practices

1. **Use relative paths** in references: `"./lean-canvas.yaml"` or just `"lean-canvas.yaml"`
2. **Keep all files in same directory** for simplicity
3. **Version control everything** including business.yaml
4. **Update last_updated** when changing layer references
