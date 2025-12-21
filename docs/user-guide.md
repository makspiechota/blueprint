# User Guide

Complete guide to using BLUEPRINT's multi-layer business knowledge management system.

## Understanding Layers and business.yaml

BLUEPRINT uses a multi-layer approach to capture your complete business blueprint:

### Strategic Layers

**Layer 1: North Star** (vision-focused)
- Vision, Problem, Solution, Strategic Goals
- Best for: Product vision, long-term direction
- Audience: Product teams, developers

**Layer 2: Lean Canvas** (business model-focused)
- 9 boxes: Problem, Solution, Customers, Revenue, Costs, Metrics
- Best for: Startup validation, business planning
- Audience: Founders, investors, business stakeholders

### Architectural Layer

**Layer 3: Architectural Scope** (capabilities-focused)
- Six scope lists: Why, What, How, Where, Who, When
- 7±2 items per list (optimal for cognitive load)
- Best for: Technical architecture, capability mapping

### business.yaml - The Entry Point

`business.yaml` orchestrates all layers as a single source of truth:

```yaml
type: business
version: "1.0"
title: "My Product"

# All references are optional
north_star_ref: "north-star.yaml"
lean_canvas_ref: "lean-canvas.yaml"
architectural_scope_ref: "architectural-scope.yaml"
```

**Benefits:**
- Single entry point for visualization
- Flexible layer combinations
- Clear project structure
- Easy stakeholder presentations

See [Layer Orchestration Guide](layer-orchestration.md) for details.

## Lean Canvas vs North Star

| Aspect | North Star | Lean Canvas |
|--------|-----------|-------------|
| Focus | Vision & problem-solution fit | Business model & economics |
| Best for | Product vision, long-term direction | Startup validation, business planning |
| Key elements | Vision, problem, solution, scope | 9 boxes: problem, solution, customers, revenue, costs |
| Audience | Product teams, developers | Founders, investors, business stakeholders |
| Updates | Quarterly or when strategy shifts | Frequently as business model evolves |

### When to Use What

**North Star only**: Established products with clear business model
**Lean Canvas only**: Early-stage startups focused on business model validation
**Both** (recommended): Startups wanting vision narrative + business model details

### How They Work Together

1. **North Star sets vision** - Defines the strategic direction and why you exist
2. **Lean Canvas validates business** - Defines how you make money and who pays
3. **Architectural Scope operationalizes** - Breaks down into concrete capabilities
4. **Visualize together** - See the complete blueprint in tabbed interface
5. **Version control all** - Track evolution of strategy, business, and execution

## What is North Star DSL?

The North Star DSL (Domain-Specific Language) is a YAML-based format for defining the highest level of your business blueprint. It captures:

- **Vision** - Your future state and transformation
- **Problem** - High-level challenges you're addressing
- **Solution** - Your high-level approach
- **Strategic Goals** - Your top-level objectives

The North Star provides strategic clarity and ensures your team shares a common understanding of direction.

## Writing a North Star File

### Basic Structure

Every North Star file follows this structure:

```yaml
type: north-star              # Required: Must be "north-star"
version: "2.0"                # Required: DSL version
last_updated: "2025-12-17"    # Required: ISO date (YYYY-MM-DD)
title: "Your Title"           # Required: Product/company name

vision: |                     # Required: Multi-line string
  Your vision here

problem: |                    # Required: Multi-line string
  Your problem statement

solution: |                   # Required: Multi-line string
  Your solution approach

strategic_goals:              # Required: Array of goals
  - title: "Goal Title"
    description: "Goal description"
```

### Field Descriptions

**type**: Always set to `north-star` for North Star files.

**version**: Current DSL version is `"2.0"`. Use quotes to ensure it's treated as a string.

**last_updated**: Date in ISO format (YYYY-MM-DD). Update this whenever you modify the file.

**title**: Your product or company name. Keep it concise.

**vision**: Describes the future state you're working toward. Use the pipe (`|`) character for multi-line strings. Be aspirational but concrete.

**problem**: High-level challenges and pain points you're addressing. Focus on the "why" - why does this matter?

**solution**: Your high-level approach to solving the problem. Outline the main components or pillars of your solution.

**strategic_goals**: Array of 3-5 top-level objectives. Each goal has:
- `title`: Short, memorable goal name
- `description`: What success looks like for this goal

### Best Practices

1. **Keep it high-level** - North Star is strategic, not tactical. Save details for lower blueprint layers.

2. **Use multi-line strings** - The `|` character makes long text readable:
   ```yaml
   vision: |
     Line 1
     Line 2
     Line 3
   ```

3. **Version control** - Track your North Star in git alongside code. Update `last_updated` with each change.

4. **Review regularly** - North Star should evolve as you learn. Review quarterly or when strategy shifts.

5. **Keep goals focused** - 3-5 strategic goals is ideal. More than that loses focus.

## Understanding Business Motivation (WHY-First)

BLUEPRINT implements Ronald Ross's business motivation framework, placing WHY first as the foundation for all other scope dimensions.

### Business Capability Concept

Each Architectural Scope defines **one business capability** - a distinct unit of business functionality. For example:
- "Customer Onboarding" is a capability
- "Payment Processing" is a capability
- "Inventory Management" is a capability

The entire enterprise has many capabilities. Each gets its own Architectural Scope document.

### Mission vs Goals

Every capability has a **business mission** and optional **business goals**:

**Mission** - What this capability does in day-to-day operations:
- Achieved **directly** through performing the capability
- Has exactly **three components**: action + service + beneficiary
- Example: "to provide secure payment processing for online shoppers"

**Goals** - Ongoing objectives for this capability:
- Achieved **indirectly** by executing the mission well
- All start with "To" (e.g., "To reduce transaction failures")
- **Capability-specific** (not enterprise-wide)
- **Ongoing** (not project objectives like "implement" or "migrate")

### Capability Goals vs Enterprise Strategy

**Important distinction**:
- **North Star strategic goals** = Enterprise-wide objectives (e.g., "Become market leader")
- **WHY capability goals** = Specific to this one capability (e.g., "To improve payment success rate")

If a goal sounds enterprise-wide, it belongs in North Star, not Architectural Scope WHY.

### Why WHY Comes First

In Ross's methodology, WHY is the **most important** scope dimension:
- WHY (business motivation) informs all other decisions
- What entities you need depends on why you exist
- How you operate depends on your goals
- Where, who, when all flow from understanding why

Therefore, WHY always appears **first** in Architectural Scope files.

### The Three Mission Components

Every mission must have:
1. **Action**: Verb phrase starting with "to" (e.g., "to provide", "to enable", "to deliver")
2. **Service**: What you're providing (e.g., "secure payment processing")
3. **Beneficiary**: Who receives value (e.g., "online shoppers")

Together: "to provide secure payment processing for online shoppers"

### Goals Starting with "To"

All goals must start with "To" to emphasize their ongoing nature:
- ✅ Good: "To reduce cart abandonment"
- ✅ Good: "To improve checkout speed"
- ❌ Bad: "Reduce cart abandonment" (sounds like a task)
- ❌ Bad: "Implement faster checkout" (project objective, not ongoing goal)

## Writing an Architectural Scope File

### Basic Structure

Architectural Scope files reference a North Star and define business capabilities:

```yaml
type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "Your Title"
north_star_ref: "north-star.yaml"

why:  # Business motivation (mission and goals)
  mission:
    action: "to provide"
    service: "your service description"
    beneficiary: "your target beneficiaries"
  goals:
    - title: "To achieve first goal"
      description: "Description of ongoing objective"
    - title: "To accomplish second goal"
      description: "Description of another ongoing objective"

what:  # Business entities
  - title: "Entity Name"
    description: "What it represents"

how:  # Business processes
  - title: "Process Name"
    description: "How it works"

where:  # Locations/channels
  - title: "Location Name"
    description: "Where it happens"

who:  # People/roles
  - title: "Role Name"
    description: "Who is involved"

when:  # Timing/lifecycle
  - title: "Phase Name"
    description: "When it occurs"
```

### The Six Scope Lists

**Why** - Business motivation (mission and goals)
- Mission: What this capability does (action + service + beneficiary)
- Goals: Capability-specific ongoing objectives starting with "To"
- Examples: "To reduce cart abandonment", "To improve checkout speed"
- Always appears first (WHY informs all other dimensions)

**What** - Business entities and data
- Examples: Customer, Order, Product, Invoice
- Nouns that represent things in your domain

**How** - Business processes and capabilities
- Examples: Order Processing, Payment, Shipping
- Verbs that represent actions or workflows

**Where** - Physical/logical locations
- Examples: Web Store, Mobile App, Warehouse
- Channels, systems, or places where work happens

**Who** - People, roles, and stakeholders
- Examples: Customer, Support Agent, Manager
- Actors who interact with the system

**When** - Time-based aspects
- Examples: Order Lifecycle, Monthly Billing, Peak Season
- Temporal patterns and timing

### The 7±2 Principle

Research shows humans can hold 7±2 items in working memory. Each scope list should have:
- **Minimum**: 3 items (less suggests incomplete analysis)
- **Optimal**: 7 items (cognitive sweet spot)
- **Maximum**: 12 items (more suggests need to group/abstract)

BLUEPRINT warns you if lists fall outside the 3-12 range.

### Best Practices

1. **Reference your North Star** - Ensure `north_star_ref` points to your North Star file

2. **Start with What and How** - These are usually the easiest to identify

3. **Don't force all six lists** - Some may not apply to your domain

4. **Keep items focused** - Each item should represent one clear concept

5. **Use consistent abstraction** - Items in a list should be at similar levels of detail

6. **Update together** - When your strategy changes, update both layers

## Using the CLI

### Validate Command

Validates both North Star and Architectural Scope files:

```bash
blueprint validate north-star.yaml
blueprint validate architectural-scope.yaml
```

Success output:
```
✓ North Star file is valid: north-star.yaml
✓ Architectural Scope file is valid: architectural-scope.yaml
```

Architectural Scope validation includes warnings:
```
⚠ Validation warnings:
⚠   - what list has 2 items (recommended: 3-12, optimal: 7)
✓ Architectural Scope file is valid: architectural-scope.yaml
```

Error output shows specific validation issues:
```
✗ Validation failed: Missing required field: vision
✗ North star file not found: north-star.yaml
```

### Visualize Command

Generates HTML visualizations with automatic layer detection:

**Single layer** (North Star only):
```bash
blueprint visualize north-star.yaml
```

**Combined layers** (automatically detected):
```bash
# If architectural-scope.yaml exists in same directory:
blueprint visualize north-star.yaml

# Or start from architectural scope:
blueprint visualize architectural-scope.yaml
```

**Custom output path**:
```bash
blueprint visualize north-star.yaml -o my-blueprint.html
```

The visualization is a standalone HTML file with:
- Tabbed interface for both layers
- Responsive design for desktop/mobile
- No external dependencies
- Print-friendly styling

You can:
- Open directly in any browser
- Share with stakeholders
- Host on internal wikis
- Include in presentations

### Getting Help

```bash
blueprint --help          # Show all commands
blueprint validate --help # Show validate options
```

## Step-by-Step Tutorial

Let's create a North Star from scratch:

1. **Copy the example**:
   ```bash
   cp examples/sample-north-star.yaml my-north-star.yaml
   ```

2. **Update metadata**:
   - Change `title` to your product/company name
   - Update `last_updated` to today's date

3. **Define your vision**:
   - What future state are you working toward?
   - How will the world be different?
   - Be specific about the transformation

4. **Identify the problem**:
   - What challenges exist today?
   - Who experiences these problems?
   - Why do they matter?

5. **Outline your solution**:
   - What's your approach?
   - What are the main components?
   - How do they work together?

6. **Set strategic goals**:
   - What 3-5 outcomes define success?
   - Make them measurable
   - Ensure they ladder up to the vision

7. **Validate**:
   ```bash
   blueprint validate my-north-star.yaml
   ```

8. **Visualize**:
   ```bash
   blueprint visualize my-north-star.yaml
   ```

9. **Review with your team**:
   - Share the HTML visualization
   - Gather feedback
   - Iterate on clarity and focus

10. **Commit to git**:
    ```bash
    git add my-north-star.yaml
    git commit -m "Add north star definition"
    ```

## Next Steps

- Review the [Architectural Scope Guide](architectural-scope-guide.md) for detailed architectural scope information
- Review the [North Star DSL Specification](north-star-dsl-spec.md) for complete technical details
- Check [Troubleshooting](troubleshooting.md) if you encounter issues
- Explore the [examples](../examples/) for inspiration
