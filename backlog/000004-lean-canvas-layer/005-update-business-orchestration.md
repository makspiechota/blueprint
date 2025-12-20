# Task: Update Visualizer for Business.yaml Orchestration

## User Story Reference
User stories 1-4: Visualize all layers through business.yaml entry point

## Description
Update the visualizer to handle business.yaml as the single entry point that orchestrates multiple layers. When visualizing business.yaml, discover all referenced layers and render them in a tabbed interface.

## Files to Modify/Create
- `src/visualizer/index.ts` - Add business.yaml orchestration logic
- `src/visualizer/tabbed-visualizer.ts` - Create tabbed interface generator
- `tests/visualizer/business-orchestration.test.ts` - Tests for multi-layer visualization

## Estimated Lines of Code
~90 lines (orchestration: 35, tabbed: 40, tests: 15)

## Dependencies
- Task 001 (schemas)
- Task 002 (types)
- Task 003 (parser/validator)
- Task 004 (lean-canvas visualizer)

## Implementation Notes

### Business.yaml Orchestration Logic

**Main visualizer updates:**
```typescript
// src/visualizer/index.ts
import { Business } from '../types/generated';
import { parseFile } from '../parser';
import { generateLeanCanvasHTML } from './lean-canvas-visualizer';
import { generateNorthStarHTML } from './north-star-visualizer';
import { generateArchScopeHTML } from './arch-scope-visualizer';
import { generateTabbedHTML } from './tabbed-visualizer';

export function visualize(filePath: string): string {
  const parsed = parseFile(filePath);

  if (parsed.type === 'business') {
    return visualizeBusiness(parsed.data as Business, filePath);
  }

  // Existing: north-star, architectural-scope, lean-canvas standalone
  if (parsed.type === 'lean-canvas') {
    return generateLeanCanvasHTML(parsed.data);
  }
  // ...
}

function visualizeBusiness(business: Business, basePath: string): string {
  const layers: Array<{ title: string; content: string }> = [];

  // Discover and render all referenced layers
  if (business.lean_canvas_ref) {
    const leanCanvas = parseFile(resolvePath(basePath, business.lean_canvas_ref));
    layers.push({
      title: 'Lean Canvas',
      content: generateLeanCanvasHTML(leanCanvas.data)
    });
  }

  if (business.north_star_ref) {
    const northStar = parseFile(resolvePath(basePath, business.north_star_ref));
    layers.push({
      title: 'North Star',
      content: generateNorthStarHTML(northStar.data)
    });
  }

  if (business.architectural_scope_ref) {
    const archScope = parseFile(resolvePath(basePath, business.architectural_scope_ref));
    layers.push({
      title: 'Architectural Scope',
      content: generateArchScopeHTML(archScope.data)
    });
  }

  // Generate tabbed interface with all layers
  return generateTabbedHTML(business.title, layers);
}

function resolvePath(basePath: string, refPath: string): string {
  // Resolve relative paths from business.yaml location
  return path.resolve(path.dirname(basePath), refPath);
}
```

### Tabbed Interface Generator

**Create tabbed HTML:**
```typescript
// src/visualizer/tabbed-visualizer.ts
export function generateTabbedHTML(
  title: string,
  layers: Array<{ title: string; content: string }>
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Business Layers</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f5f5f5;
    }

    .tabs {
      background: white;
      border-bottom: 2px solid #333;
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .tab-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .tab-button {
      padding: 1rem 1.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 1rem;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
    }

    .tab-button:hover {
      background: #f5f5f5;
    }

    .tab-button.active {
      border-bottom-color: #333;
      font-weight: bold;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    @media print {
      .tabs { display: none; }
      .tab-content { display: block !important; page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="tabs">
    <div class="tab-buttons">
      ${layers.map((layer, i) => `
        <button class="tab-button ${i === 0 ? 'active' : ''}"
                onclick="showTab(${i})">
          ${layer.title}
        </button>
      `).join('')}
    </div>
  </div>

  ${layers.map((layer, i) => `
    <div class="tab-content ${i === 0 ? 'active' : ''}" id="tab-${i}">
      ${extractBodyContent(layer.content)}
    </div>
  `).join('')}

  <script>
    function showTab(index) {
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });

      // Show selected tab
      document.getElementById('tab-' + index).classList.add('active');
      document.querySelectorAll('.tab-button')[index].classList.add('active');
    }
  </script>
</body>
</html>
  `;
}

function extractBodyContent(html: string): string {
  // Extract content between <body> tags from individual layer HTML
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return match ? match[1] : html;
}
```

### Test Coverage

**Tests to add:**
- business.yaml with lean-canvas only renders single tab
- business.yaml with north-star only renders single tab
- business.yaml with all three layers renders three tabs
- business.yaml with lean-canvas + north-star renders two tabs
- Tabs are clickable and switch content
- Each layer content is properly extracted
- Path resolution works for relative references

## Acceptance Criteria
- [ ] business.yaml visualizer discovers all referenced layers
- [ ] Tabbed interface renders with correct number of tabs
- [ ] Tab switching works correctly
- [ ] Each layer displays in its own tab
- [ ] Print mode shows all tabs sequentially
- [ ] Path resolution works for relative references (e.g., "./lean-canvas.yaml")
- [ ] Backward compatibility: individual files still visualize standalone
- [ ] All tests passing
