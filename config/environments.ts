export type Environment = 'local' | 'staging' | 'production' | 'custom';

export interface EnvironmentConfig {
  baseUrl: string;
  apiBaseUrl?: string;
  timeout: number;
  retries: number;
}

const configs: Record<Environment, EnvironmentConfig> = {
  local: {
    baseUrl: process.env['BASE_URL'] || 'https://practicetestautomation.com',
    apiBaseUrl: process.env['API_BASE_URL'],
    timeout: 30_000,
    retries: 0,
  },
  staging: {
    baseUrl: process.env['BASE_URL'] || 'https://staging.example.com',
    apiBaseUrl: process.env['API_BASE_URL'],
    timeout: 45_000,
    retries: 1,
  },
  production: {
    baseUrl: process.env['BASE_URL'] || 'https://example.com',
    apiBaseUrl: process.env['API_BASE_URL'],
    timeout: 60_000,
    retries: 2,
  },
  custom: {
    baseUrl: process.env['BASE_URL'] || '',
    apiBaseUrl: process.env['API_BASE_URL'],
    timeout: Number(process.env['TIMEOUT']) || 30_000,
    retries: Number(process.env['RETRIES']) || 0,
  },
};

function resolveEnvironment(): Environment {
  const env = (process.env['ENV'] || 'local') as Environment;
  if (!Object.keys(configs).includes(env)) {
    throw new Error(
      `Unknown environment: "${env}". Valid values: ${Object.keys(configs).join(', ')}`
    );
  }
  return env;
}

export const currentEnv: Environment = resolveEnvironment();
export const envConfig: EnvironmentConfig = configs[currentEnv];
