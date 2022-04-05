import { app } from '../../../../app';
import request from 'supertest';
import mongoose from 'mongoose';

//returns 404 is the line is not found
it('returns 404 if the line is not found', async () => {
  const fakelineId = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/v1/lines/${fakelineId}`).send().expect(404);
});

//returns the line if the line is found
it('returns the line if the line is found', async () => {
  const createLine = { title: 'fake line' };
  const response = await request(app)
    .post('/api/v1/lines')
    .set('Cookie', await global.signup('seller'))
    .send(createLine)
    .expect(201);

  await request(app)
    .get(`/api/v1/lines/${response.body.data.data.id}`)
    .send()
    .expect(201);
});
