# Task: Integrate AI Chat API

## User Story Reference
As a user, I want to have a natural conversation with AI about improving a specific resource.

## Description
Create a simple server using OpenCode SDK (https://opencode.ai/docs/sdk/) and connect the chat modal to it for AI conversations using Grok Code Fast 1 model. Implement API calls for sending messages and receiving AI replies.

## Files to Modify/Create
- `backend/server.js` - Simple server using OpenCode SDK with Grok Code Fast 1
- `src/services/aiService.ts` - Frontend service for API calls to backend
- `src/components/ChatModal.tsx` - Update to use AI service
- `src/types/chat.ts` - TypeScript types for chat messages

## Estimated Lines of Code
~60 lines

## Dependencies
002-create-chat-modal.md

## Implementation Notes
- Install OpenCode SDK: npm install opencode
- Set up server with Grok Code Fast 1 model
- Use fetch API for frontend-backend communication
- Include resource context in API requests
- Handle streaming responses if supported
- Error handling for network/server issues

## Acceptance Criteria
- [ ] OpenCode server runs with Grok Code Fast 1 model
- [ ] Frontend connects to server via API
- [ ] AI service sends/receives messages
- [ ] Context included in requests
- [ ] Error handling for failed requests
- [ ] Loading states during AI responses