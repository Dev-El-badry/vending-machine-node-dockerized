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

// check if has a route handle listening to /api/v1/products/123 for put requests
it('if has a route handle listening to /api/v1/products/123 for put request', async () => {
  const response = await request(app).put('/api/v1/products/123').send({});
  expect(response.status).not.toEqual(404);
});

// check if has a route handle listening to /api/v1/products/123 for put requests
it('can only be accessed it the user is signed in', async () => {
  return request(app).put('/api/v1/products/123').send({}).expect(401);
});

// return a status other than 401 if the user is signed in
it('return a status other than 401 if the user is signed in', async () => {
  const cookie = await global.signup();

  const response = await request(app)
    .put('/api/v1/products/123')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

//return an error if an invalid title is provided
it('return an error if an invalid title is provided', async () => {
  const cookie = await global.signup('seller');
  const line = await createLine(cookie);

  const res = await request(app)
    .put('/api/v1/products/123')
    .set('Cookie', cookie)
    .send({
      title: '',
      cost: 10,
      qty: 10,
      line: line.id,
    })
    .expect(422);

  await request(app)
    .put('/api/v1/products/123')
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
    .put('/api/v1/products/123')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      cost: 0,
      qty: 10,
      line: line.id,
    })
    .expect(422);

  await request(app)
    .put('/api/v1/products/123')
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
    .put('/api/v1/products/123')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      cost: 10,
      qty: 0,
      line: line.id,
    })
    .expect(422);

  await request(app)
    .put('/api/v1/products/123')
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
    .put('/api/v1/products/123')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      cost: 10,
      qty: 2,
    })
    .expect(422);

  await request(app)
    .put('/api/v1/products/123')
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

  const editResponse = await request(app)
    .put(`/api/v1/products/${response.body.data.data.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test2',
      cost: 10,
      qty: 2,
      line: line.id,
    })
    .expect(201);
  expect(editResponse.body.data.data.title).toEqual('test2');
});
