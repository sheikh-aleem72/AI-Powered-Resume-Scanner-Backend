// src/controllers/resume.controller.ts
import { Request as ExRequest, Response, NextFunction } from 'express';
import { parseAndSaveResumeService, saveResumeService } from '../services/resume.service';
import { AppError } from '../utils/AppErrors';

interface AuthRequest extends ExRequest {
  user?: {
    id: string;
  };
}

export const saveResumeController = async (req: AuthRequest, res: Response) => {
  try {
    const { resumes } = req.body;
    const userId = req.user?.id; // assuming you have authMiddleware

    if (!resumes || !Array.isArray(resumes)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing resumes array' });
    }

    const resumePayloads = resumes.map((resume) => ({
      filename: resume.filename,
      url: resume.url,
      folder: resume.folder || 'resumes',
      size: resume.size,
      format: resume.format,
      uploadedBy: userId!,
    }));

    const saved = await saveResumeService(resumePayloads);

    return res.status(201).json({
      success: true,
      message: 'Resume metadata saved successfully',
      data: saved,
    });
  } catch (error) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in saveResumeController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const parseResumeController = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeUrl } = req.body;
    const result = await parseAndSaveResumeService(resumeUrl);
    return res.status(200).json({ success: true, parsedData: result });
  } catch (error: any) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in parseResumeController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};
