import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly path = '/view_cart';

  get rows(): Locator {
    return this.page.locator('#cart_info_table tbody tr');
  }

  get emptyCartMessage(): Locator {
    return this.page.getByText('Cart is empty!');
  }

  row(productName: string): Locator {
    return this.rows.filter({
      has: this.page.getByRole('link', { name: productName, exact: true }),
    });
  }

  async removeProduct(productName: string): Promise<void> {
    await this.row(productName).locator('.cart_quantity_delete').click();
    await expect(this.row(productName)).toHaveCount(0);
  }

  async assertProductCount(count: number): Promise<void> {
    await this.assertUrl(/\/view_cart/);
    await expect(this.rows).toHaveCount(count);
  }

  async assertContainsProduct(productName: string): Promise<void> {
    await expect(this.row(productName), `Cart should contain "${productName}"`).toHaveCount(1);
  }

  async assertEmpty(): Promise<void> {
    await expect(this.rows).toHaveCount(0);
    await this.assertVisible(this.emptyCartMessage);
  }
}
