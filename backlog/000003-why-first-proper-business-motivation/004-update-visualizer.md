# Task: Update Visualizer with WHY-First Ordering and Special Treatment

## User Story Reference
User Story #1: As a business analyst, I want WHY to be the first scope dimension
User Story #4: As an architect, I want the business mission to inform all other scope decisions
User Story #5: As a stakeholder, I want to see WHY prominently displayed first in visualizations

## Description
Update the visualizer to display WHY first with special treatment. WHY card should span full width, show mission with three components clearly, and list goals below. Update scope list ordering to WHY-first.

## Files to Modify/Create
- `src/visualizer/index.ts` - Update generateCombinedVisualization function
- `tests/visualizer.test.ts` - Update tests for new WHY structure

## Estimated Lines of Code
~85 lines (visualizer: 60, tests: 25)

## Dependencies
- Task 001 (schema updated)
- Task 002 (types regenerated)

## Implementation Notes

### Update scopeLists Order
```typescript
const scopeLists = ['why', 'what', 'how', 'where', 'who', 'when'] as const;
```

### WHY Card Special Treatment

Add special handling for WHY before the grid:

```typescript
// Render WHY card first (full width)
let whyCardHtml = '';
if (architecturalScope.why) {
  const { mission, goals } = architecturalScope.why;
  whyCardHtml = `
    <div class="why-card">
      <div class="why-card-header">🎯 Business Motivation</div>
      <div class="mission">
        <div class="mission-label">BUSINESS MISSION</div>
        <div class="mission-components">
          <div class="mission-component">
            <span class="component-label">Action:</span>
            <span class="component-value">${escapeHtml(mission.action)}</span>
          </div>
          <div class="mission-component">
            <span class="component-label">Service:</span>
            <span class="component-value">${escapeHtml(mission.service)}</span>
          </div>
          <div class="mission-component">
            <span class="component-label">Beneficiary:</span>
            <span class="component-value">${escapeHtml(mission.beneficiary)}</span>
          </div>
        </div>
      </div>
      ${goals && goals.length > 0 ? `
        <div class="goals-section">
          <div class="goals-label">CAPABILITY GOALS</div>
          <div class="goals-list">
            ${goals.map(goal => `
              <div class="goal-item">
                <div class="goal-title">${escapeHtml(goal.title)}</div>
                <div class="goal-description">${escapeHtml(goal.description)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// Then render other scope lists, skipping 'why' since it's already rendered
${scopeLists.filter(listName => listName !== 'why').map(listName => {
  // existing grid rendering logic
}).join('')}
```

### CSS Styling

Add styles for WHY card:
- Full width, larger than other cards
- Different background color (light blue/purple)
- Mission displayed prominently with icon
- Three components shown clearly
- Goals listed below mission

Desktop: WHY full width at top, then 2x3 grid
Mobile: WHY first, then cards stack

## Acceptance Criteria
- [ ] WHY displayed first before other scope lists
- [ ] WHY card spans full width
- [ ] Business mission prominently displayed with icon
- [ ] Mission shows three components clearly (action, service, beneficiary)
- [ ] Goals listed below mission as separate section
- [ ] WHY card has distinct styling (different background, larger)
- [ ] Other scope lists in correct order (what, how, where, who, when)
- [ ] Responsive layout works (desktop: WHY full width + 2x3 grid, mobile: stacked)
- [ ] Tests updated for new WHY structure
- [ ] All tests pass
