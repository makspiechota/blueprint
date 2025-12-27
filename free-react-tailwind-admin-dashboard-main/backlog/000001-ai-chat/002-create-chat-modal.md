# Task: Create Chat Modal Component

## User Story Reference
As a user, I want to click a "Chat" button on any blueprint card to open an AI chat interface.

## Description
Create a ChatModal component that appears as an overlay when the chat button is clicked. Include message history, input field, and close functionality.

## Files to Modify/Create
- `src/components/ChatModal.tsx` - New modal component with chat UI
- `src/context/ChatContext.tsx` - Optional context for chat state management

## Estimated Lines of Code
~80 lines

## Dependencies
001-add-chat-button.md

## Implementation Notes
- Use modal pattern from existing UI components
- Include scrollable message area
- Input field with send button
- Context props: resource type, current content
- Position as overlay/modal

## Acceptance Criteria
- [ ] Modal opens/closes correctly
- [ ] Message display and input work
- [ ] Context passed to AI (to be implemented)
- [ ] Responsive design