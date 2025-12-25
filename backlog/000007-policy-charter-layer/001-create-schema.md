# Task: Create Policy Charter Schema

## User Story Reference
- As an operations manager, I want to define operational goals that address architectural capabilities so that strategy translates to execution
- As a compliance officer, I want to document business policies with graduated brackets so that rules are clear and auditable
- As a risk manager, I want to link risks to specific mitigation tactics and policies so that risk management is systematic
- As a business analyst, I want every KPI to reference an AAARR metric so that all measurements are justified

## Description
Create JSON Schema for `policy-charter.yaml` supporting Ronald Ross's Policy Charter framework with goals, tactics, policies, risks, and KPIs. Schema must enforce semantic IDs, bidirectional tactic-policy relationships, graduated policy brackets, and three-level validation.

## Files to Modify/Create
- `schemas/policy-charter.schema.json` - Create new schema file
- `schemas/schema.json` - Register new schema

## Estimated Lines of Code
~250 lines

## Dependencies
- Architectural Scope layer (000002) - for goal addresses validation
- AAARR Metrics layer (000006) - for KPI justification validation

## Implementation Notes

### Schema Structure

Follow existing patterns with semantic ID conventions and structured validation:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "/schemas/policy-charter",
  "title": "Policy Charter Schema",
  "description": "Operational goals, tactics, policies, risks, and KPIs using Ronald Ross Policy Charter framework",
  "type": "object",
  "metadata": {
    "layer": "policy-charter",
    "methodology": "Ronald Ross Policy Charter",
    "purpose": "Connect strategic goals to operational execution with full traceability"
  },
  "required": ["type", "version", "last_updated", "title", "architectural_scope_ref", "aaarr_metrics_ref", "goals"],
  "properties": {
    "type": { "const": "policy-charter" },
    "version": { "type": "string" },
    "last_updated": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
    "title": { "type": "string" },
    "architectural_scope_ref": { "type": "string" },
    "aaarr_metrics_ref": { "type": "string" },
    "goals": {
      "type": "array",
      "items": { "$ref": "#/definitions/Goal" }
    },
    "tactics": {
      "type": "array",
      "items": { "$ref": "#/definitions/Tactic" }
    },
    "policies": {
      "type": "array",
      "items": { "$ref": "#/definitions/Policy" }
    },
    "risks": {
      "type": "array",
      "items": { "$ref": "#/definitions/Risk" }
    },
    "kpis": {
      "type": "array",
      "items": { "$ref": "#/definitions/KPI" }
    }
  },
  "definitions": {
    "Goal": {
      "type": "object",
      "required": ["id", "title", "description", "addresses", "aaarr_impact", "tactics"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^pc\\.goal\\.[a-z][a-z0-9-]*$"
        },
        "title": { "type": "string" },
        "description": { "type": "string" },
        "addresses": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Architectural Scope goal IDs this addresses"
        },
        "aaarr_impact": {
          "type": "array",
          "items": { "type": "string" },
          "description": "AAARR stages impacted"
        },
        "tactics": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Tactic IDs that achieve this goal"
        },
        "policies": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Policy IDs that support this goal"
        },
        "kpis": {
          "type": "array",
          "items": { "type": "string" },
          "description": "KPI IDs that measure this goal"
        },
        "risks": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Risk IDs that threaten this goal"
        }
      }
    },
    "Tactic": {
      "type": "object",
      "required": ["id", "title", "description", "drives_policies"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^pc\\.tactic\\.[a-z][a-z0-9-]*$"
        },
        "title": { "type": "string" },
        "description": { "type": "string" },
        "drives_policies": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Policy IDs driven by this tactic"
        }
      }
    },
    "Policy": {
      "type": "object",
      "required": ["id", "title", "rule", "driven_by_tactic", "enforcement"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^pc\\.policy\\.[a-z][a-z0-9-]*$"
        },
        "title": { "type": "string" },
        "rule": { "type": "string" },
        "driven_by_tactic": { "type": "string" },
        "enforcement": {
          "type": "string",
          "enum": ["mandatory", "guideline"]
        },
        "brackets": {
          "type": "array",
          "items": { "$ref": "#/definitions/PolicyBracket" }
        }
      }
    },
    "PolicyBracket": {
      "type": "object",
      "required": ["condition", "rule"],
      "properties": {
        "condition": { "type": "string" },
        "rule": { "type": "string" }
      }
    },
    "Risk": {
      "type": "object",
      "required": ["id", "description", "probability", "impact", "mitigation"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^pc\\.risk\\.[a-z][a-z0-9-]*$"
        },
        "description": { "type": "string" },
        "probability": {
          "type": "string",
          "enum": ["low", "medium", "high"]
        },
        "impact": {
          "type": "string",
          "enum": ["low", "medium", "high"]
        },
        "mitigation": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Tactic or policy IDs that mitigate this risk"
        }
      }
    },
    "KPI": {
      "type": "object",
      "required": ["id", "name", "target", "current", "measurement_frequency", "justification"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^pc\\.kpi\\.[a-z][a-z0-9-]*$"
        },
        "name": { "type": "string" },
        "description": { "type": "string" },
        "target": { "$ref": "#/definitions/KPIValue" },
        "current": { "$ref": "#/definitions/KPIValue" },
        "measurement_frequency": {
          "type": "string",
          "enum": ["daily", "weekly", "monthly", "quarterly"]
        },
        "justification": { "type": "string" }
      }
    },
    "KPIValue": {
      "type": "object",
      "properties": {
        "rate": { "type": "number", "minimum": 0 },
        "amount": { "type": "number", "minimum": 0 },
        "percentage": { "type": "number", "minimum": 0, "maximum": 100 }
      }
    }
  }
}
```

### Register Schema

Add to `schemas/schema.json`:
```json
{
  "name": "policy-charter",
  "version": "1.0",
  "file": "policy-charter.schema.json",
  "description": "Policy Charter layer - operational goals, tactics, policies, risks, and KPIs"
}
```

### Key Validation Rules

1. **Semantic IDs**: Goals `pc.goal.*`, Tactics `pc.tactic.*`, Policies `pc.policy.*`, Risks `pc.risk.*`, KPIs `pc.kpi.*`
2. **Ross Framework**: Tactics drive policies (bidirectional links enforced)
3. **Graduated Brackets**: Support threshold-based policy rules
4. **Three-Level Validation**: Reference existence, type consistency, logical consistency
5. **Traceability**: Goals address Arch Scope, KPIs justify AAARR metrics

## Acceptance Criteria
- [ ] Schema file created at schemas/policy-charter.schema.json
- [ ] Schema registered in schemas/schema.json
- [ ] Supports all 5 entity types (goals, tactics, policies, risks, KPIs)
- [ ] Semantic ID patterns enforced for all entities
- [ ] Bidirectional tactic-policy relationships supported
- [ ] Graduated policy brackets with condition/rule pairs
- [ ] Risk mitigation links to tactics/policies
- [ ] KPI values support rate/amount/percentage
- [ ] References to architectural_scope and aaarr_metrics required
- [ ] Schema validates successfully with JSON Schema Draft-07