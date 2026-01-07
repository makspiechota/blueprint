/**
 * Extracts the product name from the current URL
 * URL format: /:productName/... (e.g., /blueprint/misc/file.md)
 * @returns The product name or 'blueprint' as default
 */
export function getProductNameFromUrl(): string {
  if (typeof window === 'undefined') return 'blueprint';
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  return pathParts[0] || 'blueprint';
}

/**
 * Processes text to convert [[doc-name]] syntax into HTML links to misc documents
 * @param text - The text to process
 * @returns The text with [[doc-name]] replaced by <a href="/:productName/misc?file=doc-name.md">doc-name</a>
 */
export function processDocLinks(text: string): string {
  if (!text) return text;

  const productName = getProductNameFromUrl();

  // Replace [[doc-name]] with <a href="/:productName/misc?file=doc-name.md">doc-name</a>
  return text.replace(/\[\[([^\]]+)\]\]/g, (_, docName) => {
    return `<a href="/${productName}/misc?file=${docName}.md" class="text-blue-600 hover:text-blue-800 underline">${docName}</a>`;
  });
}

/**
 * Reverses processDocLinks - converts HTML links back to [[doc-name]] syntax
 * Use this before saving data back to YAML files
 * @param text - The text with HTML links
 * @returns The text with HTML links converted back to [[doc-name]]
 */
export function unprocessDocLinks(text: string): string {
  if (!text) return text;

  // Replace <a href="/:productName/misc?file=doc-name.md" ...>doc-name</a> back to [[doc-name]]
  // Handle both new format (/:productName/misc?file=) and old format (/misc?file=)
  let result = text.replace(/<a\s+href="\/[^/]+\/misc\?file=([^"]+)\.md"[^>]*>([^<]+)<\/a>/g, (_, _filename, docName) => {
    return `[[${docName}]]`;
  });

  // Also handle old format for backwards compatibility
  result = result.replace(/<a\s+href="\/misc\?file=([^"]+)\.md"[^>]*>([^<]+)<\/a>/g, (_, _filename, docName) => {
    return `[[${docName}]]`;
  });

  return result;
}

/**
 * Recursively unprocess all string values in an object to revert doc links
 * Use this before saving data back to YAML files
 */
export function unprocessObjectDocLinks(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return unprocessDocLinks(obj);
  if (Array.isArray(obj)) return obj.map(unprocessObjectDocLinks);
  if (typeof obj === 'object') {
    const processed: any = {};
    for (const key in obj) {
      processed[key] = unprocessObjectDocLinks(obj[key]);
    }
    return processed;
  }
  return obj;
}