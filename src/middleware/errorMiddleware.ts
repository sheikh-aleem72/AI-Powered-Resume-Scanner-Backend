import { ErrorRequestHandler, Request, Response } from 'express';
import { AppError } from '../utils/AppErrors';

export const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response) => {
  console.error('❌ Error:', err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
