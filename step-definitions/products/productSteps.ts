import { expect } from '@playwright/test';
import { Given, When, Then } from '../bdd';

Given('the user is on the products page', async ({ pageManager }) => {
  await pageManager.productsPage.navigate();
  await expect(pageManager.productsPage.sectionTitle).toHaveText(/All Products/i);
});

When('the user searches for {string}', async ({ pageManager }, term: string) => {
  await pageManager.productsPage.search(term);
});

Then(
  'the search results in the UI match the product search API for {string}',
  async ({ pageManager, productApi }, term: string) => {
    const api = await productApi.searchProducts(term);
    expect(api.body.responseCode).toBe(200);
    const expected = api.body.products.map((p) => p.name).sort();

    const actual = (await pageManager.productsPage.getProductNames()).sort();

    expect(actual.length, `Search for "${term}" should return results`).toBeGreaterThan(0);
    expect(actual).toEqual(expected);
  }
);

When(
  'the user adds {string} to the cart and continues shopping',
  async ({ pageManager }, product: string) => {
    await pageManager.productsPage.addToCart(product);
    await pageManager.productsPage.continueShopping();
  }
);

When(
  'the user adds {string} to the cart and opens the cart',
  async ({ pageManager }, product: string) => {
    await pageManager.productsPage.addToCart(product);
    await pageManager.productsPage.openCartFromModal();
  }
);
