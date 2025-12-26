# Blueprint Examples

This directory contains example files demonstrating the YAML DSL syntax for Blueprint layers.

## What This Example Shows

The `sample-north-star.yaml` file shows the actual Software Factory north star, demonstrating:

- Complete YAML DSL structure for the north star layer
- All required fields: type, version, last_updated, title
- Core north star content: vision, problem, solution, strategic_goals
- YAML comments explaining each section
- Multi-line string formatting for readable content

## Using the Example

### Validate the Example

```bash
blueprint validate examples/sample-north-star.yaml
```

### Generate Visualization

```bash
blueprint visualize examples/sample-north-star.yaml
```

This creates `northstar-visualization.html` that you can open in a browser.

### Customize for Your Needs

1. Copy the example file:
   ```bash
   cp examples/sample-north-star.yaml my-north-star.yaml
   ```

2. Update the metadata:
   - `title`: Your product/company name
   - `last_updated`: Today's date (YYYY-MM-DD)

3. Define your north star:
   - `vision`: Your future state and transformation
   - `problem`: High-level challenges you're addressing
   - `solution`: Your high-level approach
   - `strategic_goals`: Your top-level objectives (3-5 goals)

4. Validate your file:
   ```bash
   blueprint validate my-north-star.yaml
   ```

5. Generate visualization:
   ```bash
   blueprint visualize my-north-star.yaml -o my-visualization.html
   ```

## DSL Structure

The North Star DSL has this structure:

```yaml
type: north-star              # Required: Must be "north-star"
version: "2.0"                # Required: DSL version
last_updated: "2025-01-28"    # Required: ISO date (YYYY-MM-DD)
title: "Your Title"           # Required: Product/company name

vision: |                     # Required: Multi-line string
  Your vision here

problem: |                    # Required: Multi-line string
  Your problem statement

solution: |                   # Required: Multi-line string
  Your solution approach

strategic_goals:              # Required: Array of goals
  - title: "Goal Title"       # Each goal needs title
    description: "Description" # and description
```

See the [DSL Specification](../docs/north-star-dsl-spec.md) for complete details.

## Architectural Scope Example

The `sample-architectural-scope.yaml` file shows the Software Factory architectural scope, demonstrating:

- Complete YAML DSL structure for the architectural scope layer
- All six scope lists: What, How, Where, Who, When, Why
- Each list with 5-6 items (optimal sizing following 7±2 principle)
- YAML comments explaining each scope list
- North star reference linking layers together
- Alignment between Why list and north star strategic goals

### Using the Architectural Scope Example

#### Validate the Example

```bash
blueprint validate examples/sample-architectural-scope.yaml
```

#### Generate Combined Visualization

```bash
blueprint visualize examples/sample-architectural-scope.yaml
```

This creates a visualization showing both north star and architectural scope in tabbed interface.

#### Customize for Your Needs

1. First, create your north star (see above)

2. Copy the architectural scope example:
   ```bash
   cp examples/sample-architectural-scope.yaml my-architectural-scope.yaml
   ```

3. Update the metadata:
   - `title`: Your product/company name (should match north star)
   - `last_updated`: Today's date (YYYY-MM-DD)
   - `north_star_ref`: Path to your north star file

4. Define your six scope lists (all optional, but recommended):
   - `what`: Business entities and information objects (3-12 items, 7 optimal)
   - `how`: Business processes and mechanisms (3-12 items, 7 optimal)
   - `where`: Geographic locations and operational boundaries (3-12 items, 7 optimal)
   - `who`: Organizational units and stakeholder groups (3-12 items, 7 optimal)
   - `when`: Critical timing constraints and business cycles (3-12 items, 7 optimal)
   - `why`: Business mission and ongoing goals (3-12 items, 7 optimal)

5. Validate your file:
   ```bash
   blueprint validate my-architectural-scope.yaml
   ```

6. Generate combined visualization:
   ```bash
   blueprint visualize my-architectural-scope.yaml -o my-visualization.html
   ```

### Architectural Scope DSL Structure

The Architectural Scope DSL has this structure:

```yaml
type: architectural-scope      # Required: Must be "architectural-scope"
version: "1.0"                 # Required: DSL version
last_updated: "2025-12-18"     # Required: ISO date (YYYY-MM-DD)
title: "Your Title"            # Required: Product/company name
north_star_ref: path.yaml      # Required: Path to north star file

what:                          # Optional: Business entities
  - title: "Entity Name"
    description: "What this entity is"

how:                           # Optional: Business processes
  - title: "Process Name"
    description: "How this process works"

where:                         # Optional: Geographic boundaries
  - title: "Location Name"
    description: "Where operations occur"

who:                           # Optional: Organizational units
  - title: "Stakeholder Group"
    description: "Who is involved"

when:                          # Optional: Timing constraints
  - title: "Time Period"
    description: "When this happens"

why:                           # Optional: Business motivation
  - title: "Goal or Motivation"
    description: "Why this matters"
```

See the [Architectural Scope DSL Specification](../docs/architectural-scope-dsl-spec.md) for complete details.
