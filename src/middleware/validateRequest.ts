import { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny, ZodObject } from 'zod';

type AnyZodObject = ZodObject<Record<string, ZodTypeAny>>;

export const validateRequest =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.errors?.[0]?.message || 'Validation error',
      });
    }
  };
