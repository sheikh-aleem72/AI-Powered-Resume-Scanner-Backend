import {
  createResumeAnalysis,
  deleteAnalysis,
  findAnalysisById,
  findAnalysisByResumeAndJob,
  getAllAnalyses,
  updateResumeAnalysis,
} from '../repositories/analysis.repository';
import { IResumeAnalysis } from '../schema/resumeAnalysis.model';
import { AppError } from '../utils/AppErrors';

export const createAnalysisService = async (data: Partial<IResumeAnalysis>) => {
  if (!data.resumeId || !data.jobId) {
    throw new AppError('Missing resumeId or jobId', 400);
  }

  const existing = await findAnalysisByResumeAndJob(
    data.resumeId.toString(),
    data.jobId.toString(),
  );
  if (existing) throw new AppError('Analysis already exists for this resume-job pair', 409);

  return await createResumeAnalysis(data);
};

export const getAnalysisByIdService = async (id: string) => {
  const analysis = await findAnalysisById(id);
  if (!analysis) throw new AppError('Analysis not found', 404);
  return analysis;
};

export const findAnalysisByResumeIdAndJobIdService = async (resumeId: string, jobId: string) => {
  return await findAnalysisByResumeAndJob(resumeId, jobId);
};

export const updateAnalysisService = async (id: string, data: Partial<IResumeAnalysis>) => {
  const updated = await updateResumeAnalysis(id, data);
  if (!updated) throw new AppError('Failed to update analysis', 400);
  return updated;
};

export const getAllAnalysesService = async () => {
  return await getAllAnalyses();
};

export const deleteAnalysisService = async (id: string) => {
  const deleted = await deleteAnalysis(id);
  if (!deleted) throw new AppError('Analysis not found', 404);
  return deleted;
};
