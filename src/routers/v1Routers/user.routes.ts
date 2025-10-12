import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { signinSchema, signupSchema } from '../../validators/userValidator';
import { signinController, signupController } from '../../controllers/auth.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), signupController);

router.post('/signin', validateRequest(signinSchema), signinController);

export default router;
