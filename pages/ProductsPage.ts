import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly path = '/products';

  get searchInput(): Locator {
    return this.page.locator('#search_product');
  }

  get searchButton(): Locator {
    return this.page.locator('#submit_search');
  }

  get sectionTitle(): Locator {
    return this.page.locator('.features_items h2.title');
  }

  get productCards(): Locator {
    return this.page.locator('.features_items .productinfo');
  }

  get productNames(): Locator {
    return this.productCards.locator('p');
  }

  get cartModal(): Locator {
    return this.page.locator('#cartModal');
  }

  productCard(name: string): Locator {
    return this.productCards.filter({ has: this.page.getByText(name, { exact: true }) }).first();
  }

  async search(term: string): Promise<void> {
    await this.fill(this.searchInput, term);
    await this.click(this.searchButton);
    await expect(this.sectionTitle).toHaveText(/Searched Products/i);
  }

  async getProductNames(): Promise<string[]> {
    return (await this.productNames.allTextContents()).map((name) => name.trim());
  }

  async addToCart(productName: string): Promise<void> {
    await this.productCard(productName).locator('.add-to-cart').click();
    await expect(this.cartModal, `"${productName}" should be added to the cart`).toBeVisible();
  }

  async continueShopping(): Promise<void> {
    await this.cartModal.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(this.cartModal).toBeHidden();
  }

  async openCartFromModal(): Promise<void> {
    await this.cartModal.getByRole('link', { name: 'View Cart' }).click();
  }
}
