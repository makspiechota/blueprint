# Feature: Lean Canvas Layer (Strategic Layer 1)

## Problem

BLUEPRINT currently offers only one strategic layer option: North Star DSL. However, many entrepreneurs and product teams prefer the Lean Canvas framework for strategic planning, especially in startup and early-stage product contexts. The Lean Canvas provides a more business-model-focused approach compared to North Star's vision-problem-solution structure.

Without Lean Canvas support, teams using this framework must either:
- Adapt their thinking to fit North Star format (losing familiar structure)
- Maintain Lean Canvas separately outside BLUEPRINT (fragmenting strategic documentation)
- Skip the strategic layer entirely (losing alignment between strategy and architecture)

This creates friction for teams who already think in Lean Canvas terms and want to maintain that methodology while benefiting from BLUEPRINT's architectural scope and visualization capabilities.

## Users

- **Startup Founders**: Need lean, business-model-focused strategic planning
- **Product Managers**: Working in early-stage or entrepreneurial contexts
- **Innovation Teams**: Running internal ventures or new product initiatives
- **Business Strategists**: Prefer business model canvas frameworks over traditional vision statements
- **Consultants**: Supporting clients using Lean Startup methodology

## User Stories

1. As a startup founder, I want to define my business strategy using Lean Canvas so that I can maintain the framework I already use while benefiting from BLUEPRINT's visualization

2. As a product manager, I want to create a Lean Canvas as my strategic layer so that I can clearly articulate my business model alongside my architectural scope

3. As an innovation team member, I want to use both North Star and Lean Canvas so that I can capture both visionary direction and business model details

4. As a business strategist, I want to visualize my Lean Canvas in HTML so that I can share it with stakeholders in an accessible format

5. As a consultant, I want to validate Lean Canvas files so that I ensure completeness and correctness before client presentations

6. As a team lead, I want to version control my Lean Canvas in YAML so that I can track evolution of our business model over time

7. As a developer, I want to reference Lean Canvas from documentation so that I understand the business context behind architectural decisions

## Expected Behavior

### File Structure

**Business.yaml Entry Point:**

BLUEPRINT introduces `business.yaml` as the single entry point for visualization. This file references all strategic and architectural layers:

```yaml
type: business
version: "1.0"
last_updated: "2025-12-19"
title: "Product or Company Name"

# All references are optional
north_star_ref: "north-star.yaml"              # Optional
lean_canvas_ref: "lean-canvas.yaml"            # Optional
architectural_scope_ref: "architectural-scope.yaml"  # Optional
```

**Layer Files:**

Lean Canvas files use YAML format with `.yaml` extension, similar to North Star:

```yaml
type: lean-canvas
version: "1.0"
last_updated: "2025-12-19"
title: "Product or Company Name"
north_star_ref: "north-star.yaml"  # Optional: reference to North Star for context

problem:
  top_3_problems:
    - "Problem 1"
    - "Problem 2"
    - "Problem 3"
  existing_alternatives: "How people solve these problems today"

customer_segments:
  target_customers: "Who has the problem"
  early_adopters: "Who will try your solution first"

unique_value_proposition:
  single_clear_message: "Why you are different and worth buying"
  high_level_concept: "X for Y analogy"

solution:
  top_3_features:
    - "Feature 1"
    - "Feature 2"
    - "Feature 3"

channels:
  path_to_customers:
    - "Channel 1"
    - "Channel 2"

revenue_streams:
  revenue_model: "How you will make money"
  lifetime_value: "Revenue per customer"

cost_structure:
  customer_acquisition_cost: "Cost to acquire one customer"
  distribution_costs: "Costs to get product to customers"
  hosting_costs: "Infrastructure and hosting"
  people_costs: "Team salaries"

key_metrics:
  activities_to_measure:
    - "Metric 1"
    - "Metric 2"
    - "Metric 3"

unfair_advantage:
  cant_be_copied: "Your sustainable competitive advantage"
```

### All Fields Optional

- Users can fill in whichever boxes make sense for their context
- No required fields (except metadata: type, version, last_updated, title)
- Validation warns about empty sections but doesn't fail
- Flexibility to use Lean Canvas as brainstorming tool or complete business plan

### Relationship to Other Layers

**Business.yaml Orchestration:**
- `business.yaml` serves as the entry point that references all layers
- All layer references (north_star_ref, lean_canvas_ref, architectural_scope_ref) are optional
- Users can mix and match any combination of layers
- Visualizer reads business.yaml to discover and render all referenced layers

**Lean Canvas Integration:**
- Can reference North Star via `north_star_ref` for additional context
- Provides business model details complementary to North Star's vision narrative
- Both can coexist and will display in separate tabs

**Valid Layer Combinations:**
- Lean Canvas only (via business.yaml → lean_canvas_ref)
- North Star only (via business.yaml → north_star_ref)
- North Star + Architectural Scope (via business.yaml → both refs)
- Lean Canvas + North Star (via business.yaml → both refs)
- All three layers (via business.yaml → all refs)
- Any other combination - all are valid since all references are optional

### Visualization

**Lean Canvas Grid Layout:**
```
┌─────────────────┬──────────────┬─────────────────┬──────────────┬─────────────────┐
│                 │   SOLUTION   │      UNIQUE     │     UNFAIR   │                 │
│    PROBLEM      │              │      VALUE      │   ADVANTAGE  │  CUSTOMER       │
│                 │              │   PROPOSITION   │              │  SEGMENTS       │
├─────────────────┼──────────────┴─────────────────┴──────────────┤                 │
│                 │                                                │                 │
│  KEY METRICS    │              CHANNELS                          │                 │
│                 │                                                │                 │
├─────────────────┴────────────────────────────────────────────────┴─────────────────┤
│                           │                                                        │
│    COST STRUCTURE         │              REVENUE STREAMS                           │
│                           │                                                        │
└───────────────────────────┴────────────────────────────────────────────────────────┘
```

**Note**: Cost Structure and Revenue Streams are side by side (not stacked) for better visual balance.

**Tabbed Interface (when combined with other layers):**
- Tab 1: "Lean Canvas" (if present)
- Tab 2: "North Star" (if present)
- Tab 3: "Architectural Scope" (if present and North Star exists)

**HTML Features:**
- Responsive design (desktop/mobile)
- Print-friendly styling
- No external dependencies
- Standalone shareable file

### CLI Commands

```bash
# Validate individual layer files
blueprint validate lean-canvas.yaml
blueprint validate north-star.yaml
blueprint validate architectural-scope.yaml

# Validate business.yaml (entry point)
blueprint validate business.yaml

# Visualize using business.yaml as entry point
blueprint visualize business.yaml
# Discovers and renders all referenced layers (Lean Canvas, North Star, Arch Scope)

# Backward compatibility: visualize individual files
blueprint visualize lean-canvas.yaml  # Lean Canvas only
blueprint visualize north-star.yaml   # North Star only
```

## Edge Cases

1. **Empty Lean Canvas**: All boxes empty except metadata - validation warns but allows
2. **Partial Completion**: Some boxes filled, others empty - perfectly valid for work-in-progress
3. **Multiple Products**: Each product gets its own business.yaml + layer files in separate directories
4. **Business.yaml with all references empty**: Valid - warns that no layers are referenced
5. **Business.yaml references non-existent files**: Validation fails with clear error message
6. **Only Metadata**: User creates Lean Canvas with just type/version/title - validates successfully
7. **Long Text in Boxes**: Large amounts of text in any section - visualization handles with scrolling/wrapping
8. **Special Characters**: YAML special characters in content - properly escaped and rendered
9. **Missing visualization.html Output**: Default output name: `business-visualization.html` when using business.yaml
10. **Circular References**: Lean Canvas → North Star → Lean Canvas - validation detects and fails
11. **Backward Compatibility**: Old projects without business.yaml continue to work by visualizing individual files

## Success Criteria

- Business.yaml validates successfully as entry point for all layers
- All layer references in business.yaml are optional
- Lean Canvas files validate successfully with all fields optional (except metadata)
- Lean Canvas can optionally reference North Star via north_star_ref
- Validation warns (not fails) on empty Lean Canvas sections
- HTML visualization renders Lean Canvas with side-by-side Cost Structure and Revenue Streams
- Visualization is responsive and print-friendly
- Multiple layers (Lean Canvas + North Star + Arch Scope) display in tabbed interface
- CLI commands work for business.yaml (validate, visualize)
- Backward compatibility: individual layer files can still be validated/visualized
- Circular reference detection prevents infinite loops
- Users can version control all files (business.yaml + layers) in git
- Documentation explains business.yaml entry point pattern
- Documentation explains when to use Lean Canvas vs. North Star
- Examples demonstrate business.yaml with various layer combinations

## Business Value

**Strategic Framework Choice**: Teams can use their preferred strategic planning framework without abandoning BLUEPRINT's architectural capabilities

**Startup-Friendly**: Lowers barrier to entry for startup teams already using Lean Canvas methodology

**Business Model Clarity**: Lean Canvas forces explicit thinking about revenue, costs, and metrics - complementing North Star's vision focus

**Stakeholder Communication**: Investors and business stakeholders often prefer Lean Canvas format over narrative vision statements

**Iterative Strategy**: Lean Canvas's concise format encourages frequent updates as business model evolves

**Dual Perspective**: Teams can maintain both visionary narrative (North Star) and business model details (Lean Canvas) in single system

**Methodology Alignment**: Supports Lean Startup practitioners who want architecture documentation aligned with their strategic approach

## Example: BLUEPRINT Business Lean Canvas

**business.yaml:**
```yaml
type: business
version: "1.0"
last_updated: "2025-12-19"
title: "BLUEPRINT"

north_star_ref: "north-star.yaml"
lean_canvas_ref: "lean-canvas.yaml"
```

**lean-canvas.yaml:**
```yaml
type: lean-canvas
version: "1.0"
last_updated: "2025-12-19"
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

## References

- Lean Canvas: https://leanstack.com/lean-canvas
- Ash Maurya: "Running Lean" (methodology origin)
- Standard Lean Canvas template (9 boxes)
- Business Model Canvas (related framework by Osterwalder)
