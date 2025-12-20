# Task: Create JSON Schemas for Lean Canvas and Business Entry Point

## User Story Reference
User stories 5, 6: Validate Lean Canvas files and version control in YAML

## Description
Create JSON schemas for validating Lean Canvas DSL files and the business.yaml entry point. Register both schemas in the schema registry.

## Files to Modify/Create
- `schemas/lean-canvas.schema.json` - New Lean Canvas validation schema
- `schemas/business.schema.json` - New business entry point schema
- `schemas/schema.json` - Update registry to include new schemas

## Estimated Lines of Code
~80 lines (lean-canvas: 50, business: 20, registry update: 10)

## Dependencies
None (first task)

## Implementation Notes

### lean-canvas.schema.json Structure
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["type", "version", "last_updated", "title"],
  "properties": {
    "type": { "const": "lean-canvas" },
    "version": { "type": "string" },
    "last_updated": { "type": "string", "format": "date" },
    "title": { "type": "string" },
    "north_star_ref": { "type": "string" },
    "problem": {
      "type": "object",
      "properties": {
        "top_3_problems": { "type": "array", "items": { "type": "string" } },
        "existing_alternatives": { "type": "string" }
      }
    },
    "customer_segments": {
      "type": "object",
      "properties": {
        "target_customers": { "type": "string" },
        "early_adopters": { "type": "string" }
      }
    },
    "unique_value_proposition": {
      "type": "object",
      "properties": {
        "single_clear_message": { "type": "string" },
        "high_level_concept": { "type": "string" }
      }
    },
    "solution": {
      "type": "object",
      "properties": {
        "top_3_features": { "type": "array", "items": { "type": "string" } }
      }
    },
    "channels": {
      "type": "object",
      "properties": {
        "path_to_customers": { "type": "array", "items": { "type": "string" } }
      }
    },
    "revenue_streams": {
      "type": "object",
      "properties": {
        "revenue_model": { "type": "string" },
        "lifetime_value": { "type": "string" }
      }
    },
    "cost_structure": {
      "type": "object",
      "properties": {
        "customer_acquisition_cost": { "type": "string" },
        "distribution_costs": { "type": "string" },
        "hosting_costs": { "type": "string" },
        "people_costs": { "type": "string" }
      }
    },
    "key_metrics": {
      "type": "object",
      "properties": {
        "activities_to_measure": { "type": "array", "items": { "type": "string" } }
      }
    },
    "unfair_advantage": {
      "type": "object",
      "properties": {
        "cant_be_copied": { "type": "string" }
      }
    }
  }
}
```

### business.schema.json Structure
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["type", "version", "last_updated", "title"],
  "properties": {
    "type": { "const": "business" },
    "version": { "type": "string" },
    "last_updated": { "type": "string", "format": "date" },
    "title": { "type": "string" },
    "north_star_ref": { "type": "string" },
    "lean_canvas_ref": { "type": "string" },
    "architectural_scope_ref": { "type": "string" }
  }
}
```

### schema.json Registry Update
Add entries for both new schemas following existing pattern.

## Acceptance Criteria
- [ ] lean-canvas.schema.json created with all 9 canvas boxes as optional properties
- [ ] business.schema.json created with all layer references optional
- [ ] Both schemas registered in schemas/schema.json
- [ ] All metadata fields (type, version, last_updated, title) required
- [ ] Schemas validate correctly with ajv
- [ ] No breaking changes to existing schemas
