import jwt from 'jsonwebtoken';
import { keys } from '../../../../config/keys';
import { UserDoc } from '../models/user.models';

export const signToken = (user: UserDoc) => {
  return jwt.sign({ id: user.id, username: user.username }, keys.JWTSecretKey, {
    expiresIn: keys.JWTExpiresIn,
  });
};
