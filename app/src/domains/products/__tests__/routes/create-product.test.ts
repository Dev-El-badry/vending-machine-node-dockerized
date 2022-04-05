import request from 'supertest';
import { app } from '../../../../app';

const createLine = async (
  cookie: any
): Promise<{ title: string; id: string }> => {
  const response = await request(app)
    .post('/api/v1/lines')
    .set('Cookie', cookie)
    .send({ title: ` Line` });

  return response.body.data.data;
};

// check if has a route handle listening to /api/v1/products for post requests
it('if has a route handle listening to /api/v1/products for post request', async () => {
  const response = await request(app).post('/api/v1/products').send({});
  expect(response.status).not.toEqual(404);
});

// check if has a route handle listening to /api/v1/products for post requests
it('can only be accessed it the user is signed in', async () => {
  return request(app).post('/api/v1/products').send({}).expect(401);
});

// return a status other than 401 if the user is signed in
it('return a status other than 401 if the user is signed in', async () => {
  const cookie = await global.signup();

  const response = await request(app)
    .post('/api/v1/products')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

//return an error if an invalid title is provided
it('return an error if an invalid title is provided', async () => {
  const cookie = await global.signup('seller');
  const line = await createLine(cookie);

  const res = await request(app)
    .post('/api/v1/products')
    .set('Cookie', cookie)
    .send({
      title: '',
      cost: 10,
      qty: 10,
      line: line.id,
    })
    .expect(422);

  await request(app)
    .post('/api/v1/products')
    .set('Cookie', cookie)
    .send({
      cost: 10,
      qty: 10,
      line: line.id,
    })
    .expect(422);
});

//return an error if an invalid cost is provided
it('return an error if an invalid cost is provided', async () => {
  const cookie = await global.signup('seller');
  const line = await createLine(cookie);

  const res = await request(app)
    .post('/api/v1/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      cost: 0,
      qty: 10,
      line: line.id,
    })
    .expect(422);

  await request(app)
    .post('/api/v1/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      qty: 10,
      line: line.id,
    })
    .expect(422);
});

//return an error if an invalid qty is provided
it('return an error if an invalid qty is provided', async () => {
  const cookie = await global.signup('seller');
  const line = await createLine(cookie);

  await request(app)
    .post('/api/v1/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      cost: 10,
      qty: 0,
      line: line.id,
    })
    .expect(422);

  await request(app)
    .post('/api/v1/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      cost: 10,
      line: line.id,
    })
    .expect(422);
});

//return an error if an invalid line is provided
it('return an error if an invalid line is provided', async () => {
  const cookie = await global.signup('seller');

  await request(app)
    .post('/api/v1/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      cost: 10,
      qty: 2,
    })
    .expect(422);

  await request(app)
    .post('/api/v1/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      cost: 10,
      qty: 2,
      line: '123',
    })
    .expect(422);
});

//creates line with valid inputs
it('creates line with valid inputs', async () => {
  const cookie = await global.signup('seller');
  const line = await createLine(cookie);

  const response = await request(app)
    .post('/api/v1/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      cost: 10,
      qty: 2,
      line: line.id,
    })
    .expect(201);
});
