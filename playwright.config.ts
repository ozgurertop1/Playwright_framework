import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { envConfig } from './config/environments';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['step-definitions/**/*.ts', 'fixtures/index.ts'],
});

export default defineConfig({
  testDir,
  timeout: envConfig.timeout,
  retries: envConfig.retries,
  workers: process.env['CI'] ? '100%' : '50%',

  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['allure-playwright', { outputFolder: 'reports/allure-results' }],
    ['list'],
  ],

  use: {
    baseURL: envConfig.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
