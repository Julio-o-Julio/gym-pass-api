import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to create a gym', async () => {
    const { access_token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        title: 'Test Name Gym',
        description: 'Description test.',
        phone: '11932132132',
        latitude: -20.4679858,
        longitude: -54.6125893,
      });

    expect(response.statusCode).toEqual(201);
  });
});
