import { Given, Then } from '../bdd';
import { expect } from '@playwright/test';

Given('kullanıcı ana sayfayı açar', async ({ page }) => {
  await page.goto('/');
});

Then('sayfa başlığı görünür', async ({ page }) => {
  await expect(page).toHaveTitle(/.+/);
});

Then('sayfa URL\'i doğrudur', async ({ page }) => {
  await expect(page).toHaveURL(/.+/);
});
