import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly path = '/login';

  get loginForm(): Locator {
    return this.page.locator('.login-form');
  }

  get emailInput(): Locator {
    return this.page.locator('[data-qa="login-email"]');
  }

  get passwordInput(): Locator {
    return this.page.locator('[data-qa="login-password"]');
  }

  get submitButton(): Locator {
    return this.page.locator('[data-qa="login-button"]');
  }

  get errorMessage(): Locator {
    return this.loginForm.locator('form p');
  }

  async loginWith(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.submitButton);
  }

  async assertOnLoginPage(): Promise<void> {
    await this.assertUrl(/\/login/);
    await this.assertVisible(this.loginForm);
  }

  async assertLoggedInAs(name: string): Promise<void> {
    await this.assertVisible(this.header.loggedInAs);
    await this.assertContainsText(this.header.loggedInAs, name);
  }

  async assertLoginFailed(expectedError: string): Promise<void> {
    await this.assertVisible(this.errorMessage);
    await this.assertText(this.errorMessage, expectedError);
    await this.assertHidden(this.header.loggedInAs, 'User must not be logged in');
  }
}
