# Software Factory Product

AI workflow orchestration platform - visual workflow designer, provider adapters, execution engine.

## Planned Structure

```
software-factory/
├── src/
│   ├── pages/        # Workflow designer, execution view
│   ├── components/   # Agent nodes, canvas, console
│   └── context/      # Workflow execution context
└── backend/          # Factory API server (port 3002, WebSocket 8081)
    ├── routes/       # Workflow API, WebSocket channel
    ├── services/     # Workflow runner, provider adapters
    └── adapters/     # Claude Code, OpenCode adapters
```

## Migration Status

- Backend: Not started
- Frontend: WorkflowDesigner placeholder exists in src/pages/SoftwareFactory/

## Path Alias

Import using: `@factory/...`
