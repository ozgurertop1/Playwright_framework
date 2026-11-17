import { Page, Locator } from '@playwright/test';
import { TRANSIENT_STATUSES, withRetry } from '../../utils/retry';

/** Site-wide navigation bar, shared by every page object. */
export class Header {
  constructor(private readonly page: Page) {}

  get nav(): Locator {
    return this.page.locator('.shop-menu');
  }

  get loggedInAs(): Locator {
    return this.nav.getByText('Logged in as');
  }

  get loginLink(): Locator {
    return this.nav.getByRole('link', { name: /Signup \/ Login/ });
  }

  get logoutLink(): Locator {
    return this.nav.getByRole('link', { name: 'Logout' });
  }

  get cartLink(): Locator {
    return this.nav.getByRole('link', { name: 'Cart' });
  }

  async logout(): Promise<void> {
    const logoutResponse = this.page.waitForResponse((res) => res.url().endsWith('/logout'));
    await this.logoutLink.click();

    // If the server hiccups on the click, repeat the request directly.
    if (TRANSIENT_STATUSES.has((await logoutResponse).status())) {
      await withRetry(
        () => this.page.goto('/logout'),
        (res) => !!res && TRANSIENT_STATUSES.has(res.status())
      );
    }
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
