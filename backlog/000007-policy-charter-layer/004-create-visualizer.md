# Task: Create Policy Charter Visualizer

## User Story Reference
- As a strategist, I want to see tactics explicitly drive policies so that the means-ends relationship is clear
- As a product manager, I want to see which policies my feature must comply with so that I don't violate business rules
- As an AI agent, I want to validate that all Policy Charter goals address Architectural Scope goals so that traceability is complete

## Description
Create `policy-charter-visualizer.ts` that generates HTML visualization showing the complete policy charter hierarchy: goals → tactics → policies → risks/KPIs with all relationships and traceability links.

Follow TDD: write tests first, then implement.

## Files to Modify/Create
- `src/visualizer/policy-charter-visualizer.ts` - New visualizer module
- `src/visualizer/index.ts` - Export new visualizer function

## Estimated Lines of Code
~300 lines

## Dependencies
- 003-parser-validator.md (parsePolicyCharter must exist)

## Implementation Notes

### Visualization Structure

Create HTML with tabbed interface showing:

1. **Goals Overview** - Goals with addressed Arch Scope goals and AAARR impact
2. **Tactics Tree** - Hierarchical view of tactics under goals
3. **Policies Matrix** - Policies driven by tactics with enforcement levels
4. **Risk Management** - Risks with mitigation links
5. **KPI Dashboard** - KPIs with AAARR justification and targets vs current

### HTML Generation Function

```typescript
export function generatePolicyCharterHTML(policyCharter: PolicyCharter): string {
  // Generate comprehensive HTML with inline CSS
  // Show hierarchy: Goals → Tactics → Policies
  // Include risk mitigation links
  // Include KPI justification links
  // Color-code enforcement levels (mandatory=red, guideline=blue)
  // Show graduated brackets as expandable sections
}
```

### Key Features

- **Hierarchy Visualization**: Goals contain tactics, tactics drive policies
- **Cross-References**: Links to Arch Scope goals and AAARR metrics
- **Risk Mitigation**: Visual connections between risks and mitigating tactics/policies
- **KPI Justification**: Clear links between KPIs and AAARR metrics they justify
- **Policy Brackets**: Expandable graduated policy rules
- **Enforcement Levels**: Color-coded mandatory vs guideline policies

### Integration

Add to `src/visualizer/index.ts`:
```typescript
export { generatePolicyCharterHTML } from './policy-charter-visualizer';
```

### Styling

Follow existing visualizer patterns:
- Responsive design with CSS Grid/Flexbox
- Color scheme matching other layers
- Interactive elements (tabs, expandable brackets)
- Clear typography and spacing

## Acceptance Criteria
- [ ] policy-charter-visualizer.ts created with generatePolicyCharterHTML function
- [ ] HTML shows complete goals → tactics → policies hierarchy
- [ ] Risk mitigation relationships visualized
- [ ] KPI justification links shown
- [ ] Policy enforcement levels color-coded
- [ ] Graduated brackets expandable
- [ ] Cross-references to Arch Scope and AAARR layers displayed
- [ ] Function exported from src/visualizer/index.ts
- [ ] HTML validates and renders correctly in browsers