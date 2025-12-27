# Task: Add File Modification to AI Agent

## User Story Reference
As a user, I want to instruct AI to modify the resource directly during the conversation.

## Description
Extend the AI service to handle file modification requests. When user instructs AI to update content, the AI agent should modify the appropriate YAML file.

## Files to Modify/Create
- `src/services/aiService.ts` - Add file modification logic
- `src/utils/yamlUtils.ts` - Utilities for reading/writing YAML files
- `src/types/chat.ts` - Add modification action types

## Estimated Lines of Code
~70 lines

## Dependencies
003-integrate-ai-api.md

## Implementation Notes
- AI detects modification intent from user messages
- Use fs/file system access for YAML updates
- Validate changes before applying
- Trigger hot-reload after successful modification
- Security: Limit to YAML files only

## Acceptance Criteria
- [ ] AI recognizes modification requests
- [ ] YAML files updated correctly
- [ ] Hot-reload triggered after changes
- [ ] Validation prevents invalid modifications