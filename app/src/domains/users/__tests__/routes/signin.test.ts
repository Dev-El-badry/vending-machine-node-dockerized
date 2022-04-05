import request from 'supertest';
import { app } from '../../../../app';

it('fails when a username that does not exists is supplied', async () => {
  return request(app)
    .post('/api/v1/users/auth/signin')
    .send({
      username: 'testtest',
      password: 'password',
    })
    .expect(422);
});

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/v1/users/auth/signup')
    .send({
      username: 'testtest',
      password: 'password',
      confirmPassword: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/v1/users/auth/signin')
    .send({
      username: 'testtest',
      password: 'password123',
    })
    .expect(422);
});

it('responds with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/v1/users/auth/signup')
    .send({
      username: 'testtest',
      password: 'password',
      confirmPassword: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/v1/users/auth/signin')
    .send({
      username: 'testtest',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
