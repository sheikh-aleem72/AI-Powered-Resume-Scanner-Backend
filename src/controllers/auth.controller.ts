import { Request, response, Response } from 'express';
import {
  refreshTokenService,
  requestOtpService,
  resetPasswordService,
  signinService,
  signupService,
  verifyOtpService,
} from '../services/auth.service';
import { AppError } from '../utils/AppErrors';

export const signupController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, organization } = req.body;
    const result = await signupService(name, email, password, organization);

    return res.status(201).json(response);
  } catch (error) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in signupController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const signinController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken, user } = await signinService(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user,
      },
    });
  } catch (error) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in signinController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 401);
    }

    const tokens = await refreshTokenService(refreshToken);

    return res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in refreshTokenController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const response = await resetPasswordService(email);
    return res.status(200).json(response);
  } catch (error) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in resetPasswordController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { email, otp, purpose, newPassword } = req.body;
    const response = await verifyOtpService({ email, otp, purpose, newPassword });
    return res.status(response.accessToken ? 201 : 200).json(response);
  } catch (error) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in requestOtpController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};
