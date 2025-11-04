import { saveResumeMetaData } from '../repositories/resume.repository';
import { IResumeInput, ResumeModel } from '../schema/resume.model';
import { AppError } from '../utils/AppErrors';

export const saveResumeService = async (resumes: IResumeInput[]) => {
  const savedResumes = await Promise.all(resumes.map((resume) => saveResumeMetaData(resume)));
  return savedResumes;
};

export const getSavedResumeIdService = async (url: string) => {
  const response = await ResumeModel.findOne({ url });
  if (!response) {
    throw new AppError('No saved resume found!', 404);
  }
  return response;
};
