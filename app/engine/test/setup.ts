import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'my-secret-key';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
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
    email: 'test@test.com',
  };

  const token = jwt.sign(credentials, process.env.JWT_KEY!);
  const session = { jwt: token };
  const base64 = Buffer.from(JSON.stringify(session)).toString('base64');
  return [`express:sess=${base64}`];
};
function beforeAll(arg0: () => void) {
  throw new Error('Function not implemented.');
}

function beforeEach(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

function afterAll(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}
