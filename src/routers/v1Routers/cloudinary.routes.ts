import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { getPresignedUrls } from '../../controllers/cloudinary.controller';

const router = express.Router();

router.get('/presigned-urls', authMiddleware, getPresignedUrls);

export default router;
