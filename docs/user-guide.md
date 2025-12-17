# User Guide

Complete guide to using the BLUEPRINT North Star DSL and visualization tool.

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

## Using the CLI

### Validate Command

Check if your North Star file is valid:

```bash
blueprint validate my-north-star.yaml
```

Success output:
```
✓ North Star file is valid: my-north-star.yaml
```

Error output shows specific validation issues:
```
✗ Validation failed: Missing required field: vision
```

### Visualize Command

Generate HTML visualization:

```bash
blueprint visualize my-north-star.yaml
```

Custom output path:

```bash
blueprint visualize my-north-star.yaml -o custom-name.html
```

The visualization is a standalone HTML file you can:
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

- Review the [DSL Specification](north-star-dsl-spec.md) for complete technical details
- Check [Troubleshooting](troubleshooting.md) if you encounter issues
- Explore the [example file](../examples/sample-north-star.yaml) for inspiration
