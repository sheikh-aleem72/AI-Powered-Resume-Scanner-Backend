import { IUser } from '../schema/User';
import { createUser, findUserByEmail } from '../repositories/user.repository';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { HydratedDocument } from 'mongoose';

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
