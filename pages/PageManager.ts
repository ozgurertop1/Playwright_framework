import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginPage } from './LoginPage';

export class PageManager {
  private readonly _page: Page;
  private readonly _pages: Map<string, BasePage> = new Map();

  constructor(page: Page) {
    this._page = page;
  }

  private getPage<T extends BasePage>(
    key: string,
    PageClass: new (page: Page) => T
  ): T {
    if (!this._pages.has(key)) {
      this._pages.set(key, new PageClass(this._page));
    }
    return this._pages.get(key) as T;
  }

  get loginPage(): LoginPage {
    return this.getPage('login', LoginPage);
  }

  get currentPage(): Page {
    return this._page;
  }
}
