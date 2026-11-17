import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { currentEnv, envConfig } from './config/environments';

const isCI = !!process.env['CI'];

/** Gherkin features are compiled into Playwright specs in .features-gen/. */
const bddTestDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['step-definitions/**/*.ts', 'fixtures/index.ts'],
});

export default defineConfig({
  timeout: envConfig.timeout,
  retries: isCI ? 2 : envConfig.retries,
  // The demo site is a free shared service that rate-limits under load,
  // so parallelism is kept deliberately modest.
  workers: isCI ? 2 : 3,
  fullyParallel: true,
  forbidOnly: isCI,

  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'reports/allure-results',
        environmentInfo: {
          Environment: currentEnv,
          'Base URL': envConfig.baseUrl,
          'Node.js': process.version,
        },
      },
    ],
    [isCI ? 'github' : 'list'],
  ],

  use: {
    baseURL: envConfig.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
    },
    {
      name: 'chromium',
      testDir: bddTestDir,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testDir: bddTestDir,
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
