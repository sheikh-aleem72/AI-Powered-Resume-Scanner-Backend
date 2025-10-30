import axios from 'axios';
import { env } from '../config/serverConfig';

const FASTAPI_URL = env.PARSER_SERVICE_URL || 'http://localhost:8000/api/parse/';

export const parseResume = async (resumeUrl: string) => {
  try {
    const response = await axios.post(FASTAPI_URL, { resumeUrl });
    return response.data.parsed_data; // structured JSON from FastAPI
  } catch (error) {
    console.error('Error communicating with parser service:', error);
    throw new Error('Failed to parse resume');
  }
};
