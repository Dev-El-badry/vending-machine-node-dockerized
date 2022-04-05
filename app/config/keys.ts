import { dev } from './environments/dev';
import { ci } from './environments/ci';

const getKeys = () => {
  if (process.env.NODE_ENV === 'production') {
  } else if (process.env.NODE_ENV === 'test') {
    return ci;
  } else {
    return dev;
  }
};

export const keys: { [key: string]: any } = getKeys() || dev;
