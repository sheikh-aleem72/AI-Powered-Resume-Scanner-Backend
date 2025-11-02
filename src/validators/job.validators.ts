import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateJobCreation = [
  body('title').notEmpty().withMessage('title is required'),
  body('required_skills')
    .isArray({ min: 1 })
    .withMessage('required_skills must be an array with at least one skill'),
  body('min_experience_years').optional().isNumeric(),
  (req: Request, res: Response, next: NextFunction) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ success: false, errors: errs.array() });
    }
    next();
  },
];
