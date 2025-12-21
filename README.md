# BLUEPRINT

Business knowledge management system with DSL parser and visualization.

## Overview

BLUEPRINT helps you define and communicate your strategic vision and business model through structured DSL (Domain-Specific Language) files. It provides a multi-layer approach:

1. **North Star** - Strategic vision: problem, solution, and goals
2. **Lean Canvas** - Business model: customers, revenue, costs, and metrics
3. **Architectural Scope** - Business capabilities organized by Why, What, How, Where, Who, and When

Use `business.yaml` as the entry point to orchestrate all layers. Together, these create a complete business blueprint from strategy to execution.

## Features

- **Multi-Layer Architecture** - North Star (vision) + Lean Canvas (business model) + Architectural Scope (capabilities)
- **business.yaml Orchestration** - Single entry point for all layers with flexible combinations
- **YAML DSL** - Simple, version-controlled format for business knowledge
- **Lean Canvas Support** - 9-box business model framework (problem, solution, customers, revenue, costs)
- **Six Scope Dimensions** - Why (mission + goals), What, How, Where, Who, When (7±2 items each)
- **Validation** - Schema validation + business rules for all layer types
- **Tabbed Visualization** - HTML view with tabs for each layer
- **CLI Tools** - Easy-to-use command-line interface for validate and visualize

## Installation

```bash
npm install -g blueprint
```

Or use npx without installing:

```bash
npx blueprint <command>
```

## Quick Start

### 1. Create business.yaml (entry point)

BLUEPRINT uses `business.yaml` as the single entry point for all layers:

```yaml
type: business
version: "1.0"
last_updated: "2025-12-20"
title: "My Product"

# All references are optional - use what makes sense for your project
north_star_ref: "north-star.yaml"              # Vision and strategy
lean_canvas_ref: "lean-canvas.yaml"            # Business model
architectural_scope_ref: "architectural-scope.yaml"  # Architecture
```

### 2. Create your strategic layer(s)

**Option A: North Star** (vision-focused):
```yaml
type: north-star
version: "1.0"
last_updated: "2025-12-20"
title: "My Product"
vision: "Your vision"
problem: "Your problem"
solution: "Your solution"
strategic_goals:
  - title: "Goal 1"
    description: "Description"
```

**Option B: Lean Canvas** (business model-focused):
```yaml
type: lean-canvas
version: "1.0"
last_updated: "2025-12-20"
title: "My Product"
problem:
  top_3_problems:
    - "Problem 1 - customers struggle with X"
    - "Problem 2 - existing solutions are too expensive"
    - "Problem 3 - current tools are too complex"
customer_segments:
  target_customers: "Your target market"
unique_value_proposition:
  single_clear_message: "Your unique value"
solution:
  top_3_features:
    - "Feature 1"
    - "Feature 2"
    - "Feature 3"
```

**Option C: Both** (recommended for startups):
Use both North Star for vision narrative and Lean Canvas for business details.

### 3. Validate and Visualize

```bash
# Validate your business.yaml and all referenced layers
blueprint validate business.yaml

# Generate HTML visualization with tabbed interface
blueprint visualize business.yaml
# Opens business-visualization.html with tabs for each layer
```

## Documentation

- [User Guide](docs/user-guide.md) - Detailed usage instructions
- [Layer Orchestration](docs/layer-orchestration.md) - business.yaml pattern and layer combinations
- [Lean Canvas Guide](docs/lean-canvas-guide.md) - Complete Lean Canvas reference
- [Architectural Scope Guide](docs/architectural-scope-guide.md) - Complete architectural scope reference
- [North Star DSL Specification](docs/north-star-dsl-spec.md) - North Star DSL reference
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions
- [Examples](examples/README.md) - Working examples with explanations

## CLI Commands

```bash
# Validation
blueprint validate <file>        # Validate any layer file (business, north-star, lean-canvas, architectural-scope)

# Visualization
blueprint visualize <file>       # Generate HTML visualization
                                 # business.yaml creates tabbed view with all referenced layers

# Other
blueprint --version              # Show version
blueprint --help                 # Show help
```

## Development

```bash
npm install        # Install dependencies
npm run build      # Build TypeScript
npm test          # Run tests
```

## Software Factory

This project uses Software Factory methodology with systematic practices and PR review mode.
