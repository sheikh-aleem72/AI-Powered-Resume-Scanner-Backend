import { ResumeModel, IResume, IResumeInput } from '../schema/resume.model';

export const saveResumeMetaData = async (resumeData: IResumeInput) => {
  const newResume = new ResumeModel(resumeData);
  return await newResume.save();
};
