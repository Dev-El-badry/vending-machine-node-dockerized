import { Response, Request, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .send({ errors: err.serializeErrors(), stack: err.stack });
  }

  return res.status(400).json({
    message: 'something wrong !',
    msg: err['message'],
    stack: err['stack'],
  });
};
