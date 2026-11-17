import { test, expect } from '../../fixtures/apiFixtures';

test.describe('Products API', { tag: '@api' }, () => {
  test('GET /productsList returns the full catalogue with a valid shape', async ({ productApi }) => {
    const { httpStatus, body } = await productApi.getAllProducts();

    expect(httpStatus).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);

    for (const product of body.products) {
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.stringMatching(/^Rs\. \d+$/),
          brand: expect.any(String),
        })
      );
    }
  });

  test('product ids are unique', async ({ productApi }) => {
    const { body } = await productApi.getAllProducts();
    const ids = body.products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('POST /productsList is rejected as an unsupported method', async ({ productApi }) => {
    const { body } = await productApi.postToProductsList();

    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  });

  for (const term of ['top', 'jeans', 'tshirt']) {
    test(`POST /searchProduct "${term}" only returns matching products`, async ({ productApi }) => {
      const { body } = await productApi.searchProducts(term);

      expect(body.responseCode).toBe(200);
      expect(body.products.length).toBeGreaterThan(0);

      for (const product of body.products) {
        const searchable = `${product.name} ${product.category.category}`.toLowerCase();
        expect(searchable, `"${product.name}" should match "${term}"`).toContain(term);
      }
    });
  }

  test('POST /searchProduct without the search term returns 400', async ({ productApi }) => {
    const { body } = await productApi.searchProductsWithoutTerm();

    expect(body.responseCode).toBe(400);
    expect(body.message).toBe('Bad request, search_product parameter is missing in POST request.');
  });

  test('GET /brandsList returns brands used by the catalogue', async ({ productApi }) => {
    const [{ body: brands }, { body: catalogue }] = await Promise.all([
      productApi.getAllBrands(),
      productApi.getAllProducts(),
    ]);

    expect(brands.responseCode).toBe(200);
    const brandNames = new Set(brands.brands.map((b) => b.brand));
    for (const product of catalogue.products) {
      expect(brandNames, `Brand "${product.brand}" should be listed`).toContain(product.brand);
    }
  });
});
