import { Router } from 'express';
import { parseResumeController, saveResumeController } from '../../controllers/resume.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.post('/save-meta', authMiddleware, saveResumeController);

router.post('/parse-resume', authMiddleware, parseResumeController);

export default router;
