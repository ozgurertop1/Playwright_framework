import { UserAccount } from '../api/types';

function randomId(length = 6): string {
  return Math.random().toString(36).slice(2, 2 + length);
}

/** Unique per call, so parallel workers never collide on the same account. */
export function uniqueEmail(prefix = 'qa'): string {
  return `${prefix}.${Date.now()}.${randomId()}@example.com`;
}

export function buildUser(overrides: Partial<UserAccount> = {}): UserAccount {
  const id = randomId(5);
  return {
    name: `QA User ${id}`,
    email: uniqueEmail(),
    password: `Pw-${id}-${Date.now()}`,
    title: 'Mr',
    birth_date: '15',
    birth_month: 'June',
    birth_year: '1995',
    firstname: 'QA',
    lastname: `Tester ${id}`,
    company: 'QA Labs',
    address1: '1 Test Street',
    address2: 'Suite 2',
    country: 'Canada',
    zipcode: 'A1B2C3',
    state: 'Ontario',
    city: 'Toronto',
    mobile_number: '5551234567',
    ...overrides,
  };
}
