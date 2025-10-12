import { IUser } from '../schema/User';
import { createUser, findUserByEmail } from '../repositories/user.repository';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { HydratedDocument } from 'mongoose';
import { AppError } from '../utils/AppErrors';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Pick<IUser, 'id' | 'name' | 'email' | 'role' | 'organization' | 'premium'>;
}

export const signupService = async (
  name: string,
  email: string,
  password: string,
  organization?: string,
): Promise<AuthResponse> => {
  // 1️⃣ Check if user exists
  const existingUser: HydratedDocument<IUser> | null = await findUserByEmail(email);
  if (existingUser) throw new Error('User already exists');

  // 2️⃣ Create user
  const newUser: HydratedDocument<IUser> = await createUser({
    name,
    email,
    password,
    role: 'recruiter',
    premium: false,
    organization: organization || '',
  });

  // 3️⃣ Generate tokens
  const accessToken = generateAccessToken(newUser._id.toString());
  const refreshToken = generateRefreshToken(newUser._id.toString());

  // 4️⃣ Save refresh token
  newUser.refreshToken = refreshToken;
  await newUser.save();

  // 5️⃣ Return response
  return {
    accessToken,
    refreshToken,
    user: {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      organization: newUser.organization || '',
      premium: newUser.premium,
    },
  };
};

export const signinService = async (email: string, password: string): Promise<AuthResponse> => {
  // 1️⃣ Find user by email
  const user = await findUserByEmail(email);
  if (!user) throw new AppError('Invalid email or password', 401);

  // 2️⃣ Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  // 3️⃣ Generate tokens
  const refreshToken = generateRefreshToken(user._id.toString());
  const accessToken = generateAccessToken(user._id.toString());

  // 4️⃣ Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  // 5️⃣ Return tokens + user info
  return {
    refreshToken,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization || '',
      premium: user.premium,
    },
  };
};
