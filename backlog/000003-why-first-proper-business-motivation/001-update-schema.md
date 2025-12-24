# Task: Update Architectural Scope Schema for WHY Structure

## User Story Reference
User Story #2: As a product manager, I want to define a single business mission (action + service + beneficiary) so that the core capability responsibility is clear
User Story #6: As a team member, I want validation to ensure exactly one business mission exists so that the capability has a single clear responsibility
User Story #7: As a business analyst, I want to define multiple business goals that relate to the mission so that strategic objectives are explicit

## Description
Update the architectural-scope JSON schema to change WHY from a simple array to a structured object with mission and goals. The mission has three required components (action, service, beneficiary), and goals are an optional array where each goal title must start with "To".

## Files to Modify/Create
- `schemas/architectural-scope.schema.json` - Update WHY property structure

## Estimated Lines of Code
~35 lines (schema definition changes)

## Dependencies
None (foundation task)

## Implementation Notes
Replace the current WHY array definition with:
```json
"why": {
  "type": "object",
  "description": "Business motivation: mission and goals for this capability",
  "required": ["mission"],
  "properties": {
    "mission": {
      "type": "object",
      "description": "Business mission: what this capability does in day-to-day operations",
      "required": ["action", "service", "beneficiary"],
      "properties": {
        "action": {
          "type": "string",
          "minLength": 1,
          "description": "Action verb (e.g., 'to provide', 'to enable')",
          "pattern": "^to "
        },
        "service": {
          "type": "string",
          "minLength": 1,
          "description": "The service or offering provided"
        },
        "beneficiary": {
          "type": "string",
          "minLength": 1,
          "description": "Who benefits from this service"
        }
      }
    },
    "goals": {
      "type": "array",
      "description": "Capability-specific business goals (ongoing objectives, not project goals)",
      "items": {
        "type": "object",
        "required": ["title", "description"],
        "properties": {
          "title": {
            "type": "string",
            "minLength": 1,
            "pattern": "^[Tt]o ",
            "description": "Goal title starting with 'To' (e.g., 'To increase customer satisfaction')"
          },
          "description": {
            "type": "string",
            "minLength": 1,
            "description": "Ongoing effect to achieve continuously for this capability"
          }
        }
      }
    }
  }
}
```

**Important**: WHY is no longer optional - it becomes required in the schema's required array.

## Acceptance Criteria
- [x] WHY property is an object (not array)
- [x] Mission object with three required string fields: action, service, beneficiary
- [x] Action must start with "to " (pattern validation)
- [x] Goals is optional array of objects
- [x] Each goal has required title and description
- [x] Goal title must start with "To" or "to" (pattern validation)
- [x] WHY added to schema's required array
- [x] Schema validates correctly with ajv

## Status
[COMPLETED] - 2025-12-24
Actual lines: 0 (schema already implemented)
Commit: [will be added by committer agent]
