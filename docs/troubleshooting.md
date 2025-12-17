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
2. Review the [DSL Specification](north-star-dsl-spec.md) for syntax details
3. Look at the [example file](../examples/sample-north-star.yaml) for correct formatting
4. Report bugs at: [GitHub Issues](https://github.com/makspiechota/blueprint/issues)
