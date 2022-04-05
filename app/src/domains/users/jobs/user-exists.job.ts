import { User } from '../models/user.models';

export const userExists = async (username: string) => {
  const rec = await User.findOne({ username }).select('+password');
  return rec;
};
