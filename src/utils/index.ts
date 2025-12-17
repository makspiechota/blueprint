export const logger = {
  success: (message: string) => console.log(`✓ ${message}`),
  error: (message: string) => console.error(`✗ ${message}`),
  info: (message: string) => console.log(`ℹ ${message}`)
};
