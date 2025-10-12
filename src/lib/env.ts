/**
 * Environment Configuration
 * Validates and exports environment variables with type safety
 */

interface EnvironmentConfig {
  apiUrl: string;
  enableApiLogging: boolean;
  tokenRefreshThreshold: number;
  isDevelopment: boolean;
  isProduction: boolean;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value || defaultValue || '';
}

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

function parseNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Validate and export environment configuration
export const env: EnvironmentConfig = {
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3000/api'),
  enableApiLogging: parseBoolean(import.meta.env.VITE_ENABLE_API_LOGGING, import.meta.env.DEV),
  tokenRefreshThreshold: parseNumber(import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD, 60000), // 1 minute
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Log configuration in development
if (env.isDevelopment && env.enableApiLogging) {
  console.log('🔧 Environment Configuration:', {
    apiUrl: env.apiUrl,
    enableApiLogging: env.enableApiLogging,
    tokenRefreshThreshold: `${env.tokenRefreshThreshold}ms`,
  });
}

