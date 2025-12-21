# Feature: Lean 1-2-3 Viability Layer

## Problem

BLUEPRINT currently has strategic layers (North Star, Lean Canvas) and architectural layers (Architectural Scope), but lacks a quantitative viability test that validates whether the business model is achievable. Without this layer:

- Strategic goals are aspirational but not validated for feasibility
- AAARR metrics lack data-driven targets
- No work-backwards calculation from revenue goals to customer acquisition needs
- Gap between business model and measurable outcomes

This feature implements Ash Maurya's Lean 1-2-3 framework to provide a 3-year viability test with quantitative calculations.

## Users

- **Business Strategists**: Need to validate business model feasibility before significant investment
- **Product Managers**: Need quantitative targets for metrics to guide product decisions
- **Executives**: Need to understand if strategic goals are achievable within 3 years
- **AI Agents**: Need structured data to generate and validate lower-layer targets

## User Stories

1. As a business strategist, I want to define a 3-year revenue target so that I can work backwards to required customer acquisition rates
2. As a product manager, I want to see calculated AAARR targets derived from viability so that I know what metrics to optimize
3. As an executive, I want to understand if our business model is viable so that I can make informed investment decisions
4. As an AI agent, I want to parse viability calculations so that I can generate consistent AAARR metric targets
5. As a business analyst, I want to see transparent calculation formulas so that I can understand how targets were derived

## Expected Behavior

**Input:** Lean 1-2-3 viability YAML file defining:
- Time horizon (e.g., 3 years)
- Success criteria (e.g., $10M annual revenue)
- Annual revenue per customer assumption (e.g., $1,200/year)

**Calculations:** Work backwards to determine:
1. Required total customers = Success revenue / Annual revenue per customer
2. Customer acquisition rate = Required customers / Time horizon
3. Monthly acquisition target = Acquisition rate / 12
4. Other derived targets for activation, retention, revenue, referral

**Output:**
- Structured `targets` section that AAARR layer imports
- Transparent formulas showing how each target was calculated
- Validation that assumptions are realistic
- Visualization showing viability dashboard with calculations

## Edge Cases

1. **Unrealistic assumptions**: Annual revenue per customer exceeds market averages → Validator warns
2. **Circular dependency risk**: Viability must NOT reference AAARR (lower layer) → Schema enforces this
3. **Missing Lean Canvas**: Viability should reference lean-canvas.yaml → Validator requires it
4. **Currency mismatches**: All currency values must use same currency → Validator checks consistency
5. **Time horizon too short/long**: Typical range 2-5 years → Validator warns if outside range
6. **Required customer count exceeds TAM**: Calculated customers > total addressable market → Validator warns

## Success Criteria

1. ✅ Schema created for lean-viability.yaml with structured numeric types
2. ✅ Parser successfully reads and validates viability files
3. ✅ Calculation engine correctly derives all targets from inputs
4. ✅ Validator enforces:
   - No downward references to AAARR
   - Required fields present (success_criteria, time_horizon, calculations)
   - Numeric consistency (currency, periods)
5. ✅ TypeScript types generated from schema
6. ✅ Example lean-viability.yaml file created
7. ✅ Visualization generates viability dashboard showing:
   - Success criteria
   - Work-backwards calculations
   - Generated targets
   - Formulas used
8. ✅ Documentation explains Lean 1-2-3 framework and usage

## Business Value

**Strategic Validation**: Provides quantitative feasibility check before committing resources to business model

**Data-Driven Targets**: Eliminates arbitrary metric goals by deriving them from revenue objectives

**Transparency**: Clear calculation formulas make assumptions visible and debatable

**Foundation for Lower Layers**: Generates targets that cascade down to AAARR → Policy Charter → Backlog

**Decision Support**: Enables "what-if" scenario modeling (e.g., "What if ARPU is $80 instead of $100?")

## Technical Notes

- Must support enums: `currency: [USD, EUR, PLN, GBP]`, `period: [day, week, month, quarter, year]`
- All numeric values use structured objects (not strings)
- References upward only (lean-canvas.yaml)
- Generates `targets` section consumed by AAARR layer
- Calculation formulas stored as human-readable strings

## Dependencies

- Requires: Lean Canvas layer (000004) - for revenue model reference
- Blocks: AAARR Metrics layer (000006) - which imports targets from this layer

## Priority

**High** - Foundation layer that unblocks AAARR and downstream layers
