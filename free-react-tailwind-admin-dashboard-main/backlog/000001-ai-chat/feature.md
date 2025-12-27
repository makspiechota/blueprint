# AI Chat for Blueprint Resource Modification

## Feature Overview
Add an AI-powered chat interface to every card/component in the business blueprint UI. Users can chat with AI to brainstorm ideas or order direct modifications to the underlying YAML resources, with changes automatically reflected in the UI via hot-reloading.

## User Stories
- As a user, I want to click a "Chat" button on any blueprint card (e.g., North Star vision) to open an AI chat interface.
- As a user, I want to have a natural conversation with AI about improving a specific resource (e.g., "What are better ways to phrase this vision statement?").
- As a user, I want to instruct AI to modify the resource directly during the conversation (e.g., "Please update the vision to this new text"), which updates the YAML file and refreshes the UI.
- As a user, I want the chat to be context-aware, knowing which resource I'm chatting about.

## Requirements
### Functional
- Chat button on every major card/component (North Star fields, Lean Canvas boxes, etc.)
- Chat modal/panel with natural language AI integration
- Conversational interface: Users can discuss ideas freely, then explicitly instruct AI to apply changes
- Direct file modification via AI agent when user requests it
- Hot-reload triggers UI update automatically

### Technical
- Integrate with existing hot-reload mechanism
- AI agent can read/write YAML files
- Context passing: current resource content and type
- Error handling for invalid modifications
- Secure: AI actions limited to YAML modifications only

## Acceptance Criteria
- [ ] Chat button visible on all blueprint cards
- [ ] AI responds contextually to resource being discussed
- [ ] "Update" commands modify YAML and trigger hot-reload
- [ ] Brainstorming provides helpful suggestions
- [ ] UI updates immediately after file changes
- [ ] Error messages for failed modifications

## Implementation Notes
- Extend existing visualizer components with chat buttons
- New AI chat component/modal
- Backend AI agent with file modification capabilities
- Integration with hot-reload system