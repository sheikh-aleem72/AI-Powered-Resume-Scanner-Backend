import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { signinSchema, signupSchema } from '../../validators/userValidator';
import {
  refreshTokenController,
  signinController,
  signupController,
} from '../../controllers/auth.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), signupController);

router.post('/signin', validateRequest(signinSchema), signinController);

router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to protected route!',
    // userId: req.user?.id, // TS knows user?.id exists
  });
});

router.post('/refresh-token', refreshTokenController);

export default router;
