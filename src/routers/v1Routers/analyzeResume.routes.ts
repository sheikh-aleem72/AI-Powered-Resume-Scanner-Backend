import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { analyzeResumeController } from '../../controllers/analyzeResume.controller';

const router = express.Router();

router.post('/', authMiddleware, analyzeResumeController);

export default router;
