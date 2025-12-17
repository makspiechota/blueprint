# BLUEPRINT

Business knowledge management system with DSL parser and visualization.

## Overview

BLUEPRINT helps you define and communicate your strategic vision through structured DSL (Domain-Specific Language) files. Start with your North Star - the highest level of your business blueprint containing vision, problem, solution, and strategic goals.

## Features

- **YAML DSL** - Simple, version-controlled format for business knowledge
- **Validation** - Catch errors early with schema validation
- **Visualization** - Generate beautiful HTML visualizations
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

1. Create a north star file (see `examples/sample-north-star.yaml`):

```yaml
type: north-star
version: "2.0"
last_updated: "2025-12-17"
title: "My Product"

vision: |
  Your vision here

problem: |
  Your problem statement

solution: |
  Your solution approach

strategic_goals:
  - title: "Goal 1"
    description: "Description"
```

2. Validate your file:

```bash
blueprint validate my-north-star.yaml
```

3. Generate visualization:

```bash
blueprint visualize my-north-star.yaml
```

## Documentation

- [User Guide](docs/user-guide.md) - Detailed usage instructions
- [DSL Specification](docs/north-star-dsl-spec.md) - Complete DSL reference
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions
- [Example](examples/README.md) - Working example with explanations

## CLI Commands

```bash
blueprint validate <file>        # Validate North Star DSL file
blueprint visualize <file>       # Generate HTML visualization
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
