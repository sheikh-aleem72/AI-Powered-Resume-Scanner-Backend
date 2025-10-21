import { saveResumeMetaData } from '../repositories/resume.repository';
import { IResumeInput } from '../schema/resume.model';

export const saveResumeService = async (resumes: IResumeInput[]) => {
  const savedResumes = await Promise.all(resumes.map((resume) => saveResumeMetaData(resume)));
  return savedResumes;
};
