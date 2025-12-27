# Task: Update Visualizers with Chat Buttons

## User Story Reference
As a user, I want to click a "Chat" button on any blueprint card.

## Description
Add ChatButton components to all major visualizer cards (North Star, Lean Canvas, etc.). Each button should pass the appropriate resource context.

## Files to Modify/Create
- `src/components/NorthStarVisualizer.tsx` - Add chat buttons to cards
- `src/components/LeanCanvasVisualizer.tsx` - Add chat buttons to boxes
- `src/components/LeanViabilityVisualizer.tsx` - Add chat buttons
- `src/components/CustomersFactoryVisualizer.tsx` - Add chat buttons
- `src/components/ArchitecturalScopeVisualizer.tsx` - Add chat buttons
- `src/components/PolicyCharterVisualizer.tsx` - Add chat buttons

## Estimated Lines of Code
~90 lines (distributed across files)

## Dependencies
001-add-chat-button.md

## Implementation Notes
- Add buttons to key sections/cards in each visualizer
- Pass resource path/type and current content as props
- Position buttons appropriately (corners, overlays)
- Ensure buttons don't break existing layouts

## Acceptance Criteria
- [ ] Chat buttons appear on all major blueprint components
- [ ] Buttons open correct chat modal with context
- [ ] No layout disruptions
- [ ] Consistent button placement