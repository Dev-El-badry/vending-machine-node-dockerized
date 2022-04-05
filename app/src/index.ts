import mongoose from 'mongoose';
import { keys } from '../config/keys';
import { AppError } from '../engine/errors/app-error';
import { app } from './app';

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('UNCAUGHT EXCEPTION 🚫 Shutting down....');
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
const start = async () => {
  const server = app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
  });

  if (!keys.mongoUri) {
    throw new AppError('mongo uri is invalid');
  }

  process.on('unhandledRejection', (err) => {
    console.log(err);
    console.log('UNHANDLED REJECTION 🚫 Shutting down ....');
    server.close(() => {
      process.exit(1);
    });
  });

  await mongoose.connect(keys.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};

start();
