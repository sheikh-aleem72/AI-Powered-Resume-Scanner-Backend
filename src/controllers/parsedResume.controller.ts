import { Request as ExRequest, Response } from 'express';
import { AppError } from '../utils/AppErrors';
import { parseAndSaveResumeService } from '../services/parsedResume.service';

interface AuthRequest extends ExRequest {
  user?: {
    id: string;
  };
}

export const parseResumeController = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeUrl } = req.body;
    const result = await parseAndSaveResumeService(resumeUrl);
    return res.status(200).json({ success: true, parsedData: result });
  } catch (error) {
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
