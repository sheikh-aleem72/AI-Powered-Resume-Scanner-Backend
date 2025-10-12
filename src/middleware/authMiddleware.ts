import { Request as ExRequest, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/AppErrors';

interface AuthRequest extends ExRequest {
  user?: {
    id: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1]; // Extract token

    // 2️⃣ Verify token
    const decoded = verifyAccessToken(token!);
    if (!decoded) {
      throw new AppError('Invalid or expired token', 401);
    }

    // 3️⃣ Attach user to request
    req.user = { id: decoded.userId };

    // 4️⃣ Proceed
    next();
  } catch (error: any) {
    res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || 'Unauthorized',
    });
  }
};
