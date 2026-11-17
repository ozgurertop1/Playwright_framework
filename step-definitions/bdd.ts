import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/index';

export const { Given, When, Then, Before, After } = createBdd(test);
