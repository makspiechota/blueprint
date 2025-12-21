# BLUEPRINT

Business knowledge management system with DSL parser and visualization.

## Overview

BLUEPRINT helps you define and communicate your strategic vision and business model through structured DSL (Domain-Specific Language) files. It provides a multi-layer approach:

1. **North Star** - Strategic vision: problem, solution, and goals
2. **Lean Canvas** - Business model: customers, revenue, costs, and metrics
3. **Lean 1-2-3 Viability** ✨ NEW - Quantitative viability test with work-backwards calculations
4. **Architectural Scope** - Business capabilities organized by Why, What, How, Where, Who, and When

Use `business.yaml` as the entry point to orchestrate all layers. Together, these create a complete business blueprint from strategy to execution.

## Features

- **Multi-Layer Architecture** - North Star (vision) + Lean Canvas (business model) + Lean Viability (quantitative test) + Architectural Scope (capabilities)
- **business.yaml Orchestration** - Single entry point for all layers with flexible combinations
- **YAML DSL** - Simple, version-controlled format for business knowledge
- **Lean Canvas Support** - 9-box business model framework (problem, solution, customers, revenue, costs)
- **Lean 1-2-3 Viability** - Work-backwards calculations from revenue target to daily acquisition metrics
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

## Lean 1-2-3 Viability

Based on Ash Maurya's Lean 1-2-3 framework. Validates business model viability by working backwards from revenue target to daily actions.

### Quick Start

1. Create `lean-viability.yaml`:
```yaml
type: lean-viability
version: "1.0"
title: "Your Viability Model"
lean_canvas_ref: "lean-canvas.yaml"

# 3-year viability test
time_horizon:
  duration: 3
  unit: years

# Success criteria
success_criteria:
  annual_revenue:
    amount: 10000000
    currency: USD
  target_year: 3

# Work-backwards calculations
calculations:
  annual_revenue_per_customer:
    amount: 1200
    currency: USD
    basis: "$100/month subscription"

  required_customers:
    count: 8334
    formula: "$10M / $1,200"

  customer_acquisition_rate:
    rate: 2778
    period: year
    formula: "8,334 / 3 years"

  monthly_acquisition_target:
    rate: 231
    period: month
    formula: "2,778 / 12"

# Optional: Enhanced calculations
  customer_lifetime_value:
    years: 1
    formula: "Average customer lifetime"

  churn_rate:
    monthly_rate: 0.0833
    formula: "1 / (CLV * 12)"

  conversion_rate:
    rate: 0.02
    basis: "2% visitor-to-signup"

  monthly_visitors:
    rate: 11550
    period: month
    formula: "231 / 0.02"

# Targets for AAARR import
targets:
  acquisition:
    monthly_signups:
      rate: 231
      period: month
  revenue:
    arpu:
      amount: 100
      currency: USD
      period: month
```

2. Generate dashboard:
```bash
blueprint visualize lean-viability.yaml
```

3. Review `viability-dashboard.html`:
   - Success criteria ($10M in 3 years)
   - Work-backwards calculations with formulas
   - Customer lifetime value and churn assumptions
   - Conversion funnel metrics
   - Generated targets for AAARR metrics layer

### Key Concepts

**Structured Numeric Types:**
- Currency amounts: `{ amount: 10000, currency: "USD" }`
- Rates/periods: `{ rate: 231, period: "month" }`
- Time horizons: `{ duration: 3, unit: "years" }`

**Unidirectional Dependencies:**
- ✅ Viability references Lean Canvas (upward)
- ❌ Viability does NOT reference AAARR (downward - would create circular dependency)
- ✅ AAARR imports targets FROM viability (upward reference)

**Validations:**
- Time horizon: Warns if < 2 or > 5 years
- Currency consistency: All amounts must use same currency
- Lean Canvas existence: Must reference valid `lean-canvas.yaml`
- Sanity checks: Warns if required customers > 1M

### Layer Integration

Lean Viability generates targets that cascade to lower layers:

```
Lean Canvas (revenue model)
  ↓ referenced by
Lean Viability (work-backwards calculations)
  ↓ generates targets for
AAARR Metrics (import targets)
  ↓ justified by
Policy Charter (KPIs link to AAARR)
  ↓ prioritizes
Backlog (features by AAARR impact)
```

### Example

See `examples/lean-viability.yaml` for a complete working example with:
- $10M ARR target in 3 years
- 231 monthly signups needed
- Customer lifetime value and churn calculations
- Conversion funnel metrics
- Generated targets for AAARR import

## Documentation

- [User Guide](docs/user-guide.md) - Detailed usage instructions
- [Layer Orchestration](docs/layer-orchestration.md) - business.yaml pattern and layer combinations
- [Business Layer Architecture](docs/architecture/business-layer-architecture.md) - Complete multi-layer design and rationale
- [Lean Canvas Guide](docs/lean-canvas-guide.md) - Complete Lean Canvas reference
- [Architectural Scope Guide](docs/architectural-scope-guide.md) - Complete architectural scope reference
- [North Star DSL Specification](docs/north-star-dsl-spec.md) - North Star DSL reference
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions
- [Examples](examples/README.md) - Working examples with explanations

## CLI Commands

```bash
# Validation
blueprint validate <file>        # Validate any layer file
                                 # Supports: business, north-star, lean-canvas,
                                 #           lean-viability, architectural-scope

# Visualization
blueprint visualize <file>       # Generate HTML visualization
                                 # business.yaml creates tabbed view with all referenced layers
                                 # lean-viability.yaml creates viability dashboard

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
