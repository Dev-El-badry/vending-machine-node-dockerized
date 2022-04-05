import { Response } from 'express';
import { CookieOptions } from 'express';
import { keys } from '../../../../config/keys';
import { signToken } from './signin-token.job';
import { UserDoc } from '../models/user.models';
import { UserBasicDTO } from '../dtos/user.dto';

export const createSendToken = (
  user: UserDoc,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user);
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + keys.JWTExpiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    access_token: token,
    data: UserBasicDTO.shape(user),
  });
};
