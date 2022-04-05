import request from 'supertest';
import { app } from '../../../../app';

it('responds with details with current user', async () => {
  const { cookie, token } = global.signin();

  const response = await request(app)
    .get('/api/v1/users/me')
    .send()
    .set('Cookie', await global.signup())
    .expect(201);

  expect(response.body.data.username).toEqual('test');
});

it('responds with null if not authenticate', async () => {
  const { body: response } = await request(app)
    .get('/api/v1/users/me')
    .send()
    .expect(401);
});
