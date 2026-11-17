export type Environment = 'local' | 'staging' | 'production' | 'custom';

export interface EnvironmentConfig {
  baseUrl: string;
  apiBaseUrl: string;
  timeout: number;
  retries: number;
}

const DEMO_URL = 'https://automationexercise.com';

/** BASE_URL / API_BASE_URL env vars always win over the defaults below. */
function urls(defaultBaseUrl: string): Pick<EnvironmentConfig, 'baseUrl' | 'apiBaseUrl'> {
  const baseUrl = process.env['BASE_URL'] || defaultBaseUrl;
  return {
    baseUrl,
    apiBaseUrl: process.env['API_BASE_URL'] || `${baseUrl}/api`,
  };
}

const configs: Record<Environment, EnvironmentConfig> = {
  local: {
    ...urls(DEMO_URL),
    timeout: 30_000,
    // The public demo site occasionally answers 5xx under load.
    // A retried-then-passed test is still reported as "flaky", never hidden.
    retries: 1,
  },
  staging: {
    ...urls('https://staging.example.com'),
    timeout: 45_000,
    retries: 1,
  },
  production: {
    ...urls(DEMO_URL),
    timeout: 60_000,
    retries: 2,
  },
  custom: {
    ...urls(''),
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
