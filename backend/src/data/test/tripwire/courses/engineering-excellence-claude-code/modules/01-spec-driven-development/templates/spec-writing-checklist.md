# Spec Writing Checklist

Use this checklist before asking Claude Code to implement. A complete spec leads to correct implementation.

## Interface Definition

- [ ] **Function/method signature defined** - Name, parameters, return type
- [ ] **Input types specified** - What goes in
- [ ] **Output types specified** - What comes out
- [ ] **Error handling defined** - How failures are communicated

## Happy Path

- [ ] **Basic success case** - The simplest valid input
- [ ] **Typical use case** - Most common scenario
- [ ] **Expected output format** - Exact structure verified

## Edge Cases

- [ ] **Empty/null inputs** - What happens with nothing?
- [ ] **Boundary values** - Min, max, limits
- [ ] **Invalid inputs** - Wrong types, formats
- [ ] **Special characters** - Unicode, escapes, etc.

## Error Handling

- [ ] **Error types defined** - What errors can occur?
- [ ] **Error messages specified** - Exact wording if important
- [ ] **Error recovery** - Can/should it recover?

## Integration

- [ ] **Dependencies identified** - What does this need?
- [ ] **Side effects documented** - Does it change state?
- [ ] **Idempotency considered** - Safe to retry?

## Quality Checks

- [ ] **Test runs and fails** - Red phase confirmed
- [ ] **Test is deterministic** - Same result every time
- [ ] **Test is isolated** - No external dependencies
- [ ] **Test is readable** - Clear what's being tested

## Before Sending to Claude Code

- [ ] Spec is complete (this checklist)
- [ ] No ambiguous requirements
- [ ] Success criteria are verifiable
- [ ] Context is provided if needed
