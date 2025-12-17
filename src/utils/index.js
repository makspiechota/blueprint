/**
 * Shared Utilities
 *
 * Common utility functions used across the application
 */

/**
 * Logger utility for consistent output
 */
const logger = {
  success: (message) => console.log(`✓ ${message}`),
  error: (message) => console.error(`✗ ${message}`),
  info: (message) => console.log(`ℹ ${message}`)
};

module.exports = {
  logger
};
