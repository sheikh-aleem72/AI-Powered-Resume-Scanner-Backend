import { IUser } from '../schema/user.model';
import { createUser, findUserByEmail, findUserById } from '../repositories/user.repository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { HydratedDocument } from 'mongoose';
import { AppError } from '../utils/AppErrors';
import { sendOtpEmail } from '../utils/sendEmail';
import {
  createPending,
  deletePendingByEmailAndPurpose,
  findPendingByEmailAndPurpose,
} from '../repositories/pendingVerification.repository';
import { env } from '../config/serverConfig';
import { generateOtp, hashOtp, verifyOtpHash } from '../utils/otp';
import { hash as bcryptHash } from 'bcryptjs';

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

export const requestOtpService = async (
  email: string,
  password: string | null,
  username: string | null,
  purpose: 'signup' | 'reset',
) => {
  // If purpose signup and user exists, reject (no duplicates)
  if (purpose === 'signup') {
    const existing = await findUserByEmail(email);
    if (existing) throw new AppError('Email already registered', 400);
    if (!username || !password)
      throw new AppError('username and password required for signup', 400);
  } else {
    // reset: ensure user exists
    const existing = await findUserByEmail(email);
    if (!existing) throw new AppError('No account found with this email', 404);
  }

  console.log('Checkpoint - 1!');
  // Remove any previous pending for the same email+purpose (so OTP rotates)
  await deletePendingByEmailAndPurpose(email, purpose);

  // Generate OTP and hashes
  const otp = generateOtp();
  const otpHash = await hashOtp(otp);

  // For signup, hash the password so we don't store plaintext in pending
  const hashedPassword = password ? await bcryptHash(password, 10) : null;

  const expiresMinutes = Number(env.OTP_EXPIRES_MINUTES || 5);
  const otpExpiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

  await createPending({
    email,
    username: username || null,
    hashedPassword,
    otpHash,
    purpose,
    otpExpiresAt,
  });

  // Send email (do not include sensitive info)
  await sendOtpEmail(email, otp, purpose);

  return { success: true, message: 'OTP sent to email' };
};

export const verifyOtpService = async ({
  email,
  otp,
  purpose,
  newPassword,
}: {
  email: string;
  otp: string;
  purpose: 'signup' | 'reset';
  newPassword?: string;
}) => {
  const pending = await findPendingByEmailAndPurpose(email, purpose);
  if (!pending) throw new AppError('No pending verification found', 400);

  if (pending.otpExpiresAt.getTime() < Date.now()) {
    await deletePendingByEmailAndPurpose(email, purpose);
    throw new AppError('OTP expired. Please request a new one.', 401);
  }

  const isValid = await verifyOtpHash(otp, pending.otpHash);
  if (!isValid) throw new AppError('Invalid OTP', 400);

  if (purpose === 'signup') {
    if (!pending.username || !pending.hashedPassword) {
      await deletePendingByEmailAndPurpose(email, 'signup');
      throw new AppError('Incomplete signup data. Please request signup again.', 400);
    }

    const newUser = await createUser({
      name: pending.username,
      email: pending.email,
      password: pending.hashedPassword,
    } as IUser);

    await deletePendingByEmailAndPurpose(email, 'signup');

    const accessToken = generateAccessToken(newUser._id.toString());
    const refreshToken = generateRefreshToken(newUser._id.toString());
    newUser.refreshToken = refreshToken;
    await newUser.save();

    return {
      success: true,
      message: 'Email verified and account created',
      accessToken,
      refreshToken,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
      },
    };
  } else {
    if (!newPassword) throw new AppError('newPassword is required for reset', 400);

    const user = await findUserByEmail(email);
    if (!user) throw new AppError('User not found', 404);

    user.password = await bcryptHash(newPassword, 10);
    await user.save();

    await deletePendingByEmailAndPurpose(email, 'reset');

    return { success: true, message: 'Password reset successful' };
  }
};
