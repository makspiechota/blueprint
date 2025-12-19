# Troubleshooting

Common issues and solutions when using BLUEPRINT.

## Validation Errors

### Missing Required Field

**Error**: `Missing required field: vision`

**Cause**: Your YAML file is missing a required field.

**Solution**: Ensure your file includes all required fields:
- `type`
- `version`
- `last_updated`
- `title`
- `vision`
- `problem`
- `solution`
- `strategic_goals`

### Invalid Type

**Error**: `Type must be "north-star"`

**Cause**: The `type` field has wrong value.

**Solution**: Set `type: north-star` exactly.

### Invalid Date Format

**Error**: `last_updated must be in ISO date format (YYYY-MM-DD)`

**Cause**: Date not in ISO format or not quoted.

**Solution**: Use ISO date format with quotes:
```yaml
last_updated: "2025-12-17"  # Correct
last_updated: 2025-12-17    # Wrong - becomes a number
last_updated: "17/12/2025"  # Wrong - not ISO format
```

### Invalid Strategic Goals

**Error**: `Each strategic goal must have title and description`

**Cause**: Goals array has incomplete entries.

**Solution**: Every goal needs both fields:
```yaml
strategic_goals:
  - title: "Goal Title"
    description: "Goal description"
```

## Architectural Scope Issues

### Missing North Star Reference

**Error**: `North star file not found: north-star.yaml`

**Cause**: The file referenced in `north_star_ref` doesn't exist.

**Solution**: Ensure the north star file exists and the path is correct:
```yaml
north_star_ref: "north-star.yaml"  # Relative to architectural scope file
north_star_ref: "../north-star.yaml"  # Parent directory
north_star_ref: "/absolute/path/north-star.yaml"  # Absolute path
```

### Invalid North Star Reference

**Error**: `North star file is invalid: Validation failed`

**Cause**: The referenced north star file has validation errors.

**Solution**: First fix the north star file:
```bash
blueprint validate north-star.yaml
```

Then validate the architectural scope:
```bash
blueprint validate architectural-scope.yaml
```

### Scope List Size Warnings

**Warning**: `what list has 2 items (recommended: 3-12, optimal: 7)`

**Cause**: Scope list has fewer than 3 or more than 12 items.

**Impact**: Warning only - file still validates. But consider revising for optimal cognitive load.

**Solution**:
- **Too few (<3)**: Add more items or consider if this scope list is complete
- **Too many (>12)**: Group related items or increase abstraction level
- **Optimal (7)**: Ideal number for human working memory

### No Scope Lists Defined

**Warning**: `No scope lists defined (at least one is recommended)`

**Cause**: Architectural scope file has no scope lists (what, how, where, who, when, why).

**Solution**: Add at least one scope list:
```yaml
what:
  - title: "Item 1"
    description: "Description 1"
  - title: "Item 2"
    description: "Description 2"
  - title: "Item 3"
    description: "Description 3"
```

### WHY Mission Structure Errors

**Error**: `WHY mission requires 'action' field starting with 'to '`

**Cause**: WHY section has incorrect structure or mission is missing required fields.

**Solution**: WHY must have mission object with three components:
```yaml
why:
  mission:
    action: "to provide"
    service: "your service description"
    beneficiary: "your target beneficiaries"
  goals:
    - title: "To achieve first goal"
      description: "Description"
```

**Common mistakes**:
- Using old array format: `why: [...]` - must use object with mission + goals
- Missing "to " prefix in action: `action: "provide"` - must start with "to "
- Missing beneficiary field

### WHY Goal Warnings

**Warning**: `WHY goal "Reduce cart abandonment" should start with "To"`

**Cause**: Goal title doesn't start with "To ".

**Solution**: All goals should start with "To " (capital T) to emphasize ongoing nature:
```yaml
goals:
  - title: "To reduce cart abandonment"  # Correct
    description: "Streamline checkout process"
  # Not: title: "Reduce cart abandonment"  # Wrong
```

**Warning**: `WHY goal "Implement faster checkout" appears to be a project objective, not an ongoing goal`

**Cause**: Goal uses project-oriented language like "implement", "migrate", "deploy".

**Solution**: Reframe as ongoing objective, not project task:
```yaml
# Good - ongoing objective
- title: "To improve checkout speed"
  description: "Minimize steps and reduce friction in purchase flow"

# Bad - project objective
- title: "To implement faster checkout"
  description: "Deploy new checkout system"
```

**Warning**: `WHY goal "Become market leader" sounds enterprise-wide, consider moving to North Star strategic goals`

**Cause**: Goal is too broad and enterprise-wide, not capability-specific.

**Solution**: Make goal specific to this capability:
```yaml
# Good - capability-specific
- title: "To increase course completion rates"
  description: "Improve student success through personalized learning paths"

# Bad - enterprise-wide (belongs in North Star)
- title: "To become market leader in online education"
  description: "Dominate the e-learning market"
```

**Key distinction**:
- **Architectural Scope WHY goals**: Specific to this ONE capability
- **North Star strategic goals**: Enterprise-wide objectives

### Combined Visualization Not Working

**Issue**: Visualize only shows one layer, not both.

**Cause 1**: Files in different directories.

**Solution**: Place both files in the same directory:
```
project/
  north-star.yaml
  architectural-scope.yaml
```

**Cause 2**: Wrong filename.

**Solution**: Name the architectural scope file `architectural-scope.yaml` or specify the north star reference correctly.

**Verification**: Check visualization output for both tabs:
- Should see "North Star" tab
- Should see "Architectural Scope" tab

## YAML Syntax Errors

### Unexpected Token

**Error**: `YAMLException: unexpected token`

**Cause**: YAML syntax error (usually indentation).

**Solution**: Check indentation - use 2 spaces, not tabs:
```yaml
strategic_goals:      # No indentation
  - title: "Goal"     # 2 spaces
    description: "X"  # 4 spaces
```

### Multi-line String Issues

**Cause**: Forgetting the `|` character for multi-line strings.

**Solution**: Use pipe character and indent content:
```yaml
vision: |
  Line 1
  Line 2

# Not this:
vision: Line 1
Line 2
```

## Installation Issues

### Command Not Found

**Error**: `blueprint: command not found`

**Cause**: Package not installed globally or not in PATH.

**Solution 1**: Install globally:
```bash
npm install -g blueprint
```

**Solution 2**: Use npx without installing:
```bash
npx blueprint validate file.yaml
```

### Permission Denied

**Error**: `EACCES: permission denied`

**Cause**: No write permission for npm global directory.

**Solution**: Use npx or fix npm permissions:
```bash
sudo npm install -g blueprint
```

## Visualization Issues

### HTML File Won't Open

**Cause**: File path has spaces or special characters.

**Solution**: Use quotes around paths:
```bash
blueprint visualize "my file.yaml" -o "my output.html"
```

### Visualization Looks Broken

**Cause**: Browser compatibility or file corruption.

**Solution 1**: Try a modern browser (Chrome, Firefox, Safari, Edge).

**Solution 2**: Regenerate the visualization:
```bash
blueprint visualize input.yaml -o output.html
```

### Special Characters Display Wrong

**Cause**: Character encoding issues.

**Solution**: Ensure your YAML file is UTF-8 encoded. Most editors default to UTF-8, but check editor settings if you see issues.

## File Not Found Errors

**Error**: `File not found: my-file.yaml`

**Cause**: File doesn't exist or wrong path.

**Solution**: Check the file path:
```bash
ls my-file.yaml           # Verify file exists
blueprint validate ./my-file.yaml  # Use relative path
```

## Getting More Help

If you encounter an issue not covered here:

1. Check the [User Guide](user-guide.md) for usage instructions
2. Review the [Architectural Scope Guide](architectural-scope-guide.md) for architectural scope details
3. Review the [North Star DSL Specification](north-star-dsl-spec.md) for syntax details
4. Look at the [examples](../examples/) for correct formatting
5. Report bugs at: [GitHub Issues](https://github.com/makspiechota/blueprint/issues)
