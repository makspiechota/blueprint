import { NorthStar } from '../parser/types';
import * as fs from 'fs';

export function generateVisualization(parsedData: NorthStar, outputPath: string): void {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(parsedData.title)} - North Star</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; padding: 2rem; }
    .container { max-width: 900px; margin: 0 auto; background: white; padding: 3rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { font-size: 2.5rem; margin-bottom: 0.5rem; color: #1a1a1a; }
    .metadata { color: #666; font-size: 0.9rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #eee; }
    .section { margin: 2rem 0; }
    .section-title { font-size: 1.5rem; color: #2c5282; margin-bottom: 0.75rem; font-weight: 600; }
    .section-content { background: #f9fafb; padding: 1.5rem; border-left: 4px solid #4299e1; white-space: pre-wrap; }
    .goals { display: grid; gap: 1rem; margin-top: 1rem; }
    .goal { background: #fff; border: 1px solid #e2e8f0; padding: 1.25rem; border-radius: 6px; transition: transform 0.2s; }
    .goal:hover { transform: translateX(4px); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .goal-title { font-size: 1.1rem; font-weight: 600; color: #1a202c; margin-bottom: 0.5rem; }
    .goal-description { color: #4a5568; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${escapeHtml(parsedData.title)}</h1>
    <div class="metadata">
      Version ${escapeHtml(parsedData.version)} • Last updated: ${escapeHtml(parsedData.last_updated)}
    </div>

    <div class="section">
      <div class="section-title">Vision</div>
      <div class="section-content">${escapeHtml(parsedData.vision)}</div>
    </div>

    <div class="section">
      <div class="section-title">Problem</div>
      <div class="section-content">${escapeHtml(parsedData.problem)}</div>
    </div>

    <div class="section">
      <div class="section-title">Solution</div>
      <div class="section-content">${escapeHtml(parsedData.solution)}</div>
    </div>

    <div class="section">
      <div class="section-title">Strategic Goals</div>
      <div class="goals">
        ${parsedData.strategic_goals.map(goal => `
          <div class="goal">
            <div class="goal-title">${escapeHtml(goal.title)}</div>
            <div class="goal-description">${escapeHtml(goal.description)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(outputPath, html, 'utf8');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
