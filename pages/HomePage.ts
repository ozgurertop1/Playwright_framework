import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly path = '/';

  get slider(): Locator {
    return this.page.locator('#slider');
  }

  get featuredItems(): Locator {
    return this.page.locator('.features_items .productinfo');
  }

  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.header.nav, 'Main navigation should be visible');
    await this.assertVisible(this.slider, 'Hero slider should be visible');
    await this.assertVisible(this.featuredItems.first(), 'Featured products should be listed');
  }
}
