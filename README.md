# BLUEPRINT

Business knowledge management system with DSL parser and visualization.

## Overview

BLUEPRINT helps you define and communicate your strategic vision through structured DSL (Domain-Specific Language) files. It provides a two-layer approach:

1. **North Star** - Your strategic vision: problem, solution, and goals
2. **Architectural Scope** - Business capabilities organized by Why, What, How, Where, Who, and When

Together, these layers create a complete business blueprint from strategy to execution.

## Features

- **Two-Layer Architecture** - North Star (strategy) + Architectural Scope (capabilities)
- **YAML DSL** - Simple, version-controlled format for business knowledge
- **Six Scope Dimensions** - Why (mission + goals), What, How, Where, Who, When (7±2 items each)
- **Validation** - Schema validation + business rules (scope list sizes)
- **Combined Visualization** - Tabbed HTML view of both layers
- **Auto-Detection** - Automatically finds and combines both files
- **CLI Tools** - Easy-to-use command-line interface

## Installation

```bash
npm install -g blueprint
```

Or use npx without installing:

```bash
npx blueprint <command>
```

## Quick Start

### Option 1: North Star Only

1. Create `north-star.yaml`:

```yaml
type: north-star
version: "2.0"
last_updated: "2025-12-17"
title: "My Product"
vision: "Your vision"
problem: "Your problem"
solution: "Your solution"
strategic_goals:
  - title: "Goal 1"
    description: "Description"
```

2. Validate and visualize:

```bash
blueprint validate north-star.yaml
blueprint visualize north-star.yaml
```

### Option 2: North Star + Architectural Scope

1. Create both files (see `examples/` directory)

2. Create `architectural-scope.yaml`:

```yaml
type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "My Product"
north_star_ref: "north-star.yaml"
why:
  mission:
    action: "to provide"
    service: "online retail shopping experience"
    beneficiary: "customers worldwide"
  goals:
    - title: "To increase customer satisfaction"
      description: "Deliver seamless purchasing experience with fast delivery and easy returns"
    - title: "To reduce cart abandonment"
      description: "Streamline checkout process and provide clear product information"
what:
  - title: "Customer"
    description: "People who buy"
  - title: "Order"
    description: "Purchase request"
  - title: "Product"
    description: "What we sell"
how:
  - title: "Order Processing"
    description: "Handle orders"
  - title: "Inventory Management"
    description: "Track stock"
  - title: "Payment Processing"
    description: "Accept payments"
```

3. Validate and visualize (auto-detects both files):

```bash
blueprint validate architectural-scope.yaml
blueprint visualize north-star.yaml -o blueprint.html
```

The visualization will automatically include both layers in a tabbed interface.

## Documentation

- [User Guide](docs/user-guide.md) - Detailed usage instructions
- [Architectural Scope Guide](docs/architectural-scope-guide.md) - Complete architectural scope reference
- [North Star DSL Specification](docs/north-star-dsl-spec.md) - North Star DSL reference
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions
- [Examples](examples/README.md) - Working examples with explanations

## CLI Commands

```bash
# Validation
blueprint validate <file>        # Validate North Star or Architectural Scope file

# Visualization
blueprint visualize <file>       # Generate HTML visualization
                                 # Auto-detects and combines both layers if present

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
