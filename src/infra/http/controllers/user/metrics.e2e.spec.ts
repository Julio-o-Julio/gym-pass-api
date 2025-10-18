import { app } from '@/app';
import { prisma } from '@/infra/database/prisma/prisma';
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('User Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to get the total count of check ins', async () => {
    const { access_token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: 'Test Gym 02',
        latitude: -20.4679858,
        longitude: -54.6125893,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          user_id: user.id,
          gym_id: gym.id,
        },
        {
          user_id: user.id,
          gym_id: gym.id,
        },
      ],
    });

    const metricsResponse = await request(app.server)
      .get('/metrics')
      .set('Authorization', `Bearer ${access_token}`)
      .send();

    expect(metricsResponse.statusCode).toEqual(200);
    expect(metricsResponse.body.checkInsCount).toEqual(2);
  });
});
