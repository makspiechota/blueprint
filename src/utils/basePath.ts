/**
 * Get the base path for the application.
 * In development: "/"
 * In production (GitHub Pages): "/blueprint/"
 */
export const BASE_PATH = import.meta.env.BASE_URL;

/**
 * Prepend the base path to an absolute path.
 * Handles both "/path" and "path" formats.
 */
export function withBasePath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // BASE_URL always ends with a slash
  return `${BASE_PATH}${cleanPath}`;
}
