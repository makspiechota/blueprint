# User Guide

Complete guide to using BLUEPRINT's two-layer business knowledge management system.

## Two-Layer Architecture

BLUEPRINT uses a two-layer approach to capture your complete business blueprint:

### Layer 1: North Star (Strategic)
Your strategic vision - the "why" and "what for"
- Vision, Problem, Solution
- Strategic Goals
- High-level direction

### Layer 2: Architectural Scope (Tactical)
Your business capabilities - the "what, how, where, who, when, why"
- Six scope lists answering key questions
- 7±2 items per list (optimal for cognitive load)
- References your North Star

### When to Use Each Layer

**Use North Star alone** when:
- Starting a new product/company
- Defining strategic direction
- Communicating vision to stakeholders

**Add Architectural Scope** when:
- Ready to define concrete capabilities
- Planning implementation
- Need to organize business entities and processes

### How They Work Together

1. **North Star sets direction** - Defines the strategic vision
2. **Architectural Scope operationalizes** - Breaks down into concrete capabilities
3. **Visualize together** - See the complete blueprint in one view
4. **Version control both** - Track evolution of strategy and execution

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

## Writing an Architectural Scope File

### Basic Structure

Architectural Scope files reference a North Star and define business capabilities:

```yaml
type: architectural-scope
version: "1.0"
last_updated: "2025-12-18"
title: "Your Title"
north_star_ref: "north-star.yaml"

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

why:  # Goals/motivations
  - title: "Goal Name"
    description: "Why it matters"
```

### The Six Scope Lists

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

**Why** - Business goals and motivations
- Examples: Increase Revenue, Reduce Costs, Improve Quality
- Business drivers and objectives

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
