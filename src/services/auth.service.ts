import { IUser } from '../schema/user.model';
import { createUser, findUserByEmail, findUserById } from '../repositories/user.repository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { HydratedDocument } from 'mongoose';
import { AppError } from '../utils/AppErrors';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Pick<IUser, 'id' | 'name' | 'email' | 'role' | 'organization' | 'premium'>;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
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

export const refreshTokenService = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  if (!refreshToken) throw new AppError('Refresh token is required', 401);

  // 1️⃣ Verify the refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // If token verification fails, it’s either expired or invalid
  if (!decoded) {
    // JWT verify fails for expired token as well, so you might want to differentiate
    throw new AppError('Refresh token expired or invalid. Please login again.', 401);
  }

  // 2️⃣ Find user in DB
  const user = await findUserById(decoded.userId);
  if (!user) throw new AppError('User not found', 404);

  // 3️⃣ Check if token matches the stored one
  if (user.refreshToken !== refreshToken) {
    throw new AppError('Invalid refresh token', 403);
  }

  // 4️⃣ Generate new access token
  const newAccessToken = generateAccessToken(user._id.toString());

  // Optional: rotate refresh token for extra security
  const newRefreshToken = generateRefreshToken(user._id.toString());
  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
