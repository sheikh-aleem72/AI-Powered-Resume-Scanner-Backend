import { Request, Response } from 'express';
import { AppError } from '../utils/AppErrors';
import cloudinary from '../config/cloudinary.config';
import { env } from '../config/serverConfig';

export const getPresignedUrls = async (req: Request, res: Response) => {
  try {
    const { fileNames } = req.body;

    // Generate multiple upload signatures (1 per file)
    const urls = fileNames.map((name: string) => {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder: 'resumes', public_id: name },
        env.CLOUDINARY_API_SECRET!,
      );

      return {
        uploadUrl: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
        timestamp,
        signature,
        apiKey: env.CLOUDINARY_API_KEY,
        folder: 'resumes',
        filename: name,
      };
    });

    return res.status(200).json({ success: true, urls });
  } catch (error) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in getPresignedUrls:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};
