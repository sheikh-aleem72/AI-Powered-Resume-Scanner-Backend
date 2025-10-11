import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { signupSchema } from '../../validators/userValidator';
import { signupController } from '../../controllers/auth.controller';

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), signupController);

export default router;
