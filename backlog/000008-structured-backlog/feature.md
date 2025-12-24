# Feature: Structured Backlog Layer

## Problem

BLUEPRINT has all business layers (strategy, viability, metrics, architecture, policies) but lacks structured implementation planning. Current backlog is:

- Unstructured markdown files without standard schema
- No traceability to business goals, metrics, or policies
- No automated priority calculation based on business impact
- No dependency tracking between features
- No validation that features align with business objectives
- Missing the critical link from strategy to execution

This feature transforms the backlog into a structured, validated, prioritized implementation layer with complete traceability to all business layers.

## Users

- **Product Managers**: Need to prioritize features based on business impact, not intuition
- **Engineering Teams**: Need to understand why features matter and what business goals they serve
- **Business Stakeholders**: Need to see how backlog aligns with strategic objectives
- **Project Managers**: Need dependency tracking to plan sprints effectively
- **AI Agents**: Need structured backlog data to autonomously generate and validate features
- **Executives**: Need to validate that development aligns with business strategy

## User Stories

1. As a product manager, I want features auto-prioritized by AAARR impact so that I focus on high-value work
2. As an engineer, I want to see which policy my feature addresses so that I understand business context
3. As a business stakeholder, I want to click an AAARR metric and see all features improving it so that I can track investment
4. As a project manager, I want to see feature dependencies so that I can plan sprint order
5. As an AI agent, I want to validate that every feature links to business layers so that nothing is orphaned
6. As an executive, I want to see priority breakdown so that I understand how priority was calculated
7. As a risk manager, I want to see which features mitigate high-impact risks so that risk reduction is tracked

## Expected Behavior

**Input:** Backlog feature YAML files defining:
- Feature metadata (id, title, description, status)
- Traceability links (policy_charter, arch_scope, aaarr_impact)
- Priority information (score, breakdown, algorithm version)
- Dependencies (blocks, blocked_by)
- Traditional feature content (user stories, acceptance criteria)

**Processing:**
1. Validate all upward references exist (Policy Charter, Arch Scope, AAARR)
2. Calculate priority score using algorithm v1.0:
   - AAARR impact (0-50 points)
   - Risk mitigation (0-30 points)
   - Dependency weight (0-20 points)
   - Policy alignment (0-10 points)
3. Detect circular dependencies
4. Validate logical consistency (Level 3 validation)

**Output:**
- Structured backlog with validated traceability
- Auto-calculated priority scores with transparent breakdown
- Dependency graph showing feature relationships
- Backlog visualizer with filtering by:
  - Priority range
  - AAARR stage
  - Policy Charter goal
  - Architectural capability
  - Risk mitigation
- Validation report showing all traceability paths

## Edge Cases

1. **Orphaned feature**: No links to any business layer → Validator errors
2. **Invalid priority score**: Manually entered score > 100 → Validator errors
3. **Circular dependency**: Feature A blocks B, B blocks A → Validator errors
4. **Stale priority**: Priority calculated > 30 days ago → Validator warns (needs_recalculation: true)
5. **Misaligned impact**: Feature claims activation impact but links to retention-focused policy → Validator warns (Level 3)
6. **Invalid AAARR metric**: References non-existent metric ID → Validator errors
7. **Policy without tactic**: Links to policy not driven by any tactic → Validator warns
8. **High-priority orphan**: Priority > 80 but addresses low-impact goal → Validator warns (potential miscalculation)

## Success Criteria

1. ✅ Schema created for backlog feature YAML supporting:
   - Feature metadata (id, title, status, description)
   - Traceability links (policy_charter, arch_scope, aaarr_impact)
   - Priority (score, breakdown, last_calculated, needs_recalculation)
   - Dependencies (blocks, blocked_by)
   - Traditional fields (user_stories, acceptance_criteria, estimated_effort)
2. ✅ Priority calculation algorithm v1.0 implemented:
   - AAARR impact calculation (metric weight × expected change)
   - Risk mitigation scoring (probability × impact)
   - Dependency weight (number of blocked features)
   - Policy alignment bonus (mandatory policies)
3. ✅ Validator enforces:
   - All references exist and point to correct types
   - Priority scores are current (< 30 days old)
   - No circular dependencies
   - Logical consistency (feature impact aligns with linked goal impact)
4. ✅ Dependency graph generator detects cycles and visualizes relationships
5. ✅ TypeScript types generated from schema
6. ✅ Example backlog feature files created with realistic data
7. ✅ Backlog visualizer shows:
   - All features sorted by priority
   - Filtering by stage, goal, capability, risk
   - Dependency graph view
   - Traceability drill-down
8. ✅ Documentation explains:
   - Backlog schema and fields
   - Priority calculation algorithm
   - How to link features to business layers
   - Best practices for feature design

## Business Value

**Data-Driven Prioritization**: No more "gut feeling" priorities - calculated from business impact

**Complete Traceability**: Every feature traces to strategic goals through validated links

**Risk Visibility**: Features addressing high-impact risks automatically prioritized

**Dependency Management**: Automated detection of circular dependencies prevents planning errors

**Business Alignment**: Validation ensures all development work serves business objectives

**Executive Confidence**: Transparent priority breakdown shows why features matter

**AI-Friendly**: Structured format enables AI agents to autonomously generate and validate features

## Technical Notes

- Semantic IDs: `feat.{semantic-name}` (not numeric)
- Priority algorithm version stored to enable future algorithm changes
- `needs_recalculation` flag set by validator when linked entities change
- References upward to: policy-charter.yaml, architectural-scope.yaml, aaarr-metrics.yaml
- Does NOT reference lean-viability.yaml (gets targets through AAARR)
- Dependency detection uses graph traversal to find cycles
- Priority breakdown stored for transparency and debugging

## Priority Calculation Algorithm v1.0

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
  const hasMandatoryPolicy = checkMandatoryPolicyAlignment(feature);
  if (hasMandatoryPolicy) score += 10;

  return Math.min(Math.round(score), 100);
}
```

## Dependencies

- Requires: Policy Charter layer (000007) - for goal/tactic/policy/risk links
- Requires: AAARR Metrics layer (000006) - for impact measurement
- Requires: Architectural Scope layer (000002) - for capability links
- Blocks: None (final implementation layer)

## Priority

**High** - Completes the business layer stack, enabling full traceability from strategy to execution
