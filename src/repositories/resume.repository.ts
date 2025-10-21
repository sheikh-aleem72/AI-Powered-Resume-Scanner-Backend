// src/repositories/resume.repository.ts
import { ResumeModel, IResume } from '../schema/resume.model';

export const saveResumeMetaData = async (resumeData: IResume) => {
  const newResume = new ResumeModel(resumeData);
  return await newResume.save();
};
