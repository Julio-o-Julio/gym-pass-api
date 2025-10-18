import { app } from '@/app';
import { prisma } from '@/infra/database/prisma/prisma';
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to search gyms by title', async () => {
    const { access_token } = await createAndAuthenticateUser(app);

    await prisma.gym.createMany({
      data: [
        {
          title: 'Test Name Gym 01',
          description: 'Description test.',
          phone: '11932132132',
          latitude: -20.4679858,
          longitude: -52.6125893,
        },
        {
          title: 'Test Name Gym 02',
          description: 'Description test.',
          phone: '11932132132',
          latitude: -20.4679858,
          longitude: -54.6125893,
        },
      ],
    });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: '02',
      })
      .set('Authorization', `Bearer ${access_token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Test Name Gym 02',
      }),
    ]);
  });
});
