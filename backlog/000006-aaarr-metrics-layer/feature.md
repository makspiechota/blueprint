# Feature: AAARR Metrics Layer

## Problem

BLUEPRINT has strategic direction (North Star, Lean Canvas) and viability targets (Lean 1-2-3), but lacks a structured customer lifecycle metrics framework. Without AAARR:

- No systematic measurement of customer journey from acquisition to revenue
- Metrics scattered across different documents without standard structure
- No visibility into which stage of customer lifecycle needs improvement
- Policy Charter and Backlog lack measurable outcomes to optimize
- Missing the "Customer Factory" view of business metrics

This feature implements the AAARR (Pirate Metrics) framework to provide structured, stage-based customer lifecycle metrics.

## Users

- **Product Managers**: Need to understand which stage of customer journey is underperforming
- **Growth Teams**: Need acquisition and activation metrics to optimize
- **Business Analysts**: Need revenue and retention metrics for forecasting
- **Policy Makers**: Need measurable KPIs to justify operational goals
- **Backlog Owners**: Need to link features to measurable business impact
- **AI Agents**: Need structured metrics to validate feature priorities

## User Stories

1. As a product manager, I want to see AAARR metrics with targets and current values so that I can identify the biggest gaps
2. As a growth marketer, I want acquisition metrics broken down by channel so that I can optimize spending
3. As a policy maker, I want to link my operational goals to AAARR metrics so that I can justify their business value
4. As a backlog owner, I want to tag features with expected AAARR impact so that I can prioritize effectively
5. As a business analyst, I want to visualize the customer factory so that I can identify bottlenecks
6. As an AI agent, I want to validate that Policy Charter KPIs link to AAARR metrics so that all goals are measurable

## Expected Behavior

**Input:** AAARR metrics YAML file defining:
- Five stages: Acquisition, Activation, Retention, Referral, Revenue
- Multiple sub-metrics per stage with structured values
- Targets imported from Lean Viability layer
- Current values measured from actual data

**Processing:**
1. Import targets from `lean-viability.yaml` targets section
2. Calculate gap between target and current for each metric
3. Validate all metric IDs follow semantic naming convention
4. Validate upward reference to lean-viability.yaml exists

**Output:**
- Structured AAARR metrics with targets, current, and gaps
- Unique semantic IDs for each metric (e.g., `aaarr.acquisition.signup-rate`)
- Customer Factory visualization showing all 5 stages with metrics
- JSON/TypeScript types for programmatic access

## Edge Cases

1. **Missing viability layer**: AAARR without lean-viability → Validator allows but warns about missing targets
2. **Target/current type mismatch**: Target is rate/month, current is percentage → Validator errors
3. **Currency mismatch**: Target in USD, current in EUR → Validator errors
4. **Negative gap**: Current exceeds target → Display as positive achievement
5. **Multiple metrics same ID**: Duplicate IDs across stages → Validator errors
6. **Invalid stage name**: Typo in stage name → Validator errors, suggests correct names
7. **Orphaned import reference**: References viability target that doesn't exist → Validator errors

## Success Criteria

1. ✅ Schema created for aaarr-metrics.yaml supporting:
   - Five AAARR stages
   - Multiple sub-metrics per stage
   - Structured numeric types (rate/period, amount/currency, percentage)
   - Target import from viability layer
2. ✅ Parser successfully reads AAARR files and resolves viability imports
3. ✅ Gap calculation engine correctly computes difference between target and current
4. ✅ Validator enforces:
   - Valid stage names (acquisition, activation, retention, referral, revenue)
   - Unique metric IDs following semantic convention
   - Type consistency within each metric
   - Valid upward references to lean-viability.yaml
5. ✅ TypeScript types generated from schema
6. ✅ Example aaarr-metrics.yaml file created with realistic metrics
7. ✅ Customer Factory visualization shows:
   - All 5 stages as connected pipeline
   - Metrics within each stage
   - Targets, current values, and gaps
   - Visual indication of which stages are underperforming
8. ✅ Documentation explains AAARR framework and metric design

## Business Value

**Customer Journey Visibility**: Provides complete view of customer lifecycle from first touch to revenue

**Bottleneck Identification**: Gap analysis shows which stage needs most improvement

**Data-Driven Prioritization**: Features can be prioritized by their expected AAARR impact

**Policy Justification**: Every operational goal must link to AAARR metric, ensuring measurability

**Viability Tracking**: Shows progress toward viability targets in real-time

## Technical Notes

- Must support multiple sub-metrics per stage (not just 5 top-level metrics)
- Imports from `lean-viability.targets.*` using `imported_from` field
- Each metric has unique semantic ID: `aaarr.{stage}.{metric-name}`
- Gap calculation handles different unit types (rates, amounts, percentages)
- Visualization should match Customer Factory diagram: https://cdn.prod.website-files.com/6558e5ab4f2f3a8d37787ccf/656bb0271a20cb6a6907189d_customer-factory.png

## Dependencies

- Requires: Lean Viability layer (000005) - for target imports
- Blocks: Policy Charter layer (000007) - which references AAARR metrics for KPI justification
- Blocks: Structured Backlog layer (000008) - which tags features with AAARR impact

## Priority

**High** - Core metrics layer that enables Policy Charter and Backlog prioritization
