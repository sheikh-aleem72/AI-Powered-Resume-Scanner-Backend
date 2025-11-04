import { Router } from 'express';
import { saveResumeController } from '../../controllers/resume.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.post('/save-meta', authMiddleware, saveResumeController);

export default router;
