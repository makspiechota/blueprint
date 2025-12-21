# Task: Update Documentation for Lean Viability Layer

## User Story Reference
- As an executive, I want to understand if our business model is viable so that I can make informed investment decisions

## Description
Update the README and add comprehensive documentation explaining the Lean 1-2-3 viability framework, how to use it, and how it integrates with other BLUEPRINT layers.

## Files to Modify/Create
- `README.md` - Add Lean Viability to supported layers
- `docs/lean-viability.md` - Create detailed documentation (optional, could be part of architecture doc)

## Estimated Lines of Code
~60 lines

## Dependencies
- Task 006: Example must exist to reference in documentation

## Implementation Notes

### Update README.md

Add to supported layers section:
```markdown
### Supported Layers

1. **North Star** - Strategic vision and problem statement
2. **Lean Canvas** - 9-box business model
3. **Lean 1-2-3 Viability** ✨ NEW - Quantitative viability test with work-backwards calculations
4. **Architectural Scope** - Capability boundaries (6 dimensions)
5. **Business Orchestration** - Multi-layer visualization

#### Lean 1-2-3 Viability
Based on Ash Maurya's Lean 1-2-3 framework. Validates business model viability by:
- Defining 3-year revenue success criteria
- Working backwards to calculate required customers
- Deriving acquisition targets from revenue goals
- Generating targets for AAARR metrics layer

**Example:**
\`\`\`bash
blueprint visualize examples/lean-viability.yaml
\`\`\`

Generates `viability-dashboard.html` showing:
- Success criteria ($10M in 3 years)
- Work-backwards calculations
- Required customer acquisition rate
- Generated targets for AAARR import
```

### Add Usage Section
```markdown
## Lean 1-2-3 Viability

### Quick Start

1. Create `lean-viability.yaml`:
\`\`\`yaml
type: lean-viability
version: "1.0"
title: "Your Viability Model"
lean_canvas_ref: "lean-canvas.yaml"

time_horizon:
  duration: 3
  unit: years

success_criteria:
  annual_revenue:
    amount: 10000000
    currency: USD
  target_year: 3

calculations:
  annual_revenue_per_customer:
    amount: 1200
    currency: USD
    basis: "$100/month subscription"
  # ... more calculations
\`\`\`

2. Generate dashboard:
\`\`\`bash
blueprint visualize lean-viability.yaml
\`\`\`

3. Review `viability-dashboard.html` to validate feasibility

### Key Concepts

**Structured Numeric Types**
- Currency amounts: `{ amount: 10000, currency: "USD" }`
- Rates: `{ rate: 231, period: "month" }`
- Time horizons: `{ duration: 3, unit: "years" }`

**Unidirectional Dependencies**
- Viability references: ✅ Lean Canvas (upward)
- Viability references: ❌ AAARR (downward - would create circular dependency)
- AAARR imports targets FROM viability (upward reference)

**Validations**
- Time horizon: Warns if < 2 or > 5 years
- Currency consistency: All amounts must use same currency
- Lean Canvas existence: Must reference valid lean-canvas.yaml
- Sanity checks: Warns if required customers > 1M
```

### Reference Architecture Document
Add note pointing to comprehensive design:
```markdown
For complete architecture and design rationale, see:
- `docs/architecture/business-layer-architecture.md`
```

### Integration Note
```markdown
### Layer Integration

Lean Viability generates targets that cascade to lower layers:
\`\`\`
Lean Canvas (revenue model)
  ↓ referenced by
Lean Viability (work-backwards calculations)
  ↓ generates targets for
AAARR Metrics (import targets)
  ↓ justified by
Policy Charter (KPIs link to AAARR)
  ↓ prioritizes
Backlog (features by AAARR impact)
\`\`\`
```

## Acceptance Criteria
- [ ] README.md updated with Lean Viability section
- [ ] Supported layers list includes Lean 1-2-3 Viability
- [ ] Usage example provided
- [ ] Key concepts explained (structured types, dependencies)
- [ ] Validation rules documented
- [ ] Integration with other layers explained
- [ ] Reference to architecture document added
- [ ] Examples reference examples/lean-viability.yaml
- [ ] Documentation is clear and accessible to non-technical stakeholders
