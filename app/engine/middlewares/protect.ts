import { Request, Response, NextFunction } from 'express';
import { NoAuthorizedError } from '../errors/no-authorized-error';
import jwt from 'jsonwebtoken';
import { keys } from '../../config/keys';
import { User, UserDoc } from '../../src/domains/users/models/user.models';

declare global {
  namespace Express {
    interface Request {
      user: UserDoc;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token!: string;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    throw new NoAuthorizedError();
  }
  const decode: any = await jwt.verify(token, keys.JWTSecretKey);
  const currentUser = await User.findById(decode.id);

  if (!currentUser) {
    throw new NoAuthorizedError();
  }
  req.user = currentUser;

  next();
};
