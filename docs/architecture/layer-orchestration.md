# Layer Orchestration Guide

Detailed guide to BLUEPRINT's multi-layer orchestration system and business.yaml v2.0 format.

## Overview

Layer orchestration enables you to manage complex business knowledge across multiple interconnected layers. The `business.yaml` file serves as the central orchestrator, providing a single entry point for validation, visualization, and analysis of your complete business blueprint.

## business.yaml v2.0 Format

The v2.0 format extends v1.0 with enhanced orchestration capabilities and cross-layer validation.

### Basic Structure

```yaml
type: business
version: "2.0"
last_updated: "2025-12-25"
title: "Your Business Name"

# Optional layer references
north_star_ref: "north-star.yaml"
lean_canvas_ref: "lean-canvas.yaml"
architectural_scope_ref: "architectural-scope.yaml"
lean_viability_ref: "lean-viability.yaml"
aaarr_metrics_ref: "aaarr-metrics.yaml"
policy_charter_ref: "policy-charter.yaml"
backlog_ref: "backlog.yaml"
```

### Version Changes

**v2.0 Additions:**
- Enhanced cross-layer validation
- Traceability graph generation
- Automated sync command support
- Backlog integration
- Improved error reporting

**Backward Compatibility:** v2.0 is fully backward compatible with v1.0 files.

## Orchestration Workflow

### 1. Define Your Business Structure

Start by creating `business.yaml` with the layers you need:

```yaml
type: business
version: "2.0"
last_updated: "2025-12-25"
title: "AI Support Assistant"

north_star_ref: "north-star.yaml"
lean_canvas_ref: "lean-canvas.yaml"
architectural_scope_ref: "architectural-scope.yaml"
lean_viability_ref: "lean-viability.yaml"
aaarr_metrics_ref: "aaarr-metrics.yaml"
policy_charter_ref: "policy-charter.yaml"
```

### 2. Create Layer Files

Create each referenced layer file in the same directory or subdirectories. BLUEPRINT resolves relative paths from the business.yaml location.

### 3. Validate Orchestration

```bash
blueprint validate business.yaml
```

This performs:
- Individual layer validation
- Cross-layer reference checking
- Business rule validation
- Consistency verification

### 4. Sync Related Metrics

Use sync commands to maintain consistency:

```bash
# Sync AAARR targets from Lean Viability
blueprint sync aaarr lean-viability.yaml aaarr-metrics.yaml
```

### 5. Visualize Complete Blueprint

```bash
blueprint visualize business.yaml
```

Generates a comprehensive visualization with:
- Tabbed interface for all layers
- Traceability graph view
- Cross-layer relationship indicators

## Multi-Layer System Architecture

### Layer Dependencies

```
North Star (Strategy)
├── Architectural Scope (Capabilities)
│   └── Policy Charter (Operations)
│       └── AAARR Metrics (Performance)
└── Lean Canvas (Business Model)
    ├── Lean Viability (Economics)
    │   └── AAARR Metrics (Targets)
    └── AAARR Metrics (Validation)
```

### Data Flow Patterns

**Unidirectional Flow**: Information flows downward from strategy to execution, preventing circular dependencies.

**Reference Types**:
- `north_star_ref`: Strategic foundation
- `lean_canvas_ref`: Business model validation
- `architectural_scope_ref`: Capability definition
- `lean_viability_ref`: Economic calculations
- `aaarr_metrics_ref`: Performance tracking
- `policy_charter_ref`: Operational governance

### Validation Rules

**Existence Checks**: Referenced files must exist and be parseable.

**Type Validation**: Each reference must point to the correct layer type.

**Cross-Reference Validation**: Internal references between layers must be valid.

**Business Rules**: Layer-specific business rules are enforced.

## Traceability Graph

The traceability graph provides a visual representation of relationships between all business elements.

### Graph Structure

**Nodes**: Represent entities like goals, metrics, tactics, policies
**Edges**: Represent relationships like "addresses", "justified_by", "imported_from"

### Usage Examples

**Impact Analysis**: "How does changing this strategic goal affect operational KPIs?"

**Gap Identification**: "Which architectural goals lack corresponding policy charter goals?"

**Dependency Mapping**: "What breaks if we remove this AAARR metric?"

### Visualization Features

- Interactive graph with zoom and pan
- Color-coded node types
- Relationship strength indicators
- Filter by layer or relationship type
- Export to graph formats

## Sync Operations

Automated synchronization maintains consistency between calculated and tracked metrics.

### AAARR Sync

Synchronizes targets from Lean Viability calculations to AAARR metrics:

```bash
blueprint sync aaarr lean-viability.yaml aaarr-metrics.yaml
```

**What it does:**
- Calculates required metrics from business model
- Updates AAARR target values
- Maintains historical sync records
- Provides change preview

### Sync Validation

Before applying changes, sync validates:
- Source calculations are current
- Target files are compatible
- No conflicting manual overrides
- Business rules still apply

## Examples

### Complete Business Orchestration

See `examples/business-complete.yaml` for a full example with all layers.

### Minimal Orchestration

```yaml
type: business
version: "2.0"
title: "Minimal Startup"
north_star_ref: "north-star.yaml"
lean_canvas_ref: "lean-canvas.yaml"
```

### Enterprise Orchestration

```yaml
type: business
version: "2.0"
title: "Enterprise Platform"
north_star_ref: "strategy/north-star.yaml"
architectural_scope_ref: "architecture/payment-processing.yaml"
policy_charter_ref: "governance/payment-policies.yaml"
aaarr_metrics_ref: "metrics/payment-aaarr.yaml"
backlog_ref: "backlog/payment-features.yaml"
```

## Edge Cases

### Missing Referenced Files

**Symptom**: Validation fails with "file not found" errors

**Solution**: Create missing files or remove references

**Prevention**: Use `--dry-run` validation to check before committing

### Inconsistent Versions

**Symptom**: Cross-layer validation warnings

**Solution**: Update all layers to compatible versions

**Prevention**: Plan version upgrades across all layers

### Large Orchestrations

**Symptom**: Slow validation or visualization

**Solution**: Use incremental validation or split into sub-orchestrations

**Prevention**: Keep orchestrations focused on related capabilities

### Circular References

**Symptom**: Validation errors about circular dependencies

**Solution**: Restructure references to maintain unidirectional flow

**Prevention**: Follow the dependency hierarchy strictly

## Best Practices

### File Organization

- Keep business.yaml at project root
- Group related layers in subdirectories
- Use descriptive filenames
- Maintain consistent naming conventions

### Version Control

- Commit business.yaml with layer files
- Use atomic commits for orchestration changes
- Tag releases with orchestration versions
- Document breaking changes

### Maintenance

- Regular validation checks
- Update last_updated dates
- Review traceability graphs quarterly
- Audit sync operations

### Performance

- Validate incrementally during development
- Use full orchestration validation before releases
- Cache visualizations for large orchestrations
- Monitor sync operation times

## Troubleshooting

### Common Issues

**"Reference not found"**: Check file paths and existence

**"Invalid cross-reference"**: Verify IDs match between layers

**"Version incompatibility"**: Update to compatible layer versions

**"Sync conflicts"**: Resolve manual overrides before syncing

### Debug Commands

```bash
# Detailed validation output
blueprint validate business.yaml --verbose

# Traceability graph export
blueprint visualize business.yaml --traceability-only

# Sync preview
blueprint sync aaarr lean-viability.yaml aaarr-metrics.yaml --dry-run
```

## Integration with CI/CD

Automate orchestration validation in your pipeline:

```yaml
# .github/workflows/validate-blueprint.yml
name: Validate Blueprint
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g blueprint
      - run: blueprint validate business.yaml
```

## Next Steps

- Review [User Guide](user-guide.md) for layer-specific details
- Explore [Examples](../examples/) for working orchestrations
- Check [Troubleshooting](troubleshooting.md) for common issues
- Learn about [Business Layer Architecture](business-layer-architecture.md) for advanced concepts