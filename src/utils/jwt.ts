import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/serverConfig';

// Types for token payload and return
export interface TokenPayload {
  userId: string;
}

export const generateAccessToken = (userId: string): string => {
  const secret = env.JWT_ACCESS_SECRET;
  return jwt.sign({ userId }, secret, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string): string => {
  const secret = env.JWT_REFRESH_SECRET;
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    return { userId: decoded.userId };
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
    return { userId: decoded.userId };
  } catch {
    return null;
  }
};
