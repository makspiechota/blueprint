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

```yaml
type: lean-canvas
version: "1.0"
last_updated: "2025-12-20"
title: "BLUEPRINT"
north_star_ref: "north-star.yaml"  # Optional

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

### All Fields Optional

Unlike traditional frameworks, BLUEPRINT makes all canvas boxes optional (except metadata). This allows:
- Work-in-progress business models
- Brainstorming sessions
- Partial completion as ideas evolve

### Referencing North Star

Lean Canvas can reference North Star for additional context:

```yaml
type: lean-canvas
version: "1.0"
last_updated: "2025-12-20"
title: "My Product"
north_star_ref: "north-star.yaml"  # Optional link to vision
# ... rest of canvas
```

This creates a complementary relationship:
- North Star: WHY we exist, WHAT problem we solve
- Lean Canvas: HOW we make money, WHO pays

## Examples

See complete examples in the `examples/` directory:
- `examples/lean-canvas.yaml` - Complete BLUEPRINT business example
- `examples/lean-canvas-simple.yaml` - Minimal valid canvas

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
