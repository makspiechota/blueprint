---
type: adr
id: adr-001
title: Repository Structure - Blueprint and Software Factory Separation
status: accepted
date: 2026-01-14
---

# ADR-001: Repository Structure - Blueprint and Software Factory Separation

## Context

We are building two related but distinct products in the same monorepo:

1. **Blueprint** - Business context management platform (north-star, lean canvas, roadmap, DDD, C4, etc.)
2. **Software Factory** - AI workflow orchestration platform (visual workflow designer, provider adapters, execution engine)

Currently, both share the same React app and Express backend. We need to decide how to structure the codebase for:
- Clear separation of concerns
- Independent development and deployment potential
- Code reuse where appropriate
- Clear product switching in the UI

## Decision

### 1. Physical Directory Separation

```
products/
├── shared/                    # Shared code between products
│   ├── ui-components/         # Base UI components (buttons, modals, etc.)
│   ├── App.tsx               # Base app shell with mode switcher
│   └── utils/                # Shared utilities
│
├── blueprint/                 # Blueprint product
│   ├── src/
│   │   ├── pages/            # Blueprint-specific pages
│   │   ├── components/       # Blueprint-specific components
│   │   └── context/          # Blueprint-specific context
│   └── backend/
│       ├── routes/           # Blueprint API routes
│       └── services/         # Blueprint services
│
└── software-factory/          # Software Factory product
    ├── src/
    │   ├── pages/            # Workflow designer, execution view
    │   ├── components/       # Agent nodes, canvas, console
    │   └── context/          # Workflow execution context
    └── backend/
        ├── routes/           # Workflow API, WebSocket channel
        ├── services/         # Workflow runner, provider adapters
        └── adapters/         # Claude Code, OpenCode adapters
```

### 2. UI Mode Switcher

- Mode switcher in header (where Blueprint logo currently is)
- Click to toggle between "Blueprint" and "Software Factory" modes
- Each mode has completely separate navigation menu
- Mode preference persisted in localStorage

### 3. Separate Backends

- Each product has its own Express server running on separate ports:
  - Blueprint: existing backend (port 3001)
  - Software Factory: new backend (port 3002)
- Separate WebSocket servers:
  - Blueprint: existing WebSocket for file updates (port 8080)
  - Software Factory: new WebSocket for workflow execution events (port 8081)
- Frontend switches API base URL based on current mode

### 4. Shared Resources

- Base App shell (header, sidebar container, theme)
- UI component library (buttons, modals, forms, etc.)
- Authentication (when implemented)
- Common utilities

## Consequences

### Positive
- Clear separation enables independent development
- Products can be deployed separately if needed in future
- Teams can work on different products without conflicts
- Shared components reduce duplication

### Negative
- Initial refactoring effort to separate existing code
- Need to maintain shared component library
- Build configuration becomes more complex

### Neutral
- Data storage remains in `backend/src/data/{productName}/` structure
- Both products visible in same deployment for now

## Implementation Plan

1. Create `shared/` directory with extracted common components
2. Move Blueprint-specific code to `blueprint/` directory
3. Create `software-factory/` directory for new features
4. Implement mode switcher in shared App shell
5. Set up separate routing for each mode

## Related

- C4 Diagram: `backend/src/data/test/c4/software-factory.likec4`
- Epic: "Build a no-code platform for autonomous SDLC workflows"
