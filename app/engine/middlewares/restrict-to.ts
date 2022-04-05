import { Request, Response, NextFunction } from 'express';
import { UserDoc } from '../../src/domains/users/models/user.models';
import { AppError } from '../errors/app-error';

export const restrictTo = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const currentUser = req?.user as UserDoc;
    const role = currentUser.role;
    if (!roles.includes(role)) {
      throw new AppError(`you don't have a permission to perform this action.`);
    }

    next();
  };
};
