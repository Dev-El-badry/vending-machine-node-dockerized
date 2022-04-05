import { Request, Response, NextFunction } from 'express';
import { getOne } from '../../../../../engine/factories/handler.factories';
import { User, UserDoc } from '../../models/user.models';

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.params.id = (req.user as UserDoc).id;
  next();
};

export const getUser = getOne(User);

export const deposit = async (req: any, res: Response) => {
  const amount = req.body.amount * 1;
  const currentUser = req.user as UserDoc;

  await User.findById(currentUser.id).update({
    $inc: { deposit: amount },
  });

  res.status(201).json({
    status: 'success',
  });
};

export const reset = async (req: any, res: Response) => {
  const currentUser = req.user as UserDoc;

  await User.findById(currentUser.id).update({
    deposit: 0,
  });

  res.status(201).json({
    status: 'success',
  });
};
