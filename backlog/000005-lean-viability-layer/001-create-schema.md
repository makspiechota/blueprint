# Task: Create Lean Viability JSON Schema

## User Story Reference
- As a business strategist, I want to define a 3-year revenue target so that I can work backwards to required customer acquisition rates
- As an AI agent, I want to parse viability calculations so that I can generate consistent AAARR metric targets

## Description
Create the JSON Schema file `lean-viability.schema.json` that defines the structure for Lean 1-2-3 viability files. The schema must support structured numeric types (amount/currency, rate/period) and enforce unidirectional dependencies (can only reference lean-canvas.yaml, not AAARR).

## Files to Modify/Create
- `schemas/lean-viability.schema.json` - Create new schema file

## Estimated Lines of Code
~95 lines

## Dependencies
None - first task

## Implementation Notes

### Schema Structure
Follow existing patterns from `lean-canvas.schema.json`:
- Use JSON Schema Draft-07
- Set `$id` to `/schemas/lean-viability`
- Include `type: "lean-viability"` as constant
- Required fields: `type`, `version`, `last_updated`, `title`

### Structured Numeric Types
Define reusable schemas for:

```json
{
  "definitions": {
    "CurrencyAmount": {
      "type": "object",
      "required": ["amount", "currency"],
      "properties": {
        "amount": { "type": "number", "minimum": 0 },
        "currency": { "type": "string", "enum": ["USD", "EUR", "PLN", "GBP"] }
      }
    },
    "RatePeriod": {
      "type": "object",
      "required": ["rate", "period"],
      "properties": {
        "rate": { "type": "number", "minimum": 0 },
        "period": { "type": "string", "enum": ["day", "week", "month", "quarter", "year"] }
      }
    },
    "TimeHorizon": {
      "type": "object",
      "required": ["duration", "unit"],
      "properties": {
        "duration": { "type": "number", "minimum": 1, "maximum": 10 },
        "unit": { "type": "string", "enum": ["years", "months"] }
      }
    }
  }
}
```

### Main Properties
- `lean_canvas_ref`: string (path to lean-canvas.yaml)
- `time_horizon`: reference to TimeHorizon definition
- `success_criteria`: object with `annual_revenue` (CurrencyAmount) and `target_year` (number)
- `calculations`: object containing:
  - `annual_revenue_per_customer`: CurrencyAmount + `basis` (string)
  - `required_customers`: object with `count` (number) and `formula` (string)
  - `customer_acquisition_rate`: RatePeriod + `formula` (string)
  - `monthly_acquisition_target`: RatePeriod + `formula` (string)
- `targets`: object with optional stage-specific targets (acquisition, activation, retention, referral, revenue)

### Validation Rules
- `time_horizon.duration` should warn if < 2 or > 5 years (in business logic, not schema)
- All currency amounts in `success_criteria` and `calculations` must use same currency (enforced via business validation)
- No references to AAARR layer (enforced by not having such fields)

## Acceptance Criteria
- [ ] Schema file created at `schemas/lean-viability.schema.json`
- [ ] Schema validates against JSON Schema Draft-07
- [ ] All required fields defined (type, version, last_updated, title, time_horizon, success_criteria, calculations, targets)
- [ ] Structured numeric types defined (CurrencyAmount, RatePeriod, TimeHorizon)
- [ ] Enums for currency and period defined
- [ ] Example valid YAML passes schema validation
- [ ] Schema follows existing patterns from lean-canvas.schema.json
