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

Lean Canvas files use YAML format with `.yaml` extension, similar to North Star:

```yaml
type: lean-canvas
version: "1.0"
last_updated: "2025-12-19"
title: "Product or Company Name"

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

**Standalone Usage:**
- Lean Canvas can exist by itself as strategic documentation
- No dependency on North Star or Architectural Scope

**Complementary with North Star:**
- Both can coexist in the same project
- North Star provides vision/problem/solution narrative
- Lean Canvas provides business model details
- Visualization shows both in separate tabs

**Architectural Scope Integration:**
- For now, Architectural Scope only references North Star (not Lean Canvas)
- Future enhancement could allow referencing either/both
- Valid combinations:
  - Lean Canvas only
  - North Star only
  - North Star + Architectural Scope
  - Lean Canvas + North Star
  - Lean Canvas + North Star + Architectural Scope
- Invalid combination:
  - Lean Canvas + Architectural Scope (without North Star)

### Visualization

**Standard 3x3 Grid Layout:**
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
│                           COST STRUCTURE                                           │
│                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│                         REVENUE STREAMS                                            │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

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
# Validate Lean Canvas
blueprint validate lean-canvas.yaml

# Visualize Lean Canvas only
blueprint visualize lean-canvas.yaml

# Auto-detect and combine all layers
blueprint visualize lean-canvas.yaml
# Shows: Lean Canvas + North Star (if exists) + Arch Scope (if exists with North Star)
```

## Edge Cases

1. **Empty Lean Canvas**: All boxes empty except metadata - validation warns but allows
2. **Partial Completion**: Some boxes filled, others empty - perfectly valid for work-in-progress
3. **Multiple Lean Canvas Files**: User has multiple products - each gets its own file
4. **Lean Canvas + Arch Scope (no North Star)**: Validation fails - Arch Scope requires North Star reference
5. **Only Metadata**: User creates file with just type/version/title - validates successfully
6. **Long Text in Boxes**: Large amounts of text in any section - visualization handles with scrolling/wrapping
7. **Special Characters**: YAML special characters in content - properly escaped and rendered
8. **Missing visualization.html Output**: Default output name follows pattern: `lean-canvas-visualization.html`

## Success Criteria

- Lean Canvas files validate successfully with all fields optional
- Validation warns (not fails) on empty sections
- HTML visualization renders standard 3x3 Lean Canvas grid layout
- Visualization is responsive and print-friendly
- Multiple layers (Lean Canvas + North Star + Arch Scope) display in tabbed interface
- Architectural Scope cannot reference Lean Canvas (only North Star) - enforced by validation
- CLI commands work for Lean Canvas files (validate, visualize)
- Auto-detection includes Lean Canvas when present
- Users can version control Lean Canvas files in git
- Documentation explains when to use Lean Canvas vs. North Star
- Examples demonstrate valid Lean Canvas usage

## Business Value

**Strategic Framework Choice**: Teams can use their preferred strategic planning framework without abandoning BLUEPRINT's architectural capabilities

**Startup-Friendly**: Lowers barrier to entry for startup teams already using Lean Canvas methodology

**Business Model Clarity**: Lean Canvas forces explicit thinking about revenue, costs, and metrics - complementing North Star's vision focus

**Stakeholder Communication**: Investors and business stakeholders often prefer Lean Canvas format over narrative vision statements

**Iterative Strategy**: Lean Canvas's concise format encourages frequent updates as business model evolves

**Dual Perspective**: Teams can maintain both visionary narrative (North Star) and business model details (Lean Canvas) in single system

**Methodology Alignment**: Supports Lean Startup practitioners who want architecture documentation aligned with their strategic approach

## References

- Lean Canvas: https://leanstack.com/lean-canvas
- Ash Maurya: "Running Lean" (methodology origin)
- Standard Lean Canvas template (9 boxes)
- Business Model Canvas (related framework by Osterwalder)
