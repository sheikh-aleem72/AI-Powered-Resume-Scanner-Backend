import { IUser, User } from '../schema/User';
import { HydratedDocument } from 'mongoose';

export const createUser = async (userData: Partial<IUser>): Promise<HydratedDocument<IUser>> => {
  const user = new User(userData);
  await user.save();
  return user;
};

export const findUserByEmail = async (email: string): Promise<HydratedDocument<IUser> | null> => {
  return User.findOne({ email });
};
