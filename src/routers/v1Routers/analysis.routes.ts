import { Router } from 'express';
import * as controller from '../../controllers/analysis.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// Create resume analysis
router.post('/', authMiddleware, controller.createAnalysis);

// Get all resume analysis
router.get('/', authMiddleware, controller.getAllAnalyses);

// Get resume analysis by id
router.get('/:id', authMiddleware, controller.getAnalysisById);

// Update resume analysis
router.put('/:id', authMiddleware, controller.updateAnalysis);

// Delete resume analysis
router.delete('/:id', authMiddleware, controller.deleteAnalysis);

export default router;
