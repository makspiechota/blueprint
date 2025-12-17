# North Star Example

This directory contains an example North Star file demonstrating the YAML DSL syntax.

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
