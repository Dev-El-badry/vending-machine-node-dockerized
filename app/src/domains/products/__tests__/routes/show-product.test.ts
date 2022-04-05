import { app } from '../../../../app';
import request from 'supertest';
import mongoose from 'mongoose';

const createLine = async (
  cookie: any
): Promise<{ title: string; id: string }> => {
  const response = await request(app)
    .post('/api/v1/lines')
    .set('Cookie', cookie)
    .send({ title: ` Line` });

  return response.body.data.data;
};

//returns 404 is the product is not found
it('returns 404 if the product is not found', async () => {
  const cookie = await global.signup('seller');
  const fakeProductId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/v1/products/${fakeProductId}`)

    .send()
    .expect(404);
});

//returns the product if the product is found
it('returns the product if the product is found', async () => {
  const cookie = await global.signup('seller');
  const line = await createLine(cookie);
  const createProduct = { title: 'test', cost: 10, qty: 2, line: line.id };
  const response = await request(app)
    .post('/api/v1/products')
    .set('Cookie', cookie)
    .send(createProduct)
    .expect(201);

  await request(app)
    .get(`/api/v1/products/${response.body.data.data.id}`)
    .send()
    .expect(201);
});
