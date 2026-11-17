import { expect } from '@playwright/test';
import { Given, When, Then } from '../bdd';
import credentials from '../../test-data/credentials.json';

type CredentialSet = keyof typeof credentials.invalidCredentials;

Given('the user is on the login page', async ({ pageManager }) => {
  await pageManager.loginPage.navigate();
  await pageManager.loginPage.assertOnLoginPage();
});

/** Requesting the `testUser` fixture creates the account via the API. */
Given('a new user account is created via the API', async ({ testUser, userApi }) => {
  const check = await userApi.verifyLogin(testUser.email, testUser.password);
  expect(check.body.message).toBe('User exists!');
});

/** Fast precondition: account via API, then a single UI login. */
Given('a logged-in user whose account was created via the API', async ({ pageManager, testUser }) => {
  const { loginPage } = pageManager;
  await loginPage.navigate();
  await loginPage.loginWith(testUser.email, testUser.password);
  await loginPage.assertLoggedInAs(testUser.name);
});

When('the user logs in with valid credentials', async ({ pageManager, testUser }) => {
  await pageManager.loginPage.loginWith(testUser.email, testUser.password);
});

When('the user logs in with the correct email but a wrong password', async ({ pageManager, testUser }) => {
  await pageManager.loginPage.loginWith(testUser.email, `${testUser.password}-wrong`);
});

When('the user logs in with {string} credentials', async ({ pageManager }, setName: string) => {
  const set = credentials.invalidCredentials[setName as CredentialSet];
  if (!set) {
    throw new Error(`No credential set named "${setName}" in test-data/credentials.json`);
  }
  await pageManager.loginPage.loginWith(set.email, set.password);
});

When('the user logs out', async ({ pageManager }) => {
  await pageManager.loginPage.header.logout();
});

Then('the user is logged in with their name shown in the header', async ({ pageManager, testUser }) => {
  await pageManager.loginPage.assertLoggedInAs(testUser.name);
});

Then('the login error {string} is shown', async ({ pageManager }, expectedError: string) => {
  await pageManager.loginPage.assertLoginFailed(expectedError);
});

Then('the user is back on the login page and no longer logged in', async ({ pageManager }) => {
  const { loginPage } = pageManager;
  await loginPage.assertOnLoginPage();
  await expect(loginPage.header.loggedInAs).toBeHidden();
  await expect(loginPage.header.loginLink).toBeVisible();
});
