# The Six Pillars Framework (10 min)

## Overview

The Six Pillars are the foundational capabilities that enable autonomous SDLC. Most organizations have 1-2 pillars well-developed and struggle with AI because they're missing the others.

## The Six Pillars

### 1. Spec-Driven Development
**Define what to build before building it.**

AI agents need specifications, not vague requests. "Build a login feature" produces garbage. "Make these 5 acceptance tests pass" produces working code.

### 2. Small Batch Workflow
**Break work into focused chunks AI can execute reliably.**

AI agents have context limits. They excel at focused, well-scoped tasks. They fail at sprawling, multi-day epics.

### 3. Test-First Practices
**Write tests before implementation.**

Without tests, how do you know AI code works? Manual review doesn't scale. Test-first means AI knows exactly what "done" looks like.

### 4. Deployment Safety
**Ship changes safely with feature flags and instant rollback.**

Autonomous AI will ship many changes. If deployment is scary, you'll never let AI ship autonomously.

### 5. Context Management
**Systematize knowledge so AI has the context it needs.**

AI makes decisions based on context provided. If architectural knowledge lives in people's heads, AI can't access it.

### 6. AI Integration
**Systematize AI usage across your workflow.**

Chaotic AI adoption = inconsistent results. Systematic integration means the whole team leverages AI effectively.

## How Pillars Reinforce Each Other

```
Specs → define what tests verify
Tests → confirm AI implementation correct
Small batches → keep AI context focused
Context → informs AI decisions
Deployment safety → enables AI to ship
AI integration → ties it all together
```

## Common Patterns

| Pillars Present | Result |
|----------------|--------|
| 0-1 pillars | AI feels like a toy |
| 2-3 pillars | Occasional wins, inconsistent |
| 4-5 pillars | Significant productivity gains |
| All 6 pillars | Autonomous SDLC capability |
