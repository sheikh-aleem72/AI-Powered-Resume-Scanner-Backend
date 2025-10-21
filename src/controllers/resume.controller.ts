// src/controllers/resume.controller.ts
import { Request as ExRequest, Response, NextFunction } from 'express';
import { saveResumeService } from '../services/resume.service';

interface AuthRequest extends ExRequest {
  user?: {
    id: string;
  };
}

export const saveResumeController = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    next(error);
  }
};
