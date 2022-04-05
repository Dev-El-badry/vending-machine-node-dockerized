import { app } from '../../../../app';
import request from 'supertest';

const createLine = async (counter: number) => {
  return request(app)
    .post('/api/v1/lines')
    .set('Cookie', await global.signup('seller'))
    .send({ title: ` Line ${counter}` });
};

it('can fetch a list of Lines', async () => {
  await createLine(1);

  const response = await request(app).get('/api/v1/lines').send().expect(201);
  expect(response.body.data.data.length).toEqual(1);
});
