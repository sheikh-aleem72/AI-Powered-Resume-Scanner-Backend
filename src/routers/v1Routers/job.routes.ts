import { Router } from 'express';
import * as controller from '../../controllers/job.controller';
import { validateJobCreation } from '../../validators/job.validators';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// Create job
router.post('/', authMiddleware, validateJobCreation, controller.createJob);

// Get all jobs
router.get('/', controller.listJobs);

// Get job by id
router.get('/:id', controller.getJob);

// Update job
router.patch('/:id', authMiddleware, controller.updateJob);

// Delete job by id
router.delete('/:id', authMiddleware, controller.deleteJob);

export default router;
