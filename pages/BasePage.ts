import { Page, Locator, expect } from '@playwright/test';
import { TRANSIENT_STATUSES, withRetry } from '../utils/retry';
import { Header } from './components/Header';

export abstract class BasePage {
  protected readonly page: Page;
  readonly header: Header;

  /** Path relative to baseURL, e.g. '/login'. */
  abstract readonly path: string;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
  }

  async navigate(): Promise<void> {
    await this.goto(this.path);
  }

  /** Navigates and transparently retries when the server is temporarily unavailable. */
  async goto(path: string = ''): Promise<void> {
    await withRetry(
      () => this.page.goto(path),
      (response) => !!response && TRANSIENT_STATUSES.has(response.status())
    );
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
  }

  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  async type(locator: Locator, value: string, delayMs = 50): Promise<void> {
    await locator.pressSequentially(value, { delay: delayMs });
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  async hover(locator: Locator): Promise<void> {
    await locator.hover();
  }

  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async assertVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  async assertHidden(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeHidden();
  }

  async assertText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  async assertContainsText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  async assertUrl(urlOrPattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(urlOrPattern);
  }

  async assertTitle(titleOrPattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(titleOrPattern);
  }

  async getElementText(locator: Locator): Promise<string> {
    return ((await locator.textContent()) ?? '').trim();
  }

  async getInputValue(locator: Locator): Promise<string> {
    return locator.inputValue();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}
