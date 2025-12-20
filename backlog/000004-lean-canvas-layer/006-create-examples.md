# Task: Create Example Files for Lean Canvas and Business.yaml

## User Story Reference
User stories 1-7: Demonstrate all features with concrete examples

## Description
Create example files demonstrating Lean Canvas and business.yaml orchestration, including the BLUEPRINT business example from the feature spec.

## Files to Modify/Create
- `examples/business.yaml` - Business entry point example
- `examples/lean-canvas.yaml` - BLUEPRINT Lean Canvas example
- `examples/business-lean-only.yaml` - Example with only lean-canvas reference
- `examples/lean-canvas-simple.yaml` - Minimal lean canvas example

## Estimated Lines of Code
~75 lines (business.yaml: 10, lean-canvas.yaml: 50, lean-only: 10, simple: 15)

## Dependencies
- Task 001 (schemas)
- Task 002 (types)
- Task 003 (parser/validator)

## Implementation Notes

### examples/business.yaml

Full orchestration example:
```yaml
type: business
version: "1.0"
last_updated: "2025-12-20"
title: "BLUEPRINT"

north_star_ref: "north-star.yaml"
lean_canvas_ref: "lean-canvas.yaml"
architectural_scope_ref: "architectural-scope.yaml"
```

### examples/lean-canvas.yaml

Complete BLUEPRINT business example (from feature spec):
```yaml
type: lean-canvas
version: "1.0"
last_updated: "2025-12-20"
title: "BLUEPRINT"
north_star_ref: "north-star.yaml"

problem:
  top_3_problems:
    - "Strategic vision documents become stale and disconnected from code"
    - "Business context is lost when developers leave or AI agents need context"
    - "Teams lack structured way to capture business motivation alongside architecture"
  existing_alternatives: "Confluence docs, Notion pages, scattered README files"

customer_segments:
  target_customers: "B2B SaaS engineering teams (5-15 engineers)"
  early_adopters: "Startups using Lean Startup methodology with technical co-founders"

unique_value_proposition:
  single_clear_message: "Version-controlled business knowledge that AI agents can understand"
  high_level_concept: "Git for business strategy"

solution:
  top_3_features:
    - "YAML DSL for North Star, Lean Canvas, and Architectural Scope"
    - "HTML visualization with tabbed interface for all layers"
    - "CLI validation ensuring business knowledge stays current"

channels:
  path_to_customers:
    - "GitHub marketplace"
    - "Developer communities (Reddit, HN, Twitter)"
    - "Technical blog posts and tutorials"
    - "Open source community contributions"

revenue_streams:
  revenue_model: "Open source core + premium enterprise features (team collaboration, analytics)"
  lifetime_value: "Initial: Free OSS adoption, Future: $99/month per team for premium"

cost_structure:
  customer_acquisition_cost: "Content marketing and community building (low CAC via OSS)"
  distribution_costs: "npm hosting (free), GitHub (free)"
  hosting_costs: "None - CLI tool runs locally"
  people_costs: "Initial: Solo developer, Scale: 2-3 engineers + PM"

key_metrics:
  activities_to_measure:
    - "npm downloads per month"
    - "GitHub stars and forks"
    - "Active projects using BLUEPRINT (tracked via GitHub search)"
    - "Community contributions and PRs"
    - "Documentation visits and /sf-plan usage"

unfair_advantage:
  cant_be_copied: "Integration with Claude Code CLI and Software Factory methodology - first-mover advantage in AI-native business documentation"
```

### examples/business-lean-only.yaml

Lean Canvas only example:
```yaml
type: business
version: "1.0"
last_updated: "2025-12-20"
title: "My Startup"

lean_canvas_ref: "lean-canvas-simple.yaml"
```

### examples/lean-canvas-simple.yaml

Minimal example (work in progress):
```yaml
type: lean-canvas
version: "1.0"
last_updated: "2025-12-20"
title: "My Startup Idea"

problem:
  top_3_problems:
    - "Problem 1 - customers struggle with X"
    - "Problem 2 - existing solutions are too expensive"
    - "Problem 3 - current tools are too complex"

customer_segments:
  target_customers: "Small businesses in the retail sector"
  early_adopters: "Tech-savvy store owners"

unique_value_proposition:
  single_clear_message: "Affordable, simple inventory management"
  high_level_concept: "Shopify for local stores"

solution:
  top_3_features:
    - "Mobile-first inventory tracking"
    - "Automated reordering"
    - "Sales analytics dashboard"
```

### Validation

Verify all examples:
```bash
blueprint validate examples/business.yaml
blueprint validate examples/lean-canvas.yaml
blueprint validate examples/business-lean-only.yaml
blueprint validate examples/lean-canvas-simple.yaml
```

Verify visualization:
```bash
blueprint visualize examples/business.yaml
# Should generate business-visualization.html with 3 tabs

blueprint visualize examples/business-lean-only.yaml
# Should generate visualization with 1 tab

blueprint visualize examples/lean-canvas.yaml
# Should generate standalone lean-canvas visualization
```

## Acceptance Criteria
- [ ] business.yaml example with all three layer references
- [ ] lean-canvas.yaml example with complete BLUEPRINT business
- [ ] business-lean-only.yaml example with only lean canvas
- [ ] lean-canvas-simple.yaml example showing minimal valid canvas
- [ ] All examples validate successfully
- [ ] All examples visualize successfully
- [ ] Examples demonstrate different layer combinations
- [ ] BLUEPRINT example matches feature spec exactly
