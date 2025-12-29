/**
 * Processes text to convert [[doc-name]] syntax into HTML links to misc documents
 * @param text - The text to process
 * @returns The text with [[doc-name]] replaced by <a href="/misc?file=doc-name.md">doc-name</a>
 */
export function processDocLinks(text: string): string {
  if (!text) return text;

  // Replace [[doc-name]] with <a href="/misc?file=doc-name.md">doc-name</a>
  return text.replace(/\[\[([^\]]+)\]\]/g, (_, docName) => {
    return `<a href="/misc?file=${docName}.md" class="text-blue-600 hover:text-blue-800 underline">${docName}</a>`;
  });
}