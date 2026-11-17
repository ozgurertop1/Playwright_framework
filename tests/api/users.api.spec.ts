import { test, expect } from '../../fixtures/apiFixtures';
import { buildUser } from '../../utils/dataFactory';

test.describe('User account API', { tag: '@api' }, () => {
  test('full account lifecycle: create → verify → read → delete', async ({ userApi }) => {
    const user = buildUser();

    await test.step('create account', async () => {
      const { body } = await userApi.createAccount(user);
      expect(body.responseCode).toBe(201);
      expect(body.message).toBe('User created!');
    });

    await test.step('verify login with valid credentials', async () => {
      const { body } = await userApi.verifyLogin(user.email, user.password);
      expect(body.responseCode).toBe(200);
      expect(body.message).toBe('User exists!');
    });

    await test.step('read account details by email', async () => {
      const { body } = await userApi.getUserByEmail(user.email);
      expect(body.responseCode).toBe(200);
      expect(body.user).toEqual(
        expect.objectContaining({
          name: user.name,
          email: user.email,
          first_name: user.firstname,
          last_name: user.lastname,
          city: user.city,
        })
      );
    });

    await test.step('delete account', async () => {
      const { body } = await userApi.deleteAccount(user.email, user.password);
      expect(body.responseCode).toBe(200);
      expect(body.message).toBe('Account deleted!');
    });

    await test.step('deleted account can no longer log in', async () => {
      const { body } = await userApi.verifyLogin(user.email, user.password);
      expect(body.responseCode).toBe(404);
      expect(body.message).toBe('User not found!');
    });
  });

  test('creating an account with an existing email is rejected', async ({ userApi }) => {
    const user = buildUser();
    await userApi.createAccount(user);

    try {
      const { body } = await userApi.createAccount({ ...user, name: 'Duplicate' });
      expect(body.responseCode).toBe(400);
      expect(body.message).toBe('Email already exists!');
    } finally {
      await userApi.deleteAccount(user.email, user.password);
    }
  });

  test('verifyLogin with an unknown account returns 404', async ({ userApi }) => {
    const { body } = await userApi.verifyLogin('nobody.here@example.com', 'whatever');
    expect(body.responseCode).toBe(404);
    expect(body.message).toBe('User not found!');
  });

  test('verifyLogin without parameters returns 400', async ({ userApi }) => {
    const { body } = await userApi.verifyLoginWithoutCredentials();
    expect(body.responseCode).toBe(400);
    expect(body.message).toBe(
      'Bad request, email or password parameter is missing in POST request.'
    );
  });
});
