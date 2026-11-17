import { expect } from '@playwright/test';
import { test as base } from 'playwright-bdd';
import { PageManager } from '../pages/PageManager';
import { UserAccount } from '../api/types';
import { buildUser } from '../utils/dataFactory';
import { ApiFixtures, apiFixtureDefinitions } from './apiFixtures';

/** Ad / tracking hosts that slow the demo site down and inject pop-ups. */
const THIRD_PARTY_PATTERN =
  /googlesyndication|doubleclick|googleadservices|adservice\.google|google-analytics|googletagmanager|fundingchoicesmessages/;

/** Text shown by the demo site / Cloudflare when the backend is overloaded. */
const INFRA_ERROR_PATTERN =
  /under heavy load|queue full|Error code 5\d\d|Bad gateway|Service Unavailable/i;

export type TestFixtures = ApiFixtures & {
  blockThirdParty: void;
  detectInfraFailure: void;
  pageManager: PageManager;
  /**
   * A brand-new account created through the API before the test and deleted
   * through the API afterwards. UI tests never spend time on registration.
   */
  testUser: UserAccount;
};

export const test = base.extend<TestFixtures>({
  ...apiFixtureDefinitions,

  blockThirdParty: [
    async ({ page }, use) => {
      await page.route(THIRD_PARTY_PATTERN, (route) => route.abort());
      await use();
    },
    { auto: true },
  ],

  /**
   * When a UI test fails, checks whether the page shows a server overload /
   * gateway error and tags the result, so infra noise is easy to tell apart
   * from real product defects in the report.
   */
  detectInfraFailure: [
    async ({ page }, use, testInfo) => {
      await use();
      if (testInfo.status === testInfo.expectedStatus) return;

      const bodyText = await page
        .locator('body')
        .innerText({ timeout: 1_000 })
        .catch(() => '');
      if (INFRA_ERROR_PATTERN.test(bodyText)) {
        testInfo.annotations.push({
          type: 'infrastructure',
          description: 'Target site returned a server/gateway error — likely not a product defect',
        });
      }
    },
    { auto: true },
  ],

  pageManager: async ({ page }, use) => {
    await use(new PageManager(page));
  },

  testUser: async ({ userApi }, use) => {
    const user = buildUser();
    const created = await userApi.createAccount(user);
    expect(
      created.body.responseCode,
      `Precondition failed — could not create user via API: ${created.body.message}`
    ).toBe(201);

    await use(user);

    await userApi.deleteAccount(user.email, user.password);
  },
});

export { expect };
