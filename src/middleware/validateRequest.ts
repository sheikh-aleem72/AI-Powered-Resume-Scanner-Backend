import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny, ZodObject } from 'zod';

type AnyZodObject = ZodObject<Record<string, ZodTypeAny>>;

export const validateRequest =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // 👇 safely typed, TS and ESLint both happy
        const firstError = (error as ZodError).issues[0]?.message || 'Validation failed';

        return res.status(400).json({
          success: false,
          message: firstError,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
