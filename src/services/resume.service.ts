import { saveResumeMetaData } from '../repositories/resume.repository';
import parsedResumeModel from '../schema/parsedResume.model';
import { IResumeInput, ResumeModel } from '../schema/resume.model';
import { AppError } from '../utils/AppErrors';
import { mapParsedResumeData } from '../utils/parsedResumeMapper';
import { parseResume } from '../utils/parserAPI';

export const saveResumeService = async (resumes: IResumeInput[]) => {
  const savedResumes = await Promise.all(resumes.map((resume) => saveResumeMetaData(resume)));
  return savedResumes;
};

export const parseAndSaveResumeService = async (resumeUrl: string) => {
  // 1. Call the parse resume microservice
  const parsedData = await parseResume(resumeUrl);

  // 2. Find the corresponding resume
  const resume = await ResumeModel.findOne({ url: resumeUrl });
  if (resume == null) {
    throw new AppError('No resume found with this url', 404);
  }

  // 3. Map parsed data to structured format
  const mapped = mapParsedResumeData(parsedData);

  // 4. Create and save the parsed resume document
  const newParsedResume = new parsedResumeModel({
    resumeId: resume._id,
    ...mapped,
  });

  await newParsedResume.save();
  return newParsedResume;
};
