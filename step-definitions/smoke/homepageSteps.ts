import { expect } from '@playwright/test';
import { Given, Then } from '../bdd';

Given('the user opens the homepage', async ({ pageManager }) => {
  await pageManager.homePage.navigate();
});

Then('the page title is {string}', async ({ page }, title: string) => {
  await expect(page).toHaveTitle(title);
});

Then('the main navigation, slider and featured products are visible', async ({ pageManager }) => {
  await pageManager.homePage.assertLoaded();
});
