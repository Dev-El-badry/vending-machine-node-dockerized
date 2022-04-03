import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validate-err';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  const fullUrl = req.originalUrl;
  const webRequest = fullUrl.includes('/admin/');

  if (!errors.isEmpty()) {
    if (
      webRequest &&
      req.headers['content-type'] === 'application/x-www-form-urlencoded'
    ) {
      req.flash('validationList', (errors as any).errors);
      res.redirect(fullUrl);
    }
    throw new RequestValidationError(errors.array());
  } else {
    next();
  }
};
