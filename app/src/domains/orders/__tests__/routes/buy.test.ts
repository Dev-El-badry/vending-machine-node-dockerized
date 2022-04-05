import request from 'supertest';
import { app } from '../../../../app';
import { Product } from '../../../products/models/product.model';

const createProduct = async () => {
  const cookie = await global.signup('seller');
  const createdLine = await request(app)
    .post('/api/v1/lines')
    .set('Cookie', cookie)
    .send({
      title: 'first line',
    });

  const line = createdLine.body.data.data.id;

  const response = await request(app)
    .post('/api/v1/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      cost: 10,
      qty: 2,
      line: line,
    })
    .expect(201);

  return response.body.data.data;
};

// check if has a route handle listening to /api/v1/orders for post requests
it('if has a route handle listening to /api/v1/orders/buy for post request', async () => {
  const response = await request(app).post('/api/v1/orders/buy').send({});
  expect(response.status).not.toEqual(404);
});

// check if has a route handle listening to /api/v1/orders/buy for post requests
it('can only be accessed it the user is signed in', async () => {
  return request(app).post('/api/v1/orders/buy').send({}).expect(401);
});

// return a status other than 401 if the user is signed in
it('return a status other than 401 if the user is signed in', async () => {
  const cookie = await global.signup();

  const response = await request(app)
    .post('/api/v1/orders/buy')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

//return an error if an invalid title is provided
it('return an error if an invalid qty is provided', async () => {
  const product = await createProduct();
  const cookie = await global.signup('', 'testtest');
  const res = await request(app)
    .post('/api/v1/orders/buy')
    .set('Cookie', cookie)
    .send({
      qty: 0,
      product: product.id,
    })
    .expect(422);

  await request(app)
    .post('/api/v1/orders/buy')
    .set('Cookie', cookie)
    .send({
      product: product.id,
    })
    .expect(422);
});

//return an error if quantity is not enough
it('return an error if quantity is not enough', async () => {
  const product = await createProduct();
  const cookie = await global.signup('', 'testtests');
  await request(app)
    .post('/api/v1/orders/buy')
    .set('Cookie', cookie)
    .send({
      qty: 10,
      product: product.id,
    })
    .expect(422);
});

//decrement quantity of product when create order
it('decrement quantity of product when create order', async () => {
  const product = await createProduct();
  const cookie = await global.signup('', 'testtests');
  await request(app)
    .post('/api/v1/users/deposit')
    .set('Cookie', cookie)
    .send({ amount: 50 })
    .expect(201);

  await request(app)
    .post('/api/v1/orders/buy')
    .set('Cookie', cookie)
    .send({
      qty: 1,
      product: product.id,
    })
    .expect(201);

  const productDoc = await Product.findById(product.id).select('qty');
  expect(productDoc?.qty).toEqual(1);

  await request(app)
    .post('/api/v1/orders/buy')
    .set('Cookie', cookie)
    .send({
      qty: 1,
      product: product.id,
    })
    .expect(201);

  const productDoc2 = await Product.findById(product.id).select('qty');
  expect(productDoc2?.qty).toEqual(0);
});

//insert with valid inputs
it('insert with valid inputs', async () => {
  const product = await createProduct();
  const cookie = await global.signup('', 'testtests');
  await request(app)
    .post('/api/v1/users/deposit')
    .set('Cookie', cookie)
    .send({ amount: 50 })
    .expect(201);

  await request(app)
    .post('/api/v1/orders/buy')
    .set('Cookie', cookie)
    .send({
      qty: 1,
      product: product.id,
    })
    .expect(201);
});
