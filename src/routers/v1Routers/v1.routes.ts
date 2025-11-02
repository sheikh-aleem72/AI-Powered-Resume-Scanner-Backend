import express from 'express';
import userRouter from './user.routes';
import cloudinaryRouter from './cloudinary.routes';
import resumeRouter from './resume.routes';
import jobRouter from './job.routes';
import resumeAnalysisRouter from './resumeAnalysis.routes';

const router = express.Router();

// Authentication and user routes
router.use('/user', userRouter);

// Cloudinary route
router.use('/cloudinary', cloudinaryRouter);

// Resume route
router.use('/resume', resumeRouter);

// Job route
router.use('/job', jobRouter);

// Resume Analysis route
router.use('/resume-analysis', resumeAnalysisRouter);

export default router;
