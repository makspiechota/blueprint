# BLUEPRINT Business Layer Architecture

**Version:** 1.0
**Last Updated:** 2025-12-21
**Status:** Design Document

## Overview

This document defines the complete architecture for BLUEPRINT's business layer - a multi-layer DSL system for business strategy, metrics, policies, and implementation planning. The architecture ensures traceability from high-level strategic vision down to individual backlog items.

## Design Principles

### 1. Unidirectional Dependencies (Critical)

**Rule:** Lower layers can ONLY reference higher layers. Higher layers NEVER reference lower layers.

**Rationale:**
- Prevents circular dependencies
- Higher layers can exist independently
- Lower layers depend on higher layers for context
- Enables validation: all references point "upward" in the stack

**Example:**
```
✓ VALID:   Backlog → Policy Charter (lower references higher)
✓ VALID:   AAARR → Lean Viability (lower imports from higher)
✗ INVALID: Lean Viability → AAARR (higher cannot reference lower)
```

### 2. Strict Validation (Three Levels)

All references must pass three validation levels:

**Level 1: Reference Existence**
- Referenced ID must exist in target layer
- Example: `pc.goal.reduce-friction` must exist in policy-charter.yaml

**Level 2: Type Consistency**
- Reference must point to correct entity type
- Example: `aaarr_impact.metric` must point to AAARR metric, not goal

**Level 3: Logical Consistency**
- Reference must make semantic sense
- Example: Policy Charter goal addressing "reduce costs" should impact cost-related AAARR metrics

### 3. Semantic IDs

All entities use human-readable semantic IDs, not numeric counters:

**Format:** `{layer}.{category}.{kebab-case-semantic-name}`

**Examples:**
- `aaarr.acquisition.signup-rate`
- `pc.goal.reduce-onboarding-friction`
- `arch.why.increase-customer-satisfaction`
- `feat.progressive-onboarding-wizard`

### 4. Structured Data Types

No free-form strings for numeric values. All amounts, rates, and measurements use structured objects:

**Currency amounts:**
```yaml
amount: 10000
currency: USD  # enum: [USD, EUR, PLN, GBP]
```

**Rates:**
```yaml
rate: 231
period: month  # enum: [day, week, month, quarter, year]
```

**Percentages:**
```yaml
percentage: 15.5
```

## Layer Architecture

### Layer Stack (High to Low)

```
┌─────────────────────────────────────────────────────────┐
│ STRATEGIC LAYER                                         │
│ Defines the "why" - vision, problem, business model     │
├─────────────────────────────────────────────────────────┤
│ • North Star (north-star.yaml)                          │
│   - Vision, problem, solution, strategic goals          │
│ • Lean Canvas (lean-canvas.yaml)                        │
│   - 9-box business model                                │
└─────────────────────────────────────────────────────────┘
                         ↓ referenced by
┌─────────────────────────────────────────────────────────┐
│ VIABILITY LAYER                                         │
│ Validates business viability through calculations       │
├─────────────────────────────────────────────────────────┤
│ • Lean 1-2-3 Viability (lean-viability.yaml)            │
│   - 3-year success criteria                             │
│   - Work-backwards calculations                         │
│   - Generates metric targets for AAARR                  │
│   - References: lean-canvas.yaml                        │
└─────────────────────────────────────────────────────────┘
                         ↓ referenced by
┌─────────────────────────────────────────────────────────┐
│ METRICS LAYER                                           │
│ Customer lifecycle metrics and targets                  │
├─────────────────────────────────────────────────────────┤
│ • AAARR Metrics (aaarr-metrics.yaml)                    │
│   - Acquisition, Activation, Retention, Referral,       │
│     Revenue metrics                                     │
│   - Imports targets from lean-viability.yaml            │
│   - Multiple sub-metrics per stage                      │
│   - References: lean-viability.yaml                     │
└─────────────────────────────────────────────────────────┘
                         ↓ referenced by
┌─────────────────────────────────────────────────────────┐
│ ARCHITECTURAL LAYER                                     │
│ Capability boundaries and business scope                │
├─────────────────────────────────────────────────────────┤
│ • Architectural Scope (architectural-scope.yaml)        │
│   - 6 dimensions: What, How, Where, Who, When, Why     │
│   - WHY: Business goals for capabilities                │
│   - References: north-star.yaml                         │
└─────────────────────────────────────────────────────────┘
                         ↓ referenced by
┌─────────────────────────────────────────────────────────┐
│ POLICY LAYER                                            │
│ Operational goals, tactics, policies, and risks         │
├─────────────────────────────────────────────────────────┤
│ • Policy Charter (policy-charter.yaml)                  │
│   - Goals (address Arch Scope WHY goals)                │
│   - Tactics (courses of action)                         │
│   - Policies (business rules, may have brackets)        │
│   - Risks (threats and mitigations)                     │
│   - KPIs (must link to AAARR for justification)         │
│   - References: architectural-scope.yaml, aaarr.yaml    │
└─────────────────────────────────────────────────────────┘
                         ↓ referenced by
┌─────────────────────────────────────────────────────────┐
│ IMPLEMENTATION LAYER                                    │
│ Features, tasks, and execution plan                     │
├─────────────────────────────────────────────────────────┤
│ • Structured Backlog (backlog/*.yaml)                   │
│   - Features and tasks                                  │
│   - Links to Policy Charter, Arch Scope, AAARR          │
│   - Priority scoring (auto-calculated)                  │
│   - Dependency tracking                                 │
│   - References: policy-charter.yaml, arch-scope.yaml,   │
│     aaarr.yaml                                          │
└─────────────────────────────────────────────────────────┘
```

### Reference Direction Rules

| From Layer | Can Reference | Cannot Reference |
|------------|---------------|------------------|
| Strategic | (none - top of stack) | All lower layers |
| Viability | Strategic | Metrics, Arch, Policy, Backlog |
| Metrics | Strategic, Viability | Arch, Policy, Backlog |
| Architectural | Strategic | Viability, Metrics, Policy, Backlog |
| Policy | Strategic, Metrics, Architectural | Viability, Backlog |
| Backlog | Strategic, Metrics, Arch, Policy | Viability |

**Note:** Backlog does NOT reference Viability directly. It gets targets through AAARR.

## Layer Specifications

### 1. Lean 1-2-3 Viability Layer

**Purpose:** Validate business viability using Ash Maurya's Lean 1-2-3 framework. Generates quantitative targets for AAARR metrics.

**File:** `lean-viability.yaml`

**Schema:**
```yaml
type: lean-viability
version: "1.0"
last_updated: "YYYY-MM-DD"
title: string

# References upward only
lean_canvas_ref: string  # Path to lean-canvas.yaml

# Time horizon for viability test
time_horizon:
  duration: number
  unit: years | months

# 3-year success criteria
success_criteria:
  annual_revenue:
    amount: number
    currency: USD | EUR | PLN | GBP
  target_year: number

# Work-backwards calculations
calculations:
  annual_revenue_per_customer:
    amount: number
    currency: USD | EUR | PLN | GBP
    basis: string  # Explanation of assumption

  required_customers:
    count: number
    formula: string  # Human-readable formula

  customer_acquisition_rate:
    rate: number
    period: year | month
    formula: string

  monthly_acquisition_target:
    rate: number
    period: month
    formula: string

# Output targets (consumed by AAARR layer)
targets:
  acquisition:
    monthly_signups:
      rate: number
      period: month

  activation:
    # Optional activation targets

  retention:
    # Optional retention targets

  referral:
    # Optional referral targets

  revenue:
    arpu:
      amount: number
      currency: USD | EUR | PLN | GBP
      period: month
```

**Key Points:**
- Does NOT reference AAARR (lower layer)
- Generates `targets` object for AAARR to import
- All numeric values use structured types
- Formulas stored as human-readable strings for transparency

### 2. AAARR Metrics Layer

**Purpose:** Define customer lifecycle metrics across 5 stages. Import targets from Lean Viability.

**File:** `aaarr-metrics.yaml`

**Schema:**
```yaml
type: aaarr-metrics
version: "1.0"
last_updated: "YYYY-MM-DD"
title: string

# References upward
lean_viability_ref: string  # Path to lean-viability.yaml
north_star_ref: string       # Optional

# Each AAARR stage
acquisition:
  stage_goal: string
  metrics:
    - id: string  # Format: aaarr.acquisition.{metric-name}
      name: string
      description?: string

      target:
        rate?: number
        period?: day | week | month | quarter | year
        amount?: number
        currency?: USD | EUR | PLN | GBP
        percentage?: number
        imported_from?: string  # Reference to viability target

      current:
        # Same structure as target

      gap:
        # Calculated difference
        rate?: number
        amount?: number
        percentage?: number

activation:
  # Same structure

retention:
  # Same structure

referral:
  # Same structure

revenue:
  # Same structure
```

**Key Points:**
- Imports targets from `lean-viability.targets.*`
- Supports multiple sub-metrics per stage
- Calculates gap automatically
- Each metric has unique semantic ID

### 3. Policy Charter Layer

**Purpose:** Define operational goals, tactics, policies, and risks based on Ronald Ross's Policy Charter framework.

**File:** `policy-charter.yaml`

**Schema:**
```yaml
type: policy-charter
version: "1.0"
last_updated: "YYYY-MM-DD"
title: string

# References upward
arch_scope_ref: string  # Path to architectural-scope.yaml
aaarr_ref: string       # Path to aaarr-metrics.yaml

# Policy Charter goals
goals:
  - id: string  # Format: pc.goal.{semantic-name}
    title: string
    description: string

    # Upward link: What Arch Scope goal does this address?
    addresses: string  # Reference to arch.why.{goal-id}

    # Measurement justification: What AAARR metrics improve?
    aaarr_impact:
      - stage: acquisition | activation | retention | referral | revenue
        metric: string  # Reference to aaarr.{stage}.{metric-id}
        expected_change: string  # e.g., "+15%", "-5 minutes"

    # Tactics: Courses of action to achieve goal
    tactics:
      - id: string  # Format: pc.tactic.{semantic-name}
        title: string
        description: string

        # Tactics drive policies
        drives_policies:
          - string  # Reference to pc.policy.{policy-id}

    # Policies: Business rules that guide tactics
    policies:
      - id: string  # Format: pc.policy.{semantic-name}
        title: string
        rule: string
        driven_by_tactic: string  # Reference to pc.tactic.{tactic-id}
        enforcement: mandatory | guideline
        rationale?: string

        # Optional graduated policy brackets
        brackets?:
          - condition: string
            constraint?: string
            max_steps?: number
            approval?: string
            exception?: boolean

    # KPIs: Measurement of goal progress
    kpis:
      - id: string  # Format: pc.kpi.{semantic-name}
        name: string
        target: string | number
        current: string | number
        measurement_frequency: daily | weekly | monthly | quarterly

        # KPI must justify through AAARR
        justification:
          aaarr_metric: string  # Reference to aaarr metric
          rationale: string

    # Risks: Threats to achieving goal
    risks:
      - id: string  # Format: pc.risk.{semantic-name}
        description: string
        probability: low | medium | high
        impact: low | medium | high

        # How to mitigate
        mitigation:
          tactic?: string  # Reference to pc.tactic.{tactic-id}
          policy?: string  # Reference to pc.policy.{policy-id}
```

**Key Points:**
- Goals address Architectural Scope WHY goals
- Tactics explicitly drive policies (Ross's framework)
- All KPIs must link to AAARR metrics (justification)
- Graduated policy brackets supported
- Risks link to mitigation tactics/policies

### 4. Structured Backlog Layer

**Purpose:** Implementation features and tasks with full traceability to business layers.

**File:** `backlog/{feature-id}.yaml`

**Schema:**
```yaml
type: feature
version: "1.0"
id: string  # Format: feat.{semantic-name}
title: string
status: proposed | in-progress | completed | rejected

# Traceability links (all upward references)
policy_charter:
  goal: string          # Reference to pc.goal.{goal-id}
  tactics: string[]     # References to pc.tactic.{tactic-id}
  risks_mitigated?: string[]  # References to pc.risk.{risk-id}

arch_scope:
  capability: string    # Reference to arch.{dimension}.{capability-id}

aaarr_impact:
  - stage: acquisition | activation | retention | referral | revenue
    metric: string      # Reference to aaarr.{stage}.{metric-id}
    expected: string    # Expected improvement

# Priority calculation
priority:
  score: number  # 0-100, auto-calculated
  last_calculated: string  # ISO timestamp

  breakdown:
    aaarr_impact: number      # 0-50 points
    risk_mitigation: number   # 0-30 points
    dependency_weight: number # 0-20 points
    policy_alignment: number  # 0-10 points

  algorithm_version: string
  needs_recalculation: boolean

# Dependencies
dependencies:
  blocks: string[]      # Feature IDs this blocks
  blocked_by: string[]  # Feature IDs blocking this

# Traditional feature content
description: string
user_stories: string[]
acceptance_criteria: string[]
estimated_effort?: string
```

**Key Points:**
- Links to Policy Charter, Arch Scope, and AAARR
- Priority score stored in YAML, regenerated on validation
- Does NOT reference Viability (gets targets through AAARR)
- Tracks which risks it mitigates

## Traceability Paths

### End-to-End Traceability Example

**User clicks on AAARR metric: `aaarr.activation.onboarding-complete`**

```
aaarr.activation.onboarding-complete (target: 60%)
  ↑ imported from
lean-viability.targets.activation.onboarding_rate
  ↑ derived from
lean-viability.calculations (work-backwards from revenue goal)
  ↑ justified by
Policy Charter Goal: pc.goal.reduce-onboarding-friction
  ↑ addresses
Arch Scope Goal: arch.why.increase-customer-satisfaction
  ↑ implemented by
Backlog Features:
  - feat.progressive-onboarding-wizard (priority: 85)
  - feat.contextual-help-system (priority: 72)
```

### Validation Chain

When validating `feat.progressive-onboarding-wizard`:

1. **Existence validation:**
   - `policy_charter.goal: "pc.goal.reduce-onboarding-friction"` → exists in policy-charter.yaml ✓
   - `arch_scope.capability: "arch.what.onboarding-process"` → exists in architectural-scope.yaml ✓
   - `aaarr_impact[0].metric: "aaarr.activation.onboarding-complete"` → exists in aaarr-metrics.yaml ✓

2. **Type validation:**
   - `policy_charter.goal` points to a goal (not tactic/policy/risk) ✓
   - `aaarr_impact[0].metric` points to activation metric (matches stage) ✓

3. **Logical validation:**
   - Policy Charter goal `pc.goal.reduce-onboarding-friction` has `aaarr_impact` on activation metrics ✓
   - Feature's AAARR impact aligns with Policy Charter goal's AAARR impact ✓
   - Policy Charter goal addresses Arch Scope capability referenced by feature ✓

## Priority Calculation Algorithm

**Version 1.0**

```typescript
function calculatePriority(feature: Feature): number {
  let score = 0;

  // 1. AAARR Impact (0-50 points)
  const aaarr_impact = feature.aaarr_impact.reduce((sum, impact) => {
    const metricWeight = getMetricWeight(impact.stage, impact.metric);
    const expectedChange = parseExpectedChange(impact.expected);
    return sum + (metricWeight * expectedChange);
  }, 0);
  score += Math.min(aaarr_impact, 50);

  // 2. Risk Mitigation (0-30 points)
  const risk_score = feature.policy_charter.risks_mitigated?.reduce((sum, riskId) => {
    const risk = findRisk(riskId);
    const riskScore = (
      risk.probability === 'high' ? 3 : risk.probability === 'medium' ? 2 : 1
    ) * (
      risk.impact === 'high' ? 3 : risk.impact === 'medium' ? 2 : 1
    );
    return sum + riskScore;
  }, 0) || 0;
  score += Math.min(risk_score * 3, 30);

  // 3. Dependency Weight (0-20 points)
  const blocksCount = feature.dependencies.blocks?.length || 0;
  score += Math.min(blocksCount * 5, 20);

  // 4. Policy Alignment (0-10 points)
  const hasMandatoryPolicy = feature.policy_charter.tactics.some(tacticId => {
    const tactic = findTactic(tacticId);
    return tactic.drives_policies.some(policyId => {
      const policy = findPolicy(policyId);
      return policy.enforcement === 'mandatory';
    });
  });
  if (hasMandatoryPolicy) score += 10;

  return Math.min(Math.round(score), 100);
}
```

## Visualization Strategy

### Multi-Layer Tabs

**File:** `business-visualization.html` (generated from `business.yaml`)

Tabs:
1. North Star
2. Lean Canvas
3. Lean 1-2-3 Viability
4. AAARR Customer Factory
5. Architectural Scope
6. Policy Charter
7. Backlog

### Traceability View (Future)

Interactive graph showing:
- Nodes: All entities across layers
- Edges: References between entities
- Click any node to see:
  - What it references (upward)
  - What references it (downward)
  - Validation status

## Implementation Roadmap

### Phase 1: Viability Foundation (Feature 000005)
- Lean 1-2-3 schema with structured types
- Calculation engine
- Target generation
- Validation

### Phase 2: AAARR Metrics (Feature 000006)
- AAARR schema with multi-metric support
- Target import from viability
- Gap calculation
- Customer factory visualization

### Phase 3: Policy Charter (Feature 000007)
- Policy Charter schema (Ross's framework)
- Graduated policy brackets
- Three-level validation
- Visualization

### Phase 4: Structured Backlog (Feature 000008)
- Backlog schema with traceability
- Priority calculation
- Dependency tracking
- Backlog visualizer

### Phase 5: Integration (Feature 000009)
- Multi-layer orchestration
- Tabbed visualization
- Traceability graph
- Complete validation suite

## Future Considerations

### 1. Circular Reference Detection
Implement graph cycle detection to prevent accidental circular deps if schema evolves.

### 2. Migration Path
When adding new layers, provide migration tools to update existing references.

### 3. Validation Performance
For large backlogs, cache validation results and only revalidate changed entities.

### 4. AI Agent Integration
This DSL is designed for AI agents to consume and generate. Human users primarily interact through visualizations.

## References

- Ronald Ross Policy Charter: https://www.brcommunity.com/articles.php?id=b666
- Ash Maurya Lean 1-2-3: https://www.leanfoundry.com/lean-1-2-3/jul-17-2025
- AAARR (Pirate Metrics): Dave McClure's framework
- Zachman Framework: Inspiration for 6-dimension scope

---

**Document Status:** Complete design specification, ready for implementation.
