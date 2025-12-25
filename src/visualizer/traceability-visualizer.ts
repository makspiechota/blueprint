import { buildTraceabilityGraph, parseOrchestratedBusiness } from '../parser/orchestration';
import { TraceabilityGraph } from '../parser/types';
import { getNodeColor } from '../utils/traceability';

export function generateTraceabilityGraphHTML(businessFilePath: string): string {
  // Parse the orchestrated business
  const orchestrated = parseOrchestratedBusiness(businessFilePath);

  // Build the traceability graph for the business
  const graph = buildTraceabilityGraph(orchestrated);

  return `
    <div class="traceability-container">
      <div class="graph-header">
        <h2>Business Architecture Traceability</h2>
        <div class="graph-stats">
          <span class="stat">Nodes: ${graph.nodes.length}</span>
          <span class="stat">Edges: ${graph.edges.length}</span>
        </div>
      </div>
      <div id="traceability-graph" class="traceability-graph"></div>
      <div class="graph-legend">
        <h3>Legend</h3>
        <div class="legend-items">
          <div class="legend-item">
            <div class="legend-color" style="background-color: ${getNodeColor('business')}"></div>
            <span>Business</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: ${getNodeColor('north-star')}"></div>
            <span>North Star</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: ${getNodeColor('lean-canvas')}"></div>
            <span>Lean Canvas</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: ${getNodeColor('architectural-scope')}"></div>
            <span>Architectural Scope</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: ${getNodeColor('lean-viability')}"></div>
            <span>Lean Viability</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: ${getNodeColor('aaarr-metrics')}"></div>
            <span>AAARR Metrics</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: ${getNodeColor('policy-charter')}"></div>
            <span>Policy Charter</span>
          </div>
        </div>
      </div>
    </div>

    <style>
      .traceability-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .graph-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #e2e8f0;
      }

      .graph-header h2 {
        margin: 0;
        color: #1a202c;
        font-size: 1.5rem;
      }

      .graph-stats {
        display: flex;
        gap: 1rem;
      }

      .stat {
        background: #f7fafc;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.9rem;
        color: #4a5568;
        border: 1px solid #e2e8f0;
      }

      .traceability-graph {
        width: 100%;
        height: 600px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        background: #fafafa;
        margin-bottom: 2rem;
      }

      .graph-legend {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }

      .graph-legend h3 {
        margin: 0 0 1rem 0;
        color: #1a202c;
        font-size: 1.1rem;
      }

      .legend-items {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .legend-color {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0 0 0 1px #e2e8f0;
      }

      .legend-item span {
        font-size: 0.9rem;
        color: #4a5568;
      }

      /* Node styles for D3 */
      .node {
        cursor: pointer;
        stroke: #fff;
        stroke-width: 2px;
      }

      .node:hover {
        stroke-width: 3px;
      }

      .node text {
        font-size: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        pointer-events: none;
        text-anchor: middle;
        dominant-baseline: middle;
      }

      .link {
        stroke: #999;
        stroke-opacity: 0.6;
        fill: none;
        marker-end: url(#arrowhead);
      }

      .link.highlighted {
        stroke: #3182ce;
        stroke-opacity: 1;
        stroke-width: 3px;
      }

      /* Print styles */
      @media print {
        .traceability-graph {
          display: none;
        }
        .graph-legend {
          break-inside: avoid;
        }
      }
    </style>

    <script src="https://cdn.jsdelivr.net/npm/d3@7.8.5/dist/d3.min.js"></script>
    <script>
      console.log('Traceability graph script loading...');

      // Node color function
      function getNodeColor(layer) {
        const colors = {
          'business': '#FF6B6B', // Red
          'north-star': '#4ECDC4', // Teal
          'lean-canvas': '#45B7D1', // Blue
          'architectural-scope': '#96CEB4', // Green
          'lean-viability': '#FFEAA7', // Yellow
          'aaarr-metrics': '#DDA0DD', // Plum
          'policy-charter': '#98D8C8' // Mint
        };
        return colors[layer] || '#CCCCCC';
      }

      // Graph data
      const graphData = ${JSON.stringify(graph)};
      console.log('Graph data loaded:', graphData.nodes.length, 'nodes,', graphData.edges.length, 'edges');

      // Set fixed dimensions to match CSS container
      const width = 800;
      const height = 600;

      // Set up SVG
      const svg = d3.select('#traceability-graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      const g = svg.append('g');

      // Add zoom behavior
      svg.call(d3.zoom().on('zoom', function(event) {
        g.attr('transform', event.transform);
      }));

      // Add arrow marker
      svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
         .attr('fill', '#999');

      // Create force simulation
      const simulation = d3.forceSimulation(graphData.nodes)
        .force('link', d3.forceLink(graphData.edges).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(400, 300))
        .force('collision', d3.forceCollide().radius(30));

      // Create links
      const link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(graphData.edges)
        .enter().append('line')
        .attr('class', 'link')
        .attr('stroke-width', d => Math.sqrt(d.strength) * 2);

      // Create nodes
      const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(graphData.nodes)
        .enter().append('circle')
        .attr('class', 'node')
        .attr('r', 20)
        .attr('fill', d => getNodeColor(d.layer))
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended))
        .on('click', nodeClick)
        .on('mouseover', nodeMouseover)
        .on('mouseout', nodeMouseout);

      // Add labels
      const labels = g.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(graphData.nodes)
        .enter().append('text')
        .attr('class', 'node-label')
        .text(d => d.title.length > 15 ? d.title.substring(0, 12) + '...' : d.title)
        .attr('font-size', '10px')
        .attr('fill', '#fff')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em');

      // Simulation tick
      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);

        labels
          .attr('x', d => d.x)
          .attr('y', d => d.y);
      });

      // Drag functions
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      // Node interaction functions
      function nodeClick(event, d) {
        // Highlight connected nodes and edges
        highlightConnections(d.id);

        // Navigate to the corresponding tab
        navigateToTab(d.layer);
      }

      function nodeMouseover(event, d) {
        // Show tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .html(\`
            <strong>\${d.title}</strong><br>
            Layer: \${d.layer}<br>
            Type: \${d.type}
            \${d.description ? '<br>Description: ' + d.description : ''}
          \`);

        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      }

      function nodeMouseout() {
        d3.selectAll('.tooltip').remove();
      }

      // Highlight connections
      function highlightConnections(nodeId) {
        // Reset all links and nodes
        link.classed('highlighted', false);
        node.classed('highlighted', false);

        // Find connected edges
        const connectedEdges = graphData.edges.filter(edge =>
          edge.source.id === nodeId || edge.target.id === nodeId
        );

        // Highlight connected edges
        link.filter(d =>
          connectedEdges.some(edge =>
            (edge.source.id === d.source.id && edge.target.id === d.target.id) ||
            (edge.source.id === d.target.id && edge.target.id === d.source.id)
          )
        ).classed('highlighted', true);

        // Highlight connected nodes
        const connectedNodeIds = new Set([nodeId]);
        connectedEdges.forEach(edge => {
          connectedNodeIds.add(edge.source.id);
          connectedNodeIds.add(edge.target.id);
        });

        node.filter(d => connectedNodeIds.has(d.id)).classed('highlighted', true);
      }

      // Navigation function for cross-tab navigation
      function navigateToTab(layerType) {
        // Map layer types to tab titles
        const tabTitles = {
          'business': 'Business',
          'north-star': 'North Star',
          'lean-canvas': 'Lean Canvas',
          'architectural-scope': 'Architectural Scope',
          'lean-viability': 'Lean Viability',
          'aaarr-metrics': 'AAARR Metrics',
          'policy-charter': 'Policy Charter'
        };

        const tabTitle = tabTitles[layerType] || layerType;

        // Use the main tab navigation if available
        if (window.switchTab) {
          window.switchTab(null, tabTitle);
        }
      }

      // Make functions globally available
      window.nodeClick = nodeClick;
      window.highlightConnections = highlightConnections;
      window.navigateToTab = navigateToTab;
    </script>
  `;
}