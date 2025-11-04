import axios from 'axios';
import { env } from '../config/serverConfig';
import { IParsedResume } from '../schema/parsedResume.model';
import { IJob } from '../schema/job.model';
import { AppError } from './AppErrors';

const FASTAPI_URL =
  `${env.PARSER_SERVICE_URL}/analyze_resume_match` ||
  'http://localhost:8000/api/analyze_resume_match';

export const analyze_resume = async (
  parsed_resume: Partial<IParsedResume>,
  job_description: Partial<IJob>,
) => {
  try {
    if (parsed_resume == null || job_description == null) {
      throw new AppError('Invalid input for parse resume microservice!', 400);
    }

    const response = await axios.post(FASTAPI_URL, { parsed_resume, job_description });
    return response.data.data; // structured JSON from FastAPI
  } catch (error) {
    console.error('Error communicating with analyze service:', error);
    throw new Error('Failed to analyze resume');
  }
};
