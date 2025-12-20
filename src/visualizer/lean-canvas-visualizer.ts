import { LeanCanvas } from '../parser/types';

export function generateLeanCanvasHTML(canvas: LeanCanvas): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(canvas.title)} - Lean Canvas</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 2rem;
      background: #f5f5f5;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .metadata { color: #666; font-size: 0.9rem; }

    .canvas-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      grid-template-rows: auto auto auto;
      gap: 1rem;
      margin-top: 1rem;
    }

    .box {
      background: white;
      border: 2px solid #333;
      border-radius: 8px;
      padding: 1rem;
      min-height: 150px;
    }

    .box-title {
      font-weight: bold;
      font-size: 0.85rem;
      text-transform: uppercase;
      color: #333;
      margin-bottom: 0.75rem;
      border-bottom: 1px solid #ddd;
      padding-bottom: 0.5rem;
    }

    .box-content { font-size: 0.9rem; line-height: 1.5; color: #444; }
    .box-content ul { padding-left: 1.5rem; margin-top: 0.5rem; }
    .box-content li { margin-bottom: 0.5rem; }
    .box-content p { margin-bottom: 0.75rem; }
    .box-content p:last-child { margin-bottom: 0; }

    /* Grid positioning */
    .problem { grid-column: 1; grid-row: 1; }
    .solution { grid-column: 2; grid-row: 1; }
    .uvp { grid-column: 3; grid-row: 1; }
    .unfair { grid-column: 4; grid-row: 1; }
    .customer { grid-column: 5; grid-row: 1 / 3; }

    .metrics { grid-column: 1; grid-row: 2; }
    .channels { grid-column: 2 / 5; grid-row: 2; }

    .costs { grid-column: 1 / 3; grid-row: 3; }
    .revenue { grid-column: 3 / 6; grid-row: 3; }

    @media print {
      body { padding: 0; background: white; }
      .box { break-inside: avoid; }
    }

    @media (max-width: 768px) {
      .canvas-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }
      .problem, .solution, .uvp, .unfair, .customer,
      .metrics, .channels, .costs, .revenue {
        grid-column: 1 !important;
        grid-row: auto !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${escapeHtml(canvas.title)}</h1>
      <div class="metadata">
        Version ${escapeHtml(canvas.version)} • Last updated: ${escapeHtml(canvas.last_updated)}
      </div>
    </div>

    <div class="canvas-grid">
      ${renderBox('Problem', 'problem', canvas.problem)}
      ${renderBox('Solution', 'solution', canvas.solution)}
      ${renderBox('Unique Value Proposition', 'uvp', canvas.unique_value_proposition)}
      ${renderBox('Unfair Advantage', 'unfair', canvas.unfair_advantage)}
      ${renderBox('Customer Segments', 'customer', canvas.customer_segments)}
      ${renderBox('Key Metrics', 'metrics', canvas.key_metrics)}
      ${renderBox('Channels', 'channels', canvas.channels)}
      ${renderBox('Cost Structure', 'costs', canvas.cost_structure)}
      ${renderBox('Revenue Streams', 'revenue', canvas.revenue_streams)}
    </div>
  </div>
</body>
</html>
  `.trim();
}

function renderBox(title: string, className: string, data: any): string {
  const content = renderBoxContent(data);

  return `
    <div class="box ${className}">
      <div class="box-title">${escapeHtml(title)}</div>
      <div class="box-content">
        ${content}
      </div>
    </div>
  `.trim();
}

function renderBoxContent(data: any): string {
  if (!data) {
    return '<p style="color: #999; font-style: italic;">Not specified</p>';
  }

  const parts: string[] = [];

  // Handle each field in the data object
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length > 0) {
      // Render arrays as lists
      parts.push(`<ul>${value.map(item => `<li>${escapeHtml(String(item))}</li>`).join('')}</ul>`);
    } else if (typeof value === 'string' && value.trim()) {
      // Render non-empty strings as paragraphs
      parts.push(`<p>${escapeHtml(value)}</p>`);
    }
  }

  return parts.length > 0 ? parts.join('\n') : '<p style="color: #999; font-style: italic;">Not specified</p>';
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
