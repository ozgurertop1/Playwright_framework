import { Page, Locator, Response } from '@playwright/test';

export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  method: string = 'GET'
): Promise<Response> {
  return page.waitForResponse(
    (response) =>
      (typeof urlPattern === 'string'
        ? response.url().includes(urlPattern)
        : urlPattern.test(response.url())) &&
      response.request().method() === method
  );
}

export async function waitForLoadingToDisappear(
  loadingLocator: Locator,
  timeout = 30_000
): Promise<void> {
  await loadingLocator.waitFor({ state: 'hidden', timeout });
}

export async function waitForTextToAppear(
  locator: Locator,
  text: string,
  timeout = 15_000
): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
  const { expect } = await import('@playwright/test');
  await expect(locator).toContainText(text, { timeout });
}

export async function waitForAnimations(page: Page): Promise<void> {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.playState === 'running')
        .map((a) => a.finished)
    )
  );
}

export async function waitForCondition(
  page: Page,
  condition: () => unknown,
  timeout = 15_000
): Promise<void> {
  await page.waitForFunction(condition, undefined, { timeout });
}
