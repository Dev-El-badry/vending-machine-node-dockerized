import { app } from '../../../../app';
import request from 'supertest';

// check if has a route handle listening to /api/v1/users/deposit for post requests
it('if has a route handle listening to /api/v1/users/deposit for post request', async () => {
  const response = await request(app).post('/api/v1/users/deposit').send({});
  expect(response.status).not.toEqual(404);
});

// check if has a route handle listening to /api/v1/users for post requests
it('can only be accessed it the user is signed in', async () => {
  return request(app).post('/api/v1/users/deposit').send({}).expect(401);
});

// return a status other than 401 if the user is signed in
it('return a status other than 401 if the user is signed in', async () => {
  const cookie = await global.signup();

  const response = await request(app)
    .post('/api/v1/users/deposit')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it('return 422 if deposit not includes in banknote 5,10,20,30,50', async () => {
  const cookie = await global.signup();

  await request(app)
    .post('/api/v1/users/deposit')
    .set('Cookie', cookie)
    .send({ amount: 2 })
    .expect(422);
});

it('return 201 when insert valid inputs', async () => {
  const cookie = await global.signup();

  await request(app)
    .post('/api/v1/users/deposit')
    .set('Cookie', cookie)
    .send({ amount: 5 })
    .expect(201);
});

it('check increment of deposits', async () => {
  const cookie = await global.signup();

  await request(app)
    .post('/api/v1/users/deposit')
    .set('Cookie', cookie)
    .send({ amount: 5 })
    .expect(201);

  await request(app)
    .post('/api/v1/users/deposit')
    .set('Cookie', cookie)
    .send({ amount: 10 })
    .expect(201);

  const response = await request(app)
    .get('/api/v1/users/me')
    .set('Cookie', cookie)
    .expect(201);

  expect(response.body.data.deposit).toEqual(15);
});

it('reset deposit', async () => {
  const cookie = await global.signup();

  await request(app)
    .post('/api/v1/users/deposit')
    .set('Cookie', cookie)
    .send({ amount: 5 })
    .expect(201);

  await request(app)
    .post('/api/v1/users/deposit')
    .set('Cookie', cookie)
    .send({ amount: 10 })
    .expect(201);

  await request(app)
    .get('/api/v1/users/reset')
    .set('Cookie', cookie)
    .expect(201);

  const response = await request(app)
    .get('/api/v1/users/me')
    .set('Cookie', cookie)
    .expect(201);

  expect(response.body.data.deposit).toEqual(0);
});
