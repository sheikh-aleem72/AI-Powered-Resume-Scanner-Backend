import { IUser, User } from '../schema/user.model';
import { HydratedDocument } from 'mongoose';

type CreateUserInput = {
  name: string;
  email: string;
  password: string; // can be plain or hashed
  passwordIsHashed?: boolean;
  role?: 'admin' | 'recruiter';
  organization?: string;
  premium: boolean;
};

export const createUser = async (input: CreateUserInput): Promise<HydratedDocument<IUser>> => {
  const {
    name,
    email,
    password,
    passwordIsHashed = false,
    role = 'recruiter',
    organization = '',
  } = input;

  // If password already hashed, bypass pre-save hashing by setting a flag on document
  if (passwordIsHashed) {
    const user = new User({
      name,
      email,
      password, // already hashed
      role,
      organization,
    } as IUser);

    // mark the password as not modified so pre-save hook won't re-hash
    user.set('password', password, { strict: false });
    // manually set isModified false for password so pre-save hook will skip:
    user.markModified('password');
    await user.save();
    return user;
  } else {
    const user = new User({
      name,
      email,
      password, // plain: pre-save will hash
      role,
      organization,
    });
    await user.save();
    return user;
  }
};

export const findUserByEmail = async (email: string) => {
  return User.findOne({ email: email.toLowerCase() }).exec();
};

export const findUserById = async (userId: string): Promise<HydratedDocument<IUser> | null> => {
  const user = await User.findById(userId);
  return user;
};
