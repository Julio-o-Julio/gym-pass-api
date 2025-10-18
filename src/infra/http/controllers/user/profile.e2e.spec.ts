import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to get user profile', async () => {
    const { access_token } = await createAndAuthenticateUser(app);

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${access_token}`)
      .send();

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'teste2e@exemple.com',
      }),
    );
  });
});
