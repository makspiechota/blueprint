# What the migrated project is about

A React-based dashboard built with Tailwind CSS, Vite, and TypeScript focused on visualizing and managing business blueprints. It supports multiple business layers including North Star, Lean Canvas, Architectural Scope, Lean Viability, AAARR Metrics, and Policy Charter.

# what essential features it has

- Business blueprint visualizers (AAARR Metrics, Lean Canvas, Lean Viability)
- Dashboard for displaying business layer data
- Sidebar navigation and theme context
- Responsive layout with header and sidebar

# What new modules will we build in the free-react-tailwind-admin-dashboard-main

- Policy Charter Visualizer: A React component using React Flow to visualize policy charters as flow diagrams with goals, tactics, policies, and risks nodes connected by edges.
- Business data integration: Load and manage complete business YAML data including all layers (North Star, Lean Canvas, Architectural Scope, Lean Viability, AAARR, Policy Charter).

# Step-by-Step Migration Guide

[X] Update navigation and routing: Adjust src/App.tsx and sidebar components to include routes for each business layer visualizer, removing non-essential pages. Create a nav menu boilerplate and ensure every business layer is a separate React component.

[X] Update dashboard page: Modify src/pages/Dashboard/Home.tsx to load and display business blueprint data instead of example metrics.

[X] Implement business data integration: Add logic to load YAML files for all business layers (North Star, Lean Canvas, Architectural Scope, Lean Viability, AAARR, Policy Charter) into a centralized state or context. Implement hot-reloading so that when YAML files are modified, the application state updates without restarting the server.

Implement Views:
[X] Implement North Star layer view
[X] Implement Lean Canvas layer view
[] Implement Lean Viability layer view
[] Implement Customer Factory layer view
[] Architectural Scope
[] Policy Charter

[ ] Add Policy Charter Visualizer: Create src/components/PolicyCharterVisualizer.tsx based on the JSX component from tailadmin-template, adapting it to TypeScript and React.

[ ] Update package.json: Remove unused dependencies like @fullcalendar/react, react-dropzone, react-helmet-async, etc., and add reactflow if not present.
