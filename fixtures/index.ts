import { test as base } from 'playwright-bdd';
import { PageManager } from '@pages/PageManager';

export type TestFixtures = {
  pageManager: PageManager;
};

export const test = base.extend<TestFixtures>({
  pageManager: async ({ page }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },
});

export { expect } from '@playwright/test';
