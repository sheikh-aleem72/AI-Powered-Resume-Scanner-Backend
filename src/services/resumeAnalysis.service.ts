import * as repo from '../repositories/resumeAnalysis.repository';
import { AppError } from '../utils/AppErrors';

export const createAnalysisService = async (data: any) => {
  if (!data.resumeId || !data.jobId) {
    throw new AppError('Missing resumeId or jobId', 400);
  }

  const existing = await repo.findAnalysisByResumeAndJob(data.resumeId, data.jobId);
  if (existing) throw new AppError('Analysis already exists for this resume-job pair', 409);

  return await repo.createResumeAnalysis(data);
};

export const getAnalysisByIdService = async (id: string) => {
  const analysis = await repo.findAnalysisById(id);
  if (!analysis) throw new AppError('Analysis not found', 404);
  return analysis;
};

export const updateAnalysisService = async (id: string, data: any) => {
  const updated = await repo.updateResumeAnalysis(id, data);
  if (!updated) throw new AppError('Failed to update analysis', 400);
  return updated;
};

export const getAllAnalysesService = async () => {
  return await repo.getAllAnalyses();
};

export const deleteAnalysisService = async (id: string) => {
  const deleted = await repo.deleteAnalysis(id);
  if (!deleted) throw new AppError('Analysis not found', 404);
  return deleted;
};
