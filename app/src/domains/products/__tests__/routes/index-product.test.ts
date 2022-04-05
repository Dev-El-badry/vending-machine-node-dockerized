import { app } from '../../../../app';
import request from 'supertest';

const createLine = async (
  cookie: any
): Promise<{ title: string; id: string }> => {
  const response = await request(app)
    .post('/api/v1/lines')
    .set('Cookie', cookie)
    .send({ title: ` Line` });

  return response.body.data.data;
};

const createProduct = async (counter: number, cookie: any, line: any) => {
  return request(app)
    .post('/api/v1/products')
    .set('Cookie', cookie)
    .send({ title: `test ${counter}`, cost: 10, qty: 2, line: line.id });
};

it('can fetch a list of products', async () => {
  const cookie = await global.signup('seller');
  const line = await createLine(cookie);
  await createProduct(1, cookie, line);
  await createProduct(2, cookie, line);
  await createProduct(3, cookie, line);

  const response = await request(app)
    .get('/api/v1/products')
    .send()
    .expect(201);
  expect(response.body.data.data.length).toEqual(3);
});
