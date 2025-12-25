# Task: Create Example Policy Charter

## User Story Reference
- As a strategist, I want realistic policy examples so that I can understand how to apply the framework
- As a compliance officer, I want to see graduated policy brackets in action so that I can model complex rules

## Description
Create `examples/policy-charter.yaml` with realistic operational policies for the software factory capability, demonstrating all Policy Charter features including goals, tactics, policies with graduated brackets, risks, and KPIs.

Follow TDD: write tests first, then implement.

## Files to Modify/Create
- `examples/policy-charter.yaml` - New example file

## Estimated Lines of Code
~200 lines

## Dependencies
- 001-create-schema.md (schema must exist to validate example)

## Implementation Notes

### Example Structure

Create realistic policies for the "Software Factory" capability from Architectural Scope:

```yaml
# Policy Charter for Software Factory
type: policy-charter
version: "1.0"
last_updated: "2025-12-25"
title: "Software Factory Policy Charter"
architectural_scope_ref: sample-architectural-scope.yaml
aaarr_metrics_ref: sample-aaarr-metrics.yaml

goals:
  - id: pc.goal.delivery-velocity
    title: "Accelerate Engineering Velocity"
    description: "Enable teams to deliver features 3-6x faster through systematic practices"
    addresses:
      - arch.goal.velocity
    aaarr_impact:
      - activation
      - retention
    tactics:
      - pc.tactic.tdd-mandate
      - pc.tactic.ai-augmentation
    policies:
      - pc.policy.code-review-mandatory
      - pc.policy.tdd-required
    kpis:
      - pc.kpi.deployment-frequency
      - pc.kpi.lead-time
    risks:
      - pc.risk.skill-gap

tactics:
  - id: pc.tactic.tdd-mandate
    title: "Mandate Test-Driven Development"
    description: "Require TDD for all new features to ensure quality at speed"
    drives_policies:
      - pc.policy.tdd-required
      - pc.policy.test-coverage

policies:
  - id: pc.policy.tdd-required
    title: "TDD Required for New Features"
    rule: "All new features must be developed using Test-Driven Development"
    driven_by_tactic: pc.tactic.tdd-mandate
    enforcement: mandatory
    brackets:
      - condition: "Feature complexity > 5 story points"
        rule: "Full TDD required with 90%+ test coverage"
      - condition: "Feature complexity ≤ 5 story points"
        rule: "TDD encouraged but simplified tests acceptable"

risks:
  - id: pc.risk.skill-gap
    description: "Team lacks TDD skills leading to slower delivery"
    probability: high
    impact: medium
    mitigation:
      - pc.tactic.training-program

kpis:
  - id: pc.kpi.deployment-frequency
    name: "Deployment Frequency"
    target:
      rate: 3
      period: week
    current:
      rate: 1.5
      period: week
    measurement_frequency: weekly
    justification: aaarr.activation.onboarding-completion
```

### Realistic Content

- **Goals**: Map to Arch Scope WHY goals (velocity, clarity, knowledge, AI collaboration, quality)
- **Tactics**: Concrete courses of action (TDD mandate, AI augmentation, systematic practices)
- **Policies**: Specific rules with graduated brackets for complex scenarios
- **Risks**: Real threats with mitigation strategies
- **KPIs**: Measurable outcomes linked to AAARR metrics

### Validation

Example must:
- Pass schema validation
- Reference existing sample-architectural-scope.yaml and sample-aaarr-metrics.yaml
- Demonstrate all entity types and relationships
- Show graduated policy brackets
- Include realistic operational policies

## Acceptance Criteria
- [ ] examples/policy-charter.yaml created
- [ ] File validates against policy-charter.schema.json
- [ ] References existing sample-architectural-scope.yaml and sample-aaarr-metrics.yaml
- [ ] Demonstrates all 5 entity types (goals, tactics, policies, risks, KPIs)
- [ ] Includes graduated policy brackets
- [ ] Shows bidirectional tactic-policy relationships
- [ ] Contains realistic software factory policies
- [ ] Risk mitigation and KPI justification examples included