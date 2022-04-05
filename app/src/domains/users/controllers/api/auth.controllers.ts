import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../../../engine/errors/app-error';
import { createSendToken } from '../../jobs/create-resend-token.job';
import { userExists } from '../../jobs/user-exists.job';
import { User } from '../../models/user.models';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    username,
    email,
    password,
    role, //for test
    confirmPassword,
  } = req.body;

  const newUser = await User.create({
    username,
    email,
    password,
    role, //for test
    confirmPassword,
  });

  createSendToken(newUser, 201, res);
};

export const signin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const doc = await userExists(username);
  if (!doc) throw new AppError('invalid credentials!', 422);

  if (!doc.activation) throw new AppError('your account is suspended');
  const userPassword = doc.password;
  const validPassword = await doc.correctPassword(password, userPassword);
  if (!validPassword) throw new AppError('invalid credentials!', 422);
  createSendToken(doc, 201, res);
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.cookie('jwt', 'logout', {
    // expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(201).json({ status: 'success' });
};
