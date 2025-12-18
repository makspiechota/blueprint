# Task: Extend Visualization with Tabbed UI

## User Story Reference
User Story #4: As a stakeholder, I want to visualize the north star and architectural scope together so that I can see how strategic vision translates into concrete business capabilities

## Description
Extend the existing HTML visualizer to support tabbed interface displaying both north star and architectural scope together. Implement 2x3 grid layout for six scope lists with interactive features.

## Files to Modify/Create
- `src/visualizer/index.ts` - Add generateCombinedVisualization function
- `src/visualizer/templates.ts` - HTML/CSS templates for tabbed UI
- `tests/visualizer.test.ts` - Add combined visualization tests

## Estimated Lines of Code
~90 lines (visualizer: 50, templates: 30, tests: 10)

## Dependencies
- Task 003 (TypeScript types)
- Task 004 (parser)

## Implementation Notes
- Create tabbed interface with two tabs: "North Star" and "Architectural Scope"
- North Star tab: Reuse existing visualization from feature 000001
- Architectural Scope tab:
  - Header with north star reference link and total scope item count
  - 2x3 grid of scope list cards (What, How, Where, Who, When, Why)
  - Each card shows: scope question, item count badge, item list
  - Item count color coding: green (3-12), yellow (<3 or >12), red (empty)
  - Why card special treatment for mission + goals
  - Expandable items (click to show description)
  - Schema tooltips on hover
- Pure CSS/JavaScript (no external dependencies)
- Single HTML file output with inline styles
- Responsive design (desktop 2x3, mobile stacked)
- Tab switching with vanilla JavaScript
- Print-friendly CSS

## Acceptance Criteria
- [ ] Tabbed UI with North Star and Architectural Scope tabs
- [ ] Tab switching works smoothly
- [ ] North Star tab displays existing visualization
- [ ] Architectural Scope tab shows 2x3 grid of scope lists
- [ ] Scope list cards display items with count badges
- [ ] Item count color coding works correctly
- [ ] Items are expandable to show descriptions
- [ ] Why card has special mission + goals layout
- [ ] Responsive layout for desktop/mobile
- [ ] No external dependencies (inline CSS/JS)
- [ ] Unit tests verify HTML generation
- [ ] Tests pass
