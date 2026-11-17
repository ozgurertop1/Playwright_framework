import { test as base, APIRequestContext } from '@playwright/test';
import { envConfig } from '../config/environments';
import { ProductApi } from '../api/ProductApi';
import { UserApi } from '../api/UserApi';

export type ApiFixtures = {
  userApi: UserApi;
  productApi: ProductApi;
};

type Use<T> = (value: T) => Promise<void>;

/** Shared by the pure API tests and the BDD (UI) tests. */
export const apiFixtureDefinitions = {
  userApi: async ({ request }: { request: APIRequestContext }, use: Use<UserApi>) => {
    await use(new UserApi(request, envConfig.apiBaseUrl));
  },
  productApi: async ({ request }: { request: APIRequestContext }, use: Use<ProductApi>) => {
    await use(new ProductApi(request, envConfig.apiBaseUrl));
  },
};

export const test = base.extend<ApiFixtures>(apiFixtureDefinitions);
export { expect } from '@playwright/test';
