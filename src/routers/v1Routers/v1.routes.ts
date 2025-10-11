import express from 'express';
import userRouter from './user.routes';

const router = express.Router();

// Authentication and user routes
router.use('/user', userRouter);

export default router;
