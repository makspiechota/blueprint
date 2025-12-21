# Task: Create Example Lean Viability File

## User Story Reference
- As a business strategist, I want to define a 3-year revenue target so that I can work backwards to required customer acquisition rates
- As a business analyst, I want to see transparent calculation formulas so that I can understand how targets were derived

## Description
Create a realistic example `lean-viability.yaml` file demonstrating the Lean 1-2-3 framework with work-backwards calculations from a $10M revenue goal.

## Files to Modify/Create
- `examples/lean-viability.yaml` - Create new example file

## Estimated Lines of Code
~70 lines (YAML)

## Dependencies
- Task 001: Schema must exist for reference
- Task 002: Types should be generated for validation

## Implementation Notes

### Example Content
Create a realistic SaaS business viability model:

```yaml
type: lean-viability
version: "1.0"
last_updated: "2025-12-21"
title: "BLUEPRINT Viability Model"

# Reference to business model
lean_canvas_ref: "lean-canvas.yaml"

# 3-year viability test
time_horizon:
  duration: 3
  unit: years

# Success criteria (Lean 1-2-3 framework)
success_criteria:
  annual_revenue:
    amount: 10000000
    currency: USD
  target_year: 3

# Work-backwards calculations
calculations:
  # Step 1: Define pricing assumption
  annual_revenue_per_customer:
    amount: 1200
    currency: USD
    basis: "Assumption: $100/month subscription (12 months)"

  # Step 2: Calculate required customers
  required_customers:
    count: 8334
    formula: "annual_revenue / annual_revenue_per_customer = $10M / $1,200"

  # Step 3: Calculate acquisition rate
  customer_acquisition_rate:
    rate: 2778
    period: year
    formula: "required_customers / time_horizon = 8,334 / 3 years"

  # Step 4: Calculate monthly target
  monthly_acquisition_target:
    rate: 231
    period: month
    formula: "customer_acquisition_rate / 12 = 2,778 / 12"

# Generated targets (consumed by AAARR layer)
targets:
  acquisition:
    monthly_signups:
      rate: 231
      period: month

  revenue:
    arpu:
      amount: 100
      currency: USD
      period: month
```

### Realistic Numbers
Use BLUEPRINT (developer tools SaaS) as example:
- $10M ARR in 3 years (ambitious but achievable)
- $100/month ARPU (typical for developer tools)
- ~231 new signups per month needed
- ~8,334 total customers at year 3

### Validation
After creating, test that:
```bash
npm run build
node dist/index.js examples/lean-viability.yaml
```

Should:
- Pass schema validation
- Pass business rules validation
- Generate viability-dashboard.html
- Show no errors, possibly warnings about time horizon

## Acceptance Criteria
- [x] Example file created at examples/lean-viability.yaml
- [x] File includes all required fields
- [x] Uses structured numeric types (CurrencyAmount, RatePeriod, TimeHorizon)
- [x] Calculations show realistic work-backwards from $10M goal
- [x] Formulas are clear and human-readable
- [x] Targets section shows what AAARR will import
- [x] File passes schema validation
- [x] File passes business rules validation
- [x] Generated HTML dashboard displays correctly
- [x] Example is realistic and instructive

## Status
✅ **COMPLETED** - 2025-12-21

**Actual lines:** 66 lines (YAML example file)
**Estimated:** ~70 lines
**Variance:** -4 lines (concise and focused)

**Files Created:**
- `examples/lean-viability.yaml` - Realistic SaaS viability model (66 lines)
- `examples/viability-dashboard.html` - Generated HTML dashboard

**Example Details:**
- BLUEPRINT developer tools SaaS business model
- $10M ARR target in 3 years
- $100/month ARPU (typical for developer tools)
- 231 monthly signups needed
- 8,334 total customers at year 3
- Clear work-backwards calculations with formulas
- Targets flow to AAARR metrics layer

**Validation Results:**
- ✓ Passes schema validation
- ✓ Passes business rules validation
- ✓ Generates HTML dashboard successfully
- ✓ HTML contains all expected sections (Success Criteria, Assumptions, Calculations, Targets)
- ✓ All structured numeric types used correctly
- ✓ Formulas are clear and instructive

**Commit:** [Will be added by committer agent]
