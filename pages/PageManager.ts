import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartPage } from './CartPage';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';
import { ProductsPage } from './ProductsPage';

/** Creates page objects lazily and reuses them within a single test. */
export class PageManager {
  private readonly _page: Page;
  private readonly _pages: Map<string, BasePage> = new Map();

  constructor(page: Page) {
    this._page = page;
  }

  private getPage<T extends BasePage>(key: string, PageClass: new (page: Page) => T): T {
    if (!this._pages.has(key)) {
      this._pages.set(key, new PageClass(this._page));
    }
    return this._pages.get(key) as T;
  }

  get homePage(): HomePage {
    return this.getPage('home', HomePage);
  }

  get loginPage(): LoginPage {
    return this.getPage('login', LoginPage);
  }

  get productsPage(): ProductsPage {
    return this.getPage('products', ProductsPage);
  }

  get cartPage(): CartPage {
    return this.getPage('cart', CartPage);
  }

  get currentPage(): Page {
    return this._page;
  }
}
