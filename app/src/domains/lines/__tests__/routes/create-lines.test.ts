import request from 'supertest';
import { app } from '../../../../app';
import { Line } from '../../models/line.model';

// check if has a route handle listening to /api/v1/lines for post requests
it('if has a route handle listening to /api/v1/lines for post request', async () => {
  const response = await request(app).post('/api/v1/lines').send({});
  expect(response.status).not.toEqual(404);
});

// check if has a route handle listening to /api/v1/lines for post requests
it('can only be accessed it the user is signed in', async () => {
  return request(app).post('/api/v1/lines').send({}).expect(401);
});

// return a status other than 401 if the user is signed in
it('return a status other than 401 if the user is signed in', async () => {
  const cookie = await global.signup();

  const response = await request(app)
    .post('/api/v1/lines')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

//return an error if an invalid title is provided
it('return an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/v1/lines')
    .set('Cookie', await global.signup())
    .send({
      title: '',
    })
    .expect(422);
});

//creates line with valid inputs
it('creates line with valid inputs', async () => {
  let lines = await Line.find({});
  expect(lines.length).toEqual(0);

  const createLine = {
    title: 'first line',
  };
  const response = await request(app)
    .post('/api/v1/lines')
    .set('Cookie', await global.signup('seller'))
    .send(createLine)
    .expect(201);

  lines = await Line.find({});
  expect(lines.length).toEqual(1);
  expect(lines[0].title).toEqual(createLine.title);
});

// return a status 422 if the user not allow to take this action
it('return a status  422 if the user not allow to take this action', async () => {
  const cookie = await global.signup();
  const createLine = {
    title: 'first line',
  };
  const response = await request(app)
    .post('/api/v1/lines')
    .set('Cookie', cookie)
    .send(createLine)
    .expect(422);

  // expect(response.status).not.toEqual(422);
});

// return a status other than 422 if the user allow to take this action
it('return a status other than 422 if the user not allow to take this action', async () => {
  const cookie = await global.signup('seller');
  const createLine = {
    title: 'first line',
  };
  const response = await request(app)
    .post('/api/v1/lines')
    .set('Cookie', cookie)
    .send(createLine);

  expect(response.status).not.toEqual(422);
});
