import { Request, Response } from 'express';
import { signupService } from '../services/auth.service';
import { AppError } from '../utils/AppErrors';

export const signupController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, organization } = req.body;
    const result = await signupService(name, email, password, organization);

    return res.status(201).json({
      message: 'User created successfully!',
      data: result,
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
    console.error('Error in signupController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};
