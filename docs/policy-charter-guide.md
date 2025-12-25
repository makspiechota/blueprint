# Policy Charter Guide

## Overview

The Policy Charter layer connects strategic goals to operational execution using Ronald Ross's Policy Charter framework. It provides a systematic approach to translating business strategy into enforceable policies that drive organizational behavior.

## Ronald Ross Policy Charter Framework

The Policy Charter framework establishes clear relationships between strategic goals, operational tactics, and enforceable policies:

```
Goals (Why) → Tactics (How) → Policies (What)
```

### Goals
Strategic objectives that address Architectural Scope goals and impact AAARR metrics. Goals define what the organization wants to achieve.

### Tactics
Concrete courses of action that drive policy creation. Tactics answer "how" questions and provide the operational approach to achieving goals.

### Policies
Enforceable business rules with graduated brackets for complex scenarios. Policies define acceptable behavior and provide clear guidance for decision-making.

## Key Concepts

### Semantic IDs
All entities use semantic identifiers with prefixes:
- `pc.goal.*` - Goals
- `pc.tactic.*` - Tactics
- `pc.policy.*` - Policies
- `pc.risk.*` - Risks
- `pc.kpi.*` - KPIs

### Bidirectional Relationships
- Tactics drive policies (tactic → policy)
- Policies are driven by tactics (policy → tactic)
- Goals link to tactics and policies they enable

### Graduated Policy Brackets
Policies support conditional rules based on context:
```yaml
policy:
  id: pc.policy.code-review
  title: "Code Review Requirements"
  rule: "All code changes require review"
  enforcement: mandatory
  brackets:
    - condition: "High-risk changes"
      rule: "Senior developer review required"
    - condition: "Standard changes"
      rule: "Peer review required"
```

### Risk Mitigation
Risks are linked to tactics/policies that mitigate them:
```yaml
risk:
  id: pc.risk.skill-gap
  description: "Team lacks required skills"
  mitigation:
    - pc.tactic.training-program
    - pc.policy.skill-development
```

### KPI Justification
KPIs must justify their measurement approach by referencing AAARR metrics:
```yaml
kpi:
  id: pc.kpi.deployment-frequency
  name: "Deployment Frequency"
  justification: aaarr.activation.feature-rollout-rate
```

## Three-Level Validation

### Level 1: Schema Validation
- Validates JSON Schema compliance
- Ensures required fields are present
- Validates data types and formats

### Level 2: Reference Existence
- Verifies architectural_scope_ref file exists and is valid
- Verifies aaarr_metrics_ref file exists and is valid
- Validates cross-layer references

### Level 3: Logical Consistency
- Ensures goals address at least one architectural scope goal
- Ensures tactics drive at least one policy
- Validates bidirectional tactic-policy relationships
- Checks risk mitigation references exist

## File Structure

```yaml
type: policy-charter
version: "1.0"
last_updated: "2025-12-25"
title: "Software Factory Policy Charter"

# Required references to other layers
architectural_scope_ref: sample-architectural-scope.yaml
aaarr_metrics_ref: aaarr-metrics.yaml

# Core entities
goals: [...]      # Strategic objectives
tactics: [...]    # Operational approaches
policies: [...]   # Enforceable rules
risks: [...]      # Potential obstacles
kpis: [...]       # Measurable outcomes
```

## CLI Usage

### Validation
```bash
blueprint validate policy-charter.yaml
```

### Visualization
```bash
blueprint visualize policy-charter.yaml
blueprint visualize policy-charter.yaml -o custom-name.html
```

## Visualization Features

The Policy Charter visualization provides a comprehensive tabbed interface:

### Goals Overview
- Goals with architectural scope addresses
- AAARR impact indicators
- Linked tactics, policies, KPIs, and risks

### Tactics Tree
- Hierarchical view of tactics
- Policy relationships
- Clear means-ends connections

### Policies Matrix
- Policy rules and enforcement levels
- Expandable graduated brackets
- Tactic relationships

### Risk Management
- Risk assessment (probability × impact)
- Mitigation strategy links
- Color-coded risk levels

### KPI Dashboard
- Current vs target values
- Measurement frequencies
- AAARR justifications

## Best Practices

### Goal Definition
- Focus on operational outcomes, not project deliverables
- Link to specific architectural scope goals
- Identify AAARR impact areas

### Tactic Selection
- Choose actionable approaches
- Ensure tactics can drive multiple policies
- Maintain clear goal-tactic alignment

### Policy Design
- Use graduated brackets for complex scenarios
- Clearly define enforcement levels
- Ensure policies are measurable

### Risk Management
- Identify realistic threats
- Link mitigation to existing tactics/policies
- Regularly review risk assessments

### KPI Selection
- Choose metrics that directly measure goal achievement
- Justify measurement approach with AAARR metrics
- Set realistic targets and review frequencies

## Integration with Other Layers

### Architectural Scope
Policy Charter goals address WHY questions from Architectural Scope:
- Mission statements provide goal context
- Capability goals guide operational objectives

### AAARR Metrics
KPIs justify measurement through AAARR framework:
- Acquisition metrics for customer growth
- Activation metrics for product adoption
- Retention metrics for customer loyalty
- Referral metrics for viral growth
- Revenue metrics for financial outcomes

## Examples

See `examples/policy-charter.yaml` for a comprehensive example demonstrating all features including:
- Software factory operational policies
- Graduated brackets for code review requirements
- Risk mitigation for skill gaps
- KPI justification for deployment metrics

## Validation Rules

### Required Fields
- `type`, `version`, `last_updated`, `title`
- `architectural_scope_ref`, `aaarr_metrics_ref`
- `goals` array (minimum 1)

### ID Patterns
- Goals: `^pc\.goal\.[a-z][a-z0-9-]*$`
- Tactics: `^pc\.tactic\.[a-z][a-z0-9-]*$`
- Policies: `^pc\.policy\.[a-z][a-z0-9-]*$`
- Risks: `^pc\.risk\.[a-z][a-z0-9-]*$`
- KPIs: `^pc\.kpi\.[a-z][a-z0-9-]*$`

### Relationship Constraints
- Goals must address at least one architectural scope goal
- Tactics must drive at least one policy
- Policies must be driven by exactly one tactic
- Risk mitigation must reference existing tactics/policies
- KPI justification must reference valid AAARR metrics

## Troubleshooting

### Common Validation Errors
- **Schema validation failed**: Check JSON Schema compliance
- **Architectural scope file not found**: Verify file exists and path is correct
- **AAARR metrics file not found**: Verify file exists and path is correct
- **Invalid goal ID pattern**: Use lowercase letters, numbers, and hyphens only
- **Missing tactic relationship**: Ensure policies reference valid tactics

### Visualization Issues
- **Missing relationships**: Check that referenced entities exist
- **Empty sections**: Verify data arrays are populated
- **Styling issues**: Ensure modern browser support

## Migration Guide

### From Legacy Policy Documents
1. Identify strategic goals → Convert to Policy Charter goals
2. Extract operational approaches → Convert to tactics
3. Document enforceable rules → Convert to policies with brackets
4. Assess risks and mitigations → Add risk entities
5. Define success metrics → Add KPIs with justifications

### Layer Integration
1. Create Architectural Scope first (provides goal context)
2. Create AAARR Metrics second (provides KPI justification)
3. Create Policy Charter last (connects strategy to execution)