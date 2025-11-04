import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { parseResumeController } from '../../controllers/parsedResume.controller';

const router = express.Router();

router.post('/parse', authMiddleware, parseResumeController);

export default router;
