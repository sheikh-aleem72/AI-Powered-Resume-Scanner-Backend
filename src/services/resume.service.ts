// src/services/resume.service.ts
import { saveResumeMetaData } from '../repositories/resume.repository';
import { IResume } from '../schema/resume.model';

export const saveResumeService = async (resumes: IResume[]) => {
  const savedResumes = await Promise.all(resumes.map((resume) => saveResumeMetaData(resume)));
  return savedResumes;
};
