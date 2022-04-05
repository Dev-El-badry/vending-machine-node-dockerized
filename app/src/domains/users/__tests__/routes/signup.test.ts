import request from 'supertest';
import { app } from '../../../../app';

it('returns a 201 on successfully sign up', async () => {
  return request(app)
    .post('/api/v1/users/auth/signup')
    .send({
      username: 'testtest',
      password: 'password',
      confirmPassword: 'password',
    })
    .expect(201);
});

it('returns a 422 with a invalid username', async () => {
  return request(app)
    .post('/api/v1/users/auth/signup')
    .send({
      username: 'te',
      password: 'password',
      confirmPassword: 'password',
    })
    .expect(422);
});

it('returns a 422 with a invalid password', async () => {
  return request(app)
    .post('/api/v1/users/auth/signup')
    .send({
      username: 'test',
      password: 'pass',
      confirmPassword: 'pass',
    })
    .expect(422);
});

it('returns a 422 with a missing username and password', async () => {
  await request(app)
    .post('/api/v1/users/auth/signup')
    .send({
      password: 'test',
    })
    .expect(422);

  await request(app)
    .post('/api/v1/users/auth/signup')
    .send({
      username: 'test',
    })
    .expect(422);
});

it('disallow duplicate username', async () => {
  await request(app)
    .post('/api/v1/users/auth/signup')
    .send({
      username: 'testtest',
      password: 'password',
      confirmPassword: 'password',
    })
    .expect(201);
  await request(app)
    .post('/api/v1/users/auth/signup')
    .send({
      username: 'testtest',
      password: 'password',
      confirmPassword: 'password',
    })
    .expect(422);
});

it('returns a 422 with a password not the same', async () => {
  return request(app)
    .post('/api/v1/users/auth/signup')
    .send({
      username: 'test',
      password: 'password',
      confirmPassword: 'pass123',
    })
    .expect(422);
});

it('sets a cookie after successfully signup', async () => {
  const response = await request(app)
    .post('/api/v1/users/auth/signup')
    .send({
      username: 'test',
      password: 'password',
      confirmPassword: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
