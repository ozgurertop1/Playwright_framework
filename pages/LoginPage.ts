import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly path = '/practice-test-login/';

  constructor(page: Page) {
    super(page);
  }

  get usernameInput(): Locator {
    return this.page.locator('#username');
  }

  get passwordInput(): Locator {
    return this.page.locator('#password');
  }

  get submitButton(): Locator {
    return this.page.locator('#submit');
  }

  get errorMessage(): Locator {
    return this.page.locator('#error');
  }

  get successMessage(): Locator {
    return this.page.locator('.post-title');
  }

  async navigate(): Promise<void> {
    await this.goto(this.path);
  }

  async fillUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async clickSubmit(): Promise<void> {
    await this.click(this.submitButton);
  }

  async loginWith(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  async assertLoginSuccessful(): Promise<void> {
    await this.assertVisible(this.successMessage);
    await this.assertContainsText(this.successMessage, 'Logged In Successfully');
  }

  async assertLoginFailed(expectedError: string): Promise<void> {
    await this.assertVisible(this.errorMessage);
    await this.assertContainsText(this.errorMessage, expectedError);
  }

  async assertOnLoginPage(): Promise<void> {
    await this.assertUrl(/practice-test-login/);
    await this.assertVisible(this.usernameInput);
  }
}
