export function generateTabbedHTML(
  title: string,
  layers: Array<{ title: string; content: string }>
): string {
  // Extract all styles from layer HTML files
  const allStyles = layers.map(layer => extractStyles(layer.content)).join('\n');

  // Check if any layer uses Mermaid diagrams
  const needsMermaid = layers.some(layer => layer.content.includes('class="mermaid"'));

  // Define CSS variables for consistent styling
  const cssVariables = `
    :root {
      --primary-color: #3182ce;
      --secondary-color: #4a5568;
      --text-color: #1a202c;
      --background-color: #f5f5f5;
      --border-color: #e2e8f0;
      --shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Business Layers</title>
  <style>
    ${cssVariables}

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      background: var(--background-color);
      color: var(--text-color);
    }

    .tabs {
      background: white;
      border-bottom: 2px solid var(--border-color);
      padding: 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: var(--shadow);
    }

    .tab-buttons {
      display: flex;
      gap: 0;
      padding: 0 2rem;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .tab-buttons::-webkit-scrollbar {
      display: none;
    }

    .tab-button {
      padding: 1rem 1.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 1rem;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .tab-button:hover {
      background: var(--background-color);
    }

    .tab-button.active {
      border-bottom-color: var(--primary-color);
      font-weight: bold;
      color: var(--primary-color);
    }

    .tab-content {
      display: none;
      min-height: 80vh;
    }

    .tab-content.active {
      display: block;
    }

    /* Pagination for large datasets */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin: 2rem 0;
      padding: 1rem;
    }

    .pagination button {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      background: white;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .pagination button:hover {
      background: var(--background-color);
    }

    .pagination button.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Filter and search */
    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--secondary-color);
    }

    .filter-group input,
    .filter-group select {
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .search-input {
      flex: 1;
      max-width: 300px;
    }

    /* Show more/less functionality */
    .expandable-content {
      max-height: 300px;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .expandable-content.expanded {
      max-height: none;
    }

    .expand-toggle {
      display: block;
      margin: 1rem auto;
      padding: 0.5rem 1rem;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .expand-toggle:hover {
      background: #2c5aa0;
    }

    @media print {
      .tabs,
      .pagination,
      .filters,
      .expand-toggle { display: none !important; }
      .tab-content {
        display: block !important;
        page-break-after: always;
        break-inside: avoid;
      }
      .expandable-content {
        max-height: none !important;
      }
      body {
        background: white !important;
      }
    }

    @media (max-width: 768px) {
      .tab-buttons {
        padding: 0 1rem;
      }
      .tab-button {
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
      }
      .filters {
        flex-direction: column;
      }
      .search-input {
        max-width: none;
      }
    }

    /* Layer-specific styles */
    ${allStyles}
  </style>
  ${needsMermaid ? `
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#FF6B35',
        primaryTextColor: '#fff',
        primaryBorderColor: '#FF6B35',
        lineColor: '#999',
        secondaryColor: '#4ECDC4',
        tertiaryColor: '#45B7D1'
      },
      flowchart: {
        curve: 'basis',
        padding: 20,
        nodeSpacing: 50,
        rankSpacing: 80,
        htmlLabels: true
      }
    });
  </script>
  ` : ''}
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

      const tabContent = document.getElementById('tab-' + index);
      tabContent.classList.add('active');
      document.querySelectorAll('.tab-button')[index].classList.add('active');

      // Render any unprocessed Mermaid diagrams in this tab
      if (typeof mermaid !== 'undefined') {
        const mermaidElements = tabContent.querySelectorAll('.mermaid:not([data-processed])');
        if (mermaidElements.length > 0) {
          mermaid.run({ nodes: mermaidElements });
        }
      }

      // Scroll to top when switching tabs
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Navigation function for cross-tab navigation
    function switchTab(event, tabId) {
      const tabIndex = Array.from(document.querySelectorAll('.tab-button')).findIndex(btn =>
        btn.textContent.trim().toLowerCase().includes(tabId.toLowerCase())
      );
      if (tabIndex !== -1) {
        showTab(tabIndex);
      }
    }

    // Make switchTab globally available
    window.switchTab = switchTab;

    // Initialize expandable content
    document.addEventListener('DOMContentLoaded', function() {
      // Render Mermaid diagrams in the initially active tab
      if (typeof mermaid !== 'undefined') {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
          const mermaidElements = activeTab.querySelectorAll('.mermaid');
          if (mermaidElements.length > 0) {
            mermaid.run({ nodes: mermaidElements });
          }
        }
      }

      // Add expand/collapse functionality to long content
      const expandableContents = document.querySelectorAll('.expandable-content');
      expandableContents.forEach(content => {
        if (content.scrollHeight > 300) {
          const toggle = document.createElement('button');
          toggle.className = 'expand-toggle';
          toggle.textContent = 'Show More';
          toggle.onclick = function() {
            content.classList.toggle('expanded');
            toggle.textContent = content.classList.contains('expanded') ? 'Show Less' : 'Show More';
          };
          content.parentNode.insertBefore(toggle, content.nextSibling);
        }
      });

      // Add search functionality
      const searchInputs = document.querySelectorAll('.search-input');
      searchInputs.forEach(input => {
        input.addEventListener('input', function(e) {
          const searchTerm = e.target.value.toLowerCase();
          const tabContent = e.target.closest('.tab-content');
          const searchableItems = tabContent.querySelectorAll('[data-searchable]');

          searchableItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? '' : 'none';
          });
        });
      });

      // Add pagination functionality
      const paginationContainers = document.querySelectorAll('.pagination-container');
      paginationContainers.forEach(container => {
        const items = container.querySelectorAll('.paginated-item');
        const pageSize = 10;
        let currentPage = 1;

        function showPage(page) {
          const start = (page - 1) * pageSize;
          const end = start + pageSize;

          items.forEach((item, index) => {
            item.style.display = (index >= start && index < end) ? '' : 'none';
          });

          updatePaginationButtons(container, page, Math.ceil(items.length / pageSize));
        }

        function updatePaginationButtons(container, currentPage, totalPages) {
          const pagination = container.querySelector('.pagination');
          if (!pagination) return;

          pagination.innerHTML = '';

          // Previous button
          const prevBtn = document.createElement('button');
          prevBtn.textContent = '«';
          prevBtn.disabled = currentPage === 1;
          prevBtn.onclick = () => showPage(currentPage - 1);
          pagination.appendChild(prevBtn);

          // Page numbers
          for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i.toString();
            pageBtn.className = i === currentPage ? 'active' : '';
            pageBtn.onclick = () => showPage(i);
            pagination.appendChild(pageBtn);
          }

          // Next button
          const nextBtn = document.createElement('button');
          nextBtn.textContent = '»';
          nextBtn.disabled = currentPage === totalPages;
          nextBtn.onclick = () => showPage(currentPage + 1);
          pagination.appendChild(nextBtn);
        }

        // Initialize pagination
        if (items.length > pageSize) {
          const pagination = document.createElement('div');
          pagination.className = 'pagination';
          container.appendChild(pagination);
          showPage(1);
        }
      });
    });
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
