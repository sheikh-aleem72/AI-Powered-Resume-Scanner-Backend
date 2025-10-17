import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import {
  requestOtpSchema,
  signinSchema,
  signupSchema,
  verifyOtpSchema,
} from '../../validators/userValidator';
import {
  refreshTokenController,
  requestOtpController,
  signinController,
  signupController,
  verifyOtpController,
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

router.post('/request-otp', validateRequest(requestOtpSchema), requestOtpController);

router.post('/verify-otp', validateRequest(verifyOtpSchema), verifyOtpController);

export default router;
