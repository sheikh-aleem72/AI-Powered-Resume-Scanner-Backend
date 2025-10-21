import { Request as ExRequest, Response, NextFunction } from 'express';
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../utils/AppErrors';
import { findUserById } from '../repositories/user.repository';

interface AuthRequest extends ExRequest {
  user?: {
    id: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const customToken = req.headers['x-access-token'] as string | undefined;

    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (customToken) {
      token = customToken;
    } else {
      throw new AppError('No access token provided', 401);
    }

    // 1️⃣ Verify access token
    let decoded = verifyAccessToken(token!);

    if (!decoded) {
      // Access token invalid or expired, try refresh token
      const refreshToken = req.headers['x-refresh-token'] as string | undefined;

      if (!refreshToken) {
        throw new AppError('Refresh token expired!. Please login again.', 401);
      }

      // 2️⃣ Verify refresh token
      const decodedRefresh = verifyRefreshToken(refreshToken);
      if (!decodedRefresh) {
        throw new AppError('Refresh token expired or invalid. Please login again.', 401);
      }

      // 3️⃣ Find user in DB
      const user = await findUserById(decodedRefresh.userId);
      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Invalid refresh token. Please login again.', 403);
      }

      // 4️⃣ Generate new access token
      const newAccessToken = generateAccessToken(user._id.toString());

      // 5️⃣ Attach new access token in response headers
      res.setHeader('x-access-token', newAccessToken);

      // 6️⃣ Set decoded for request
      decoded = { userId: user._id.toString() };
    }

    // 7️⃣ Attach user info to request (basic)
    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in authMiddleware:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};
