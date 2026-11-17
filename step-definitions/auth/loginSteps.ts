import { Given, When, Then } from '../bdd';

Given('kullanıcı login sayfasındadır', async ({ pageManager }) => {
  await pageManager.loginPage.navigate();
  await pageManager.loginPage.assertOnLoginPage();
});

When(
  'kullanıcı {string} kullanıcı adı ve {string} şifresiyle giriş yapar',
  async ({ pageManager }, username: string, password: string) => {
    await pageManager.loginPage.loginWith(username, password);
  }
);

Then('başarılı giriş mesajı görünür', async ({ pageManager }) => {
  await pageManager.loginPage.assertLoginSuccessful();
});

Then(
  'hata mesajı {string} içerir',
  async ({ pageManager }, expectedError: string) => {
    await pageManager.loginPage.assertLoginFailed(expectedError);
  }
);
