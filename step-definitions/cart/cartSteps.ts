import { When, Then } from '../bdd';

When('the user removes {string} from the cart', async ({ pageManager }, product: string) => {
  await pageManager.cartPage.removeProduct(product);
});

Then('the cart contains {int} product(s)', async ({ pageManager }, count: number) => {
  await pageManager.cartPage.assertProductCount(count);
});

Then('the cart contains {string}', async ({ pageManager }, product: string) => {
  await pageManager.cartPage.assertContainsProduct(product);
});

Then('the cart is empty', async ({ pageManager }) => {
  await pageManager.cartPage.assertEmpty();
});
