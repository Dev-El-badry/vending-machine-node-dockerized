import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { keys } from '../../config/keys';
import request from 'supertest';
import { app } from '../../src/app';

declare global {
  var signin: () => any;
  var signup: (role?: string, name?: string) => any;
}

// jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  // jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  const credentials = {
    id: new mongoose.Types.ObjectId().toHexString(),
    username: 'test',
  };

  const token = jwt.sign(credentials, keys.JWTSecretKey);
  const payload = { jwt: token };
  const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  return [`jwt=${token}`];
};

global.signup = async (role?: string, name?: string) => {
  const response = await request(app)
    .post('/api/v1/users/auth/signup')
    .send({
      username: name || 'test',
      password: 'password',
      confirmPassword: 'password',
      role: role || 'buyer',
    });

  return [`jwt=${response.body.access_token}`];
};
