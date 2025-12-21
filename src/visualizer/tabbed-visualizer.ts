export function generateTabbedHTML(
  title: string,
  layers: Array<{ title: string; content: string }>
): string {
  // Extract all styles from layer HTML files
  const allStyles = layers.map(layer => extractStyles(layer.content)).join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Business Layers</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f5f5f5;
    }

    .tabs {
      background: white;
      border-bottom: 2px solid #333;
      padding: 0;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .tab-buttons {
      display: flex;
      gap: 0;
      padding: 0 2rem;
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

    /* Layer-specific styles */
    ${allStyles}
  </style>
</head>
<body>
  <div class="tabs">
    <div class="tab-buttons">
      ${layers.map((layer, i) => `
        <button class="tab-button ${i === 0 ? 'active' : ''}"
                onclick="showTab(${i})">
          ${escapeHtml(layer.title)}
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
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });

      document.getElementById('tab-' + index).classList.add('active');
      document.querySelectorAll('.tab-button')[index].classList.add('active');
    }
  </script>
</body>
</html>
  `.trim();
}

function extractStyles(html: string): string {
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!styleMatch) return '';

  // Remove body and html styles that would conflict with tabbed layout
  let styles = styleMatch[1];

  // Remove body selector and its rules (including multi-line)
  styles = styles.replace(/\s*body\s*\{[^}]*\}/g, '');

  // Remove html selector and its rules
  styles = styles.replace(/\s*html\s*\{[^}]*\}/g, '');

  // Remove * selector (universal reset) as it conflicts with our reset
  styles = styles.replace(/\s*\*\s*\{[^}]*\}/g, '');

  return styles;
}

function extractBodyContent(html: string): string {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return match ? match[1] : html;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
