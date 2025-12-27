# Task: Add Chat Button Component

## User Story Reference
As a user, I want to click a "Chat" button on any blueprint card (e.g., North Star vision) to open an AI chat interface.

## Description
Create a reusable ChatButton component that can be added to blueprint visualizer cards. The button should be styled consistently and accept props for the resource context.

## Files to Modify/Create
- `src/components/ChatButton.tsx` - New component with chat icon and click handler
- `src/icons/index.ts` - Add chat icon if not present

## Estimated Lines of Code
~30 lines

## Dependencies
None

## Implementation Notes
- Use existing icon system (chat icon likely exists)
- Button should be small, positioned in card corners
- Pass resource type and content as props for context
- Style with Tailwind classes matching existing UI

## Acceptance Criteria
- [ ] ChatButton component renders correctly
- [ ] Click handler opens chat modal (to be implemented)
- [ ] Consistent styling with existing UI