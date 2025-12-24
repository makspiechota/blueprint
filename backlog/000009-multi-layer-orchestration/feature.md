# Feature: Multi-Layer Orchestration

## Problem

BLUEPRINT now has all individual business layers (North Star, Lean Canvas, Lean Viability, AAARR, Architectural Scope, Policy Charter, Backlog), but they exist as separate files without:

- Unified visualization showing all layers together
- Cross-layer validation runner
- Interactive traceability view (click through from metric → goal → capability → feature)
- Single entry point (business.yaml) to orchestrate all layers
- Automated sync between layers (e.g., Viability → AAARR targets)
- Complete validation suite ensuring all layers are consistent

This feature integrates all layers into a cohesive system with visualization, validation, and traceability.

## Users

- **Business Leaders**: Need single-page view of entire business architecture
- **Strategists**: Need to see how strategic goals cascade through all layers
- **Product Managers**: Need to trace from feature → policy → metric → goal → vision
- **Auditors**: Need validation that all layers are consistent and traceable
- **AI Agents**: Need orchestration layer to validate multi-layer consistency
- **Developers**: Need to understand business context by clicking through layers

## User Stories

1. As a business leader, I want a tabbed view of all layers so that I can see the complete picture
2. As a strategist, I want to click an AAARR metric and see everything it impacts so that I understand ripple effects
3. As a product manager, I want to trace a feature back to strategic vision so that I can justify priority
4. As an auditor, I want to run full validation and get a report of all issues so that I can ensure compliance
5. As an AI agent, I want to validate cross-layer consistency so that I can detect orphaned entities
6. As a developer, I want to see a traceability graph so that I understand how my work connects to business goals
7. As a business analyst, I want to sync AAARR targets from Viability so that metrics stay current

## Expected Behavior

**Input:** Updated business.yaml file orchestrating all layers:
```yaml
type: business
version: "2.0"
title: "BLUEPRINT"

# Layer references
north_star_ref: "north-star.yaml"
lean_canvas_ref: "lean-canvas.yaml"
lean_viability_ref: "lean-viability.yaml"  # NEW
aaarr_ref: "aaarr-metrics.yaml"             # NEW
architectural_scope_ref: "architectural-scope.yaml"
policy_charter_ref: "policy-charter.yaml"   # NEW
backlog_ref: "backlog/"                     # NEW (directory)
```

**Processing:**
1. Load all referenced layers
2. Validate each layer individually
3. Validate cross-layer references
4. Build traceability graph
5. Generate unified visualization

**Output:**
- Multi-tabbed HTML visualization showing all layers
- Traceability view with interactive graph
- Validation report with all warnings/errors
- Sync command to update AAARR from Viability
- Complete documentation

## Edge Cases

1. **Missing layer file**: business.yaml references non-existent file → Validator errors with clear message
2. **Circular references**: Layer A → B → C → A → Validator detects cycle and errors
3. **Orphaned entity**: Policy goal doesn't address any Arch Scope goal → Validator errors
4. **Version mismatch**: business.yaml v2.0 but layer is v1.0 → Validator warns
5. **Stale targets**: AAARR target last synced > 90 days ago → Validator warns
6. **Broken traceability**: Feature → Policy → Arch Scope path broken → Validator errors
7. **Large backlog**: 100+ features → Visualization uses pagination/filtering
8. **Multiple business.yaml**: User has multiple projects → CLI handles via --file flag

## Success Criteria

1. ✅ Updated business.yaml schema v2.0 supporting:
   - All 7+ layer references
   - Metadata (title, version, last_updated)
   - Optional layer references (can omit some layers)
2. ✅ Orchestration engine:
   - Loads all referenced layers
   - Validates each layer's schema
   - Validates cross-layer references
   - Builds complete traceability graph
3. ✅ Cross-layer validator enforces:
   - All references point to existing entities
   - No circular dependencies
   - No orphaned entities (everything traces to strategy)
   - Logical consistency across layers
4. ✅ Multi-layer visualization generates HTML with:
   - Tabs for each layer (North Star, Lean Canvas, Viability, AAARR, Arch Scope, Policy, Backlog)
   - Shared styling and navigation
   - Print-friendly (all tabs print)
5. ✅ Traceability view provides:
   - Interactive graph showing all entities and relationships
   - Click any node to see what it references (upward) and what references it (downward)
   - Highlight paths (e.g., show path from feature to vision)
   - Filter by layer, entity type, or keyword
6. ✅ Sync command: `blueprint sync aaarr`
   - Updates AAARR targets from lean-viability.yaml
   - Sets last_synced timestamp
   - Reports what changed
7. ✅ Validation command: `blueprint validate business.yaml`
   - Runs all validators
   - Generates report with errors/warnings
   - Exit code 0 if valid, 1 if errors
8. ✅ Complete example business with all layers
9. ✅ Documentation:
   - How to orchestrate layers
   - Using traceability view
   - Running validation
   - Syncing layers

## Business Value

**Unified View**: Single entry point to visualize entire business architecture

**Traceability**: Complete path from strategic vision to individual features

**Validation**: Automated detection of inconsistencies across all layers

**Maintenance**: Sync commands keep layers consistent as business evolves

**Onboarding**: New team members can explore traceability graph to understand system

**Audit Trail**: Validation reports provide evidence of business alignment

**AI Enablement**: Orchestration layer enables AI agents to work across all layers

## Technical Notes

- business.yaml v2.0 adds new layer references (backward compatible)
- Traceability graph uses D3.js or similar for visualization
- Validation runs in topological order (high to low layers)
- Sync command uses git-like workflow (preview changes, then apply)
- Large backlogs handled with lazy loading/pagination
- Tabbed visualizer extends existing src/visualizer/tabbed-visualizer.ts
- Graph cycles detected using DFS algorithm

## Visualization Features

### Multi-Layer Tabs
- Tab 1: North Star (strategic vision)
- Tab 2: Lean Canvas (business model)
- Tab 3: Lean 1-2-3 Viability (feasibility calculations)
- Tab 4: AAARR Customer Factory (lifecycle metrics)
- Tab 5: Architectural Scope (capability boundaries)
- Tab 6: Policy Charter (operational goals/policies)
- Tab 7: Backlog (implementation features)

### Traceability Graph
- Nodes: All entities colored by layer
- Edges: References between entities (directed arrows)
- Interactions:
  - Click node: Show details and highlight connections
  - Click edge: Show reference metadata
  - Filter: Show only specific layers or paths
  - Search: Find entity by ID or keyword
  - Highlight path: Trace from any entity to vision

### Validation Report
- Summary: Total entities, total references, errors, warnings
- By layer: Issues grouped by layer
- By severity: Critical errors first, then warnings
- Clickable: Click issue to see entity in visualization

## Commands

```bash
# Generate multi-layer visualization
blueprint visualize business.yaml

# Validate all layers
blueprint validate business.yaml

# Sync AAARR targets from viability
blueprint sync aaarr --from lean-viability.yaml --to aaarr-metrics.yaml

# Show traceability for specific entity
blueprint trace aaarr.activation.onboarding-complete

# Generate validation report
blueprint validate business.yaml --output report.html
```

## Dependencies

- Requires: All previous features (000001-000008)
- Blocks: None (final integration layer)

## Priority

**High** - Completes BLUEPRINT business layer with unified interface and validation

## Future Enhancements

- Real-time collaboration (multiple users editing layers)
- Version control integration (show diffs between versions)
- What-if scenarios (change viability assumption, see impact)
- Export to PowerPoint/PDF for presentations
- API endpoints for programmatic access
- Slack/Teams integration (notifications on validation failures)
