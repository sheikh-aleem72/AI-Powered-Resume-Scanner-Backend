import express from 'express';
import userRouter from './user.routes';
import cloudinaryRouter from './cloudinary.routes';

const router = express.Router();

// Authentication and user routes
router.use('/user', userRouter);

// Cloudinary route
router.use('/cloudinary', cloudinaryRouter);

export default router;
