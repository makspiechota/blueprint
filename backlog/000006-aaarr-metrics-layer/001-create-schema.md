# Task: Create AAARR Metrics Schema

## User Story Reference
- As a product manager, I want to see AAARR metrics with targets and current values so that I can identify the biggest gaps
- As a business analyst, I want to visualize the customer factory so that I can identify bottlenecks

## Description
Create JSON Schema for `aaarr-metrics.yaml` supporting the five AAARR stages (Acquisition, Activation, Retention, Referral, Revenue) with multiple sub-metrics per stage, structured numeric types, and target import from viability layer.

## Files to Modify/Create
- `schemas/aaarr-metrics.schema.json` - Create new schema file
- `schemas/schema.json` - Register new schema

## Estimated Lines of Code
~200 lines

## Dependencies
- None (independent schema creation)

## Implementation Notes

### Schema Structure

Follow the pattern from lean-viability.schema.json for structured numeric types:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "/schemas/aaarr-metrics",
  "title": "AAARR Metrics Schema",
  "description": "Customer lifecycle metrics across 5 stages (Acquisition, Activation, Retention, Referral, Revenue)",
  "type": "object",
  "required": ["type", "version", "last_updated", "title", "stages"],
  "properties": {
    "type": { "const": "aaarr-metrics" },
    "version": { "type": "string" },
    "last_updated": { "type": "string", "format": "date" },
    "title": { "type": "string" },
    "lean_viability_ref": { "type": "string" },
    "north_star_ref": { "type": "string" },
    "stages": {
      "type": "object",
      "required": ["acquisition", "activation", "retention", "referral", "revenue"],
      "properties": {
        "acquisition": { "$ref": "#/definitions/AARRRStage" },
        "activation": { "$ref": "#/definitions/AARRRStage" },
        "retention": { "$ref": "#/definitions/AARRRStage" },
        "referral": { "$ref": "#/definitions/AARRRStage" },
        "revenue": { "$ref": "#/definitions/AARRRStage" }
      }
    }
  },
  "definitions": {
    "AARRRStage": {
      "type": "object",
      "required": ["stage_goal", "metrics"],
      "properties": {
        "stage_goal": { "type": "string" },
        "metrics": {
          "type": "array",
          "items": { "$ref": "#/definitions/Metric" }
        }
      }
    },
    "Metric": {
      "type": "object",
      "required": ["id", "name"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^aaarr\\.(acquisition|activation|retention|referral|revenue)\\.[a-z][a-z0-9-]*$"
        },
        "name": { "type": "string" },
        "description": { "type": "string" },
        "target": { "$ref": "#/definitions/MetricValue" },
        "current": { "$ref": "#/definitions/MetricValue" },
        "gap": { "$ref": "#/definitions/GapValue" }
      }
    },
    "MetricValue": {
      "type": "object",
      "properties": {
        "rate": { "type": "number", "minimum": 0 },
        "period": { "type": "string", "enum": ["day", "week", "month", "quarter", "year"] },
        "amount": { "type": "number", "minimum": 0 },
        "currency": { "type": "string", "enum": ["USD", "EUR", "PLN", "GBP"] },
        "percentage": { "type": "number", "minimum": 0, "maximum": 100 },
        "imported_from": { "type": "string" }
      }
    },
    "GapValue": {
      "type": "object",
      "properties": {
        "rate": { "type": "number" },
        "amount": { "type": "number" },
        "percentage": { "type": "number" }
      }
    }
  }
}
```

### Register Schema

Add to `schemas/schema.json`:
```json
{
  "name": "aaarr-metrics",
  "version": "1.0",
  "file": "aaarr-metrics.schema.json",
  "description": "Customer lifecycle metrics layer - AAARR pirate metrics"
}
```

### Key Validation Rules

1. **Semantic IDs**: Must match pattern `aaarr.{stage}.{metric-name}` (e.g., `aaarr.acquisition.signup-rate`)
2. **Stage Names**: Only 5 valid stages (acquisition, activation, retention, referral, revenue)
3. **Structured Numeric Types**: Support rate/period, amount/currency, percentage
4. **Import References**: `imported_from` can reference `lean-viability.targets.*`

## Acceptance Criteria
- [ ] Schema file created at schemas/aaarr-metrics.schema.json
- [ ] Schema registered in schemas/schema.json
- [ ] Supports all 5 AAARR stages as required fields
- [ ] Each stage has stage_goal and metrics array
- [ ] Metric IDs follow semantic convention with pattern validation
- [ ] MetricValue supports rate/period, amount/currency, percentage
- [ ] MetricValue supports imported_from for viability imports
- [ ] GapValue supports calculated differences
- [ ] Schema validates successfully with JSON Schema Draft-07
- [ ] All numeric types use structured format (not primitive numbers)
