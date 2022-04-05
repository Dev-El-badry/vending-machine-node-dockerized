import request from 'supertest';
import { app } from '../../../../app';

it('clear all cookie after logout', async () => {
  await request(app)
    .post('/api/v1/users/auth/signup')
    .send({
      username: 'test',
      password: 'password',
      confirmPassword: 'password',
    })
    .expect(201);

  const response = await request(app)
    .get('/api/v1/users/auth/logout')
    .send()
    .expect(201);

  expect(response.get('Set-Cookie')[0]).toEqual(`jwt=logout; Path=/; HttpOnly`);
});
