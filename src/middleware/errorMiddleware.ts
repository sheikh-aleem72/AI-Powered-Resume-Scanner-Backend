import { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppErrors';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error('❌ Error:', err);

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
