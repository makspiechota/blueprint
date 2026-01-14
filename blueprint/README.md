# Blueprint Product

Business context management platform - north-star, lean canvas, roadmap, DDD, C4, etc.

## Planned Structure

```
blueprint/
├── src/
│   ├── pages/        # Blueprint-specific pages
│   ├── components/   # Blueprint-specific components (visualizers)
│   └── context/      # Blueprint-specific context (BusinessData, Chat)
└── backend/          # Blueprint API server (port 3001, WebSocket 8080)
```

## Migration Status

- Backend: Ready (copied from root backend/)
- Frontend: Files will be migrated from `src/` as separation progresses

## Path Alias

Import using: `@blueprint/...`
