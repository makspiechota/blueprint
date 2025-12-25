import { NorthStar, ArchitecturalScope, LeanCanvas, Business, LeanViability, AARRRMetrics, PolicyCharter } from '../parser/types';
import { parseBusiness, parseLeanCanvas, parseNorthStar, parseArchitecturalScope, parsePolicyCharter, parseLeanViability, parseAARRRMetrics } from '../parser';
import { generateLeanCanvasHTML } from './lean-canvas-visualizer';
import { generateTabbedHTML } from './tabbed-visualizer';
import * as fs from 'fs';
import * as path from 'path';

// Re-export specialized visualizers
export { generateAARRRMetricsHTML } from './aaarr-visualizer';

// Import for internal use
import { generatePolicyCharterHTML } from './policy-charter-visualizer';

export { generatePolicyCharterHTML } from './policy-charter-visualizer';

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

export function generateCombinedVisualization(
  northStar: NorthStar,
  architecturalScope: ArchitecturalScope,
  outputPath: string
): void {
  const scopeLists = ['why', 'what', 'how', 'where', 'who', 'when'] as const;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(northStar.title)} - Blueprint</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; padding: 2rem; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

    .tabs { display: flex; border-bottom: 2px solid #e2e8f0; background: #f9fafb; }
    .tab { padding: 1rem 2rem; cursor: pointer; border: none; background: none; font-size: 1rem; font-weight: 500; color: #4a5568; transition: all 0.2s; }
    .tab:hover { background: #edf2f7; }
    .tab.active { color: #2c5282; border-bottom: 3px solid #4299e1; background: white; }

    .tab-content { display: none; padding: 3rem; }
    .tab-content.active { display: block; }

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

    .scope-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin-top: 2rem; }
    .scope-list { background: #f9fafb; padding: 1.5rem; border-radius: 6px; border: 1px solid #e2e8f0; }
    .scope-list-title { font-size: 1.25rem; font-weight: 600; color: #2c5282; margin-bottom: 1rem; text-transform: capitalize; }
    .scope-items { display: flex; flex-direction: column; gap: 0.75rem; }
    .scope-item { background: white; padding: 1rem; border-left: 3px solid #4299e1; border-radius: 4px; }
    .scope-item-title { font-weight: 600; color: #1a202c; margin-bottom: 0.25rem; }
    .scope-item-description { color: #4a5568; font-size: 0.95rem; }

    .why-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 8px; margin-bottom: 2rem; color: white; }
    .why-card-header { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
    .mission { background: rgba(255,255,255,0.15); padding: 1.5rem; border-radius: 6px; backdrop-filter: blur(10px); }
    .mission-label { font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem; opacity: 0.9; }
    .mission-components { display: grid; gap: 1rem; }
    .mission-component { display: flex; gap: 0.75rem; align-items: baseline; }
    .component-label { font-size: 0.9rem; font-weight: 600; opacity: 0.85; min-width: 90px; }
    .component-value { font-size: 1.1rem; font-weight: 500; }
    .goals-section { margin-top: 1.5rem; }
    .goals-label { font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem; opacity: 0.9; }
    .goals-list { display: grid; gap: 0.75rem; }
    .goal-item { background: rgba(255,255,255,0.15); padding: 1rem; border-radius: 4px; backdrop-filter: blur(10px); }
    .goal-item .goal-title { font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; }
    .goal-item .goal-description { font-size: 0.9rem; opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="tabs">
      <button class="tab active" onclick="switchTab(event, 'north-star')">North Star</button>
      <button class="tab" onclick="switchTab(event, 'architectural-scope')">Architectural Scope</button>
    </div>

    <div id="north-star" class="tab-content active">
      <h1>${escapeHtml(northStar.title)}</h1>
      <div class="metadata">
        Version ${escapeHtml(northStar.version)} • Last updated: ${escapeHtml(northStar.last_updated)}
      </div>

      <div class="section">
        <div class="section-title">Vision</div>
        <div class="section-content">${escapeHtml(northStar.vision)}</div>
      </div>

      <div class="section">
        <div class="section-title">Problem</div>
        <div class="section-content">${escapeHtml(northStar.problem)}</div>
      </div>

      <div class="section">
        <div class="section-title">Solution</div>
        <div class="section-content">${escapeHtml(northStar.solution)}</div>
      </div>

      <div class="section">
        <div class="section-title">Strategic Goals</div>
        <div class="goals">
          ${northStar.strategic_goals.map(goal => `
            <div class="goal">
              <div class="goal-title">${escapeHtml(goal.title)}</div>
              <div class="goal-description">${escapeHtml(goal.description)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div id="architectural-scope" class="tab-content">
      <h1>${escapeHtml(architecturalScope.title)}</h1>
      <div class="metadata">
        Version ${escapeHtml(architecturalScope.version)} • Last updated: ${escapeHtml(architecturalScope.last_updated)}
        <br>North Star Reference: ${escapeHtml(architecturalScope.north_star_ref)}
      </div>

      ${architecturalScope.why ? `
        <div class="why-card">
          <div class="why-card-header">🎯 Business Motivation</div>
          <div class="mission">
            <div class="mission-label">BUSINESS MISSION</div>
            <div class="mission-components">
              <div class="mission-component">
                <span class="component-label">Action:</span>
                <span class="component-value">${escapeHtml(architecturalScope.why.mission.action)}</span>
              </div>
              <div class="mission-component">
                <span class="component-label">Service:</span>
                <span class="component-value">${escapeHtml(architecturalScope.why.mission.service)}</span>
              </div>
              <div class="mission-component">
                <span class="component-label">Beneficiary:</span>
                <span class="component-value">${escapeHtml(architecturalScope.why.mission.beneficiary)}</span>
              </div>
            </div>
          </div>
          ${architecturalScope.why.goals && architecturalScope.why.goals.length > 0 ? `
            <div class="goals-section">
              <div class="goals-label">CAPABILITY GOALS</div>
              <div class="goals-list">
                ${architecturalScope.why.goals.map(goal => `
                  <div class="goal-item">
                    <div class="goal-title">${escapeHtml(goal.title)}</div>
                    <div class="goal-description">${escapeHtml(goal.description)}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <div class="scope-grid">
        ${scopeLists.filter(listName => listName !== 'why').map(listName => {
          const list = architecturalScope[listName];
          if (!list || !Array.isArray(list) || list.length === 0) return '';

          return `
            <div class="scope-list">
              <div class="scope-list-title">${listName.charAt(0).toUpperCase() + listName.slice(1)}</div>
              <div class="scope-items">
                ${list.map(item => `
                  <div class="scope-item">
                    <div class="scope-item-title">${escapeHtml(item.title)}</div>
                    <div class="scope-item-description">${escapeHtml(item.description)}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  </div>

  <script>
    function switchTab(event, tabId) {
      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });

      // Remove active from all tabs
      document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
      });

      // Show selected tab content
      document.getElementById(tabId).classList.add('active');

      // Mark selected tab as active
      event.currentTarget.classList.add('active');
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(outputPath, html, 'utf8');
}

export function visualizePolicyCharter(filePath: string, outputPath: string): void {
  const policyCharter = parsePolicyCharter(filePath);
  const html = generatePolicyCharterHTML(policyCharter);
  fs.writeFileSync(outputPath, html, 'utf8');
}

export function visualizeBusiness(businessFilePath: string, outputPath: string): void {
  const business = parseBusiness(businessFilePath);
  const layers: Array<{ title: string; content: string }> = [];

  // Import additional visualizers
  const { generateLeanViabilityHTML } = require('./lean-viability-visualizer');
  const { generateAARRRMetricsHTML } = require('./aaarr-visualizer');
  const { generatePolicyCharterHTML } = require('./policy-charter-visualizer');
  const { generateTraceabilityGraphHTML } = require('./traceability-visualizer');

  // Discover and visualize each referenced layer
  if (business.north_star_ref) {
    const northStarPath = resolvePath(businessFilePath, business.north_star_ref);
    if (fs.existsSync(northStarPath)) {
      const northStar = parseNorthStar(northStarPath);
      const html = generateNorthStarHTML(northStar);
      layers.push({ title: 'North Star', content: html });
    }
  }

  if (business.lean_canvas_ref) {
    const leanCanvasPath = resolvePath(businessFilePath, business.lean_canvas_ref);
    if (fs.existsSync(leanCanvasPath)) {
      const leanCanvas = parseLeanCanvas(leanCanvasPath);
      const html = generateLeanCanvasHTML(leanCanvas);
      layers.push({ title: 'Lean Canvas', content: html });
    }
  }

  if (business.lean_viability_ref) {
    const leanViabilityPath = resolvePath(businessFilePath, business.lean_viability_ref);
    if (fs.existsSync(leanViabilityPath)) {
      const leanViability = parseLeanViability(leanViabilityPath);
      const html = generateLeanViabilityHTML(leanViability);
      layers.push({ title: 'Lean Viability', content: html });
    }
  }

  if (business.aaarr_ref) {
    const aaarrPath = resolvePath(businessFilePath, business.aaarr_ref);
    if (fs.existsSync(aaarrPath)) {
      const aaarr = parseAARRRMetrics(aaarrPath);
      const baseDir = path.dirname(aaarrPath);
      const html = generateAARRRMetricsHTML(aaarr, baseDir, true);
      layers.push({ title: 'AAARR Metrics', content: html });
    }
  }

  if (business.architectural_scope_ref) {
    const archScopePath = resolvePath(businessFilePath, business.architectural_scope_ref);
    if (fs.existsSync(archScopePath)) {
      const archScope = parseArchitecturalScope(archScopePath);
      const html = generateArchitecturalScopeHTML(archScope, true);
      layers.push({ title: 'Architectural Scope', content: html });
    }
  }

  if (business.policy_charter_ref) {
    const policyCharterPath = resolvePath(businessFilePath, business.policy_charter_ref);
    if (fs.existsSync(policyCharterPath)) {
      const policyCharter = parsePolicyCharter(policyCharterPath);
      const html = generatePolicyCharterHTML(policyCharter, true);
      layers.push({ title: 'Policy Charter', content: html });
    }
  }

  // Add traceability graph as the last tab
  const traceabilityHTML = generateTraceabilityGraphHTML(businessFilePath);
  layers.push({ title: 'Traceability Graph', content: traceabilityHTML });

  // Generate tabbed HTML with all discovered layers
  const tabbedHTML = generateTabbedHTML(business.title, layers);
  fs.writeFileSync(outputPath, tabbedHTML, 'utf8');
}

function resolvePath(baseFilePath: string, refPath: string): string {
  if (path.isAbsolute(refPath)) {
    return refPath;
  }
  const baseDir = path.dirname(baseFilePath);
  return path.resolve(baseDir, refPath);
}

function generateNorthStarHTML(northStar: NorthStar): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(northStar.title)} - North Star</title>
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
    <h1>${escapeHtml(northStar.title)}</h1>
    <div class="metadata">
      Version ${escapeHtml(northStar.version)} • Last updated: ${escapeHtml(northStar.last_updated)}
    </div>

    <div class="section">
      <div class="section-title">Vision</div>
      <div class="section-content">${escapeHtml(northStar.vision)}</div>
    </div>

    <div class="section">
      <div class="section-title">Problem</div>
      <div class="section-content">${escapeHtml(northStar.problem)}</div>
    </div>

    <div class="section">
      <div class="section-title">Solution</div>
      <div class="section-content">${escapeHtml(northStar.solution)}</div>
    </div>

    <div class="section">
      <div class="section-title">Strategic Goals</div>
      <div class="goals">
        ${northStar.strategic_goals.map(goal => `
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
}

function generateArchitecturalScopeHTML(archScope: ArchitecturalScope, multiLayer: boolean = false): string {
  const scopeLists = ['why', 'what', 'how', 'where', 'who', 'when'] as const;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(archScope.title)} - Architectural Scope</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; padding: 2rem; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 3rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { font-size: 2.5rem; margin-bottom: 0.5rem; color: #1a1a1a; }
    .metadata { color: #666; font-size: 0.9rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #eee; }

    .scope-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin-top: 2rem; }
    .scope-list { background: #f9fafb; padding: 1.5rem; border-radius: 6px; border: 1px solid #e2e8f0; }
    .scope-list-title { font-size: 1.25rem; font-weight: 600; color: #2c5282; margin-bottom: 1rem; text-transform: capitalize; }
    .scope-items { display: flex; flex-direction: column; gap: 0.75rem; }
    .scope-item { background: white; padding: 1rem; border-left: 3px solid #4299e1; border-radius: 4px; }
    .scope-item-title { font-weight: 600; color: #1a202c; margin-bottom: 0.25rem; }
    .scope-item-description { color: #4a5568; font-size: 0.95rem; }

    .why-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 8px; margin-bottom: 2rem; color: white; }
    .why-card-header { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
    .mission { background: rgba(255,255,255,0.15); padding: 1.5rem; border-radius: 6px; backdrop-filter: blur(10px); }
    .mission-label { font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem; opacity: 0.9; }
    .mission-components { display: grid; gap: 1rem; }
    .mission-component { display: flex; gap: 0.75rem; align-items: baseline; }
    .component-label { font-size: 0.9rem; font-weight: 600; opacity: 0.85; min-width: 90px; }
    .component-value { font-size: 1.1rem; font-weight: 500; }
    .goals-section { margin-top: 1.5rem; }
    .goals-label { font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem; opacity: 0.9; }
    .goals-list { display: grid; gap: 0.75rem; }
     .goal-item { background: rgba(255,255,255,0.15); padding: 1rem; border-radius: 4px; backdrop-filter: blur(10px); }
     .goal-item .goal-title { font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; }
     .goal-item .goal-description { font-size: 0.9rem; opacity: 0.9; }
     .cross-layer-link { color: #4299e1; text-decoration: none; font-weight: 500; }
     .cross-layer-link:hover { text-decoration: underline; }
   </style>
 </head>
 <body>
   <div class="container">
     <h1>${escapeHtml(archScope.title)}</h1>
     <div class="metadata">
       Version ${escapeHtml(archScope.version)} • Last updated: ${escapeHtml(archScope.last_updated)}
       <br>North Star Reference: ${multiLayer ? `<a href="#" onclick="window.switchTab(null, 'North Star'); return false;" class="cross-layer-link">${escapeHtml(archScope.north_star_ref)}</a>` : escapeHtml(archScope.north_star_ref)}
     </div>

    ${archScope.why ? `
      <div class="why-card">
        <div class="why-card-header">🎯 Business Motivation</div>
        <div class="mission">
          <div class="mission-label">BUSINESS MISSION</div>
          <div class="mission-components">
            <div class="mission-component">
              <span class="component-label">Action:</span>
              <span class="component-value">${escapeHtml(archScope.why.mission.action)}</span>
            </div>
            <div class="mission-component">
              <span class="component-label">Service:</span>
              <span class="component-value">${escapeHtml(archScope.why.mission.service)}</span>
            </div>
            <div class="mission-component">
              <span class="component-label">Beneficiary:</span>
              <span class="component-value">${escapeHtml(archScope.why.mission.beneficiary)}</span>
            </div>
          </div>
        </div>
        ${archScope.why.goals && archScope.why.goals.length > 0 ? `
          <div class="goals-section">
            <div class="goals-label">CAPABILITY GOALS</div>
            <div class="goals-list">
              ${archScope.why.goals.map(goal => `
                <div class="goal-item">
                  <div class="goal-title">${escapeHtml(goal.title)}</div>
                  <div class="goal-description">${escapeHtml(goal.description)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    ` : ''}

    <div class="scope-grid">
      ${scopeLists.filter(listName => listName !== 'why').map(listName => {
        const list = archScope[listName];
        if (!list || !Array.isArray(list) || list.length === 0) return '';

        return `
          <div class="scope-list">
            <div class="scope-list-title">${listName.charAt(0).toUpperCase() + listName.slice(1)}</div>
            <div class="scope-items">
              ${list.map(item => `
                <div class="scope-item">
                  <div class="scope-item-title">${escapeHtml(item.title)}</div>
                  <div class="scope-item-description">${escapeHtml(item.description)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
