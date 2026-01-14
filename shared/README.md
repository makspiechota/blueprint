# Shared Code

This directory will contain code shared between Blueprint and Software Factory products.

## Planned Structure

```
shared/
├── components/
│   ├── ui/          # Base UI components (buttons, modals, forms)
│   ├── form/        # Form controls
│   └── common/      # Common utility components
├── layout/          # App shell, header, sidebar
├── context/         # Shared contexts (Theme, Sidebar, Mode)
├── hooks/           # Shared React hooks
├── utils/           # Utility functions
└── icons/           # Icon components
```

## Migration Status

Files will be migrated from `src/` as the separation progresses.

## Path Alias

Import using: `@shared/...`
