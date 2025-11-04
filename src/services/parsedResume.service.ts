import { ParsedResumeModel } from '../schema/parsedResume.model';
import { IResume, ResumeModel } from '../schema/resume.model';
import { AppError } from '../utils/AppErrors';
import { mapParsedResumeData } from '../utils/parsedResumeMapper';
import { parseResume } from '../utils/parserAPI';

export const parseAndSaveResumeService = async (resumeUrl: string) => {
  // 1. Find the corresponding resume
  const resume = (await ResumeModel.findOne({ url: resumeUrl })) as IResume;
  if (resume == null) {
    throw new AppError('No resume found with this url', 404);
  }

  const resumeId = resume._id;
  if (resumeId == null) {
    throw new AppError('Resume id is not found', 400);
  }
  // 2. Call the parse resume microservice
  const isParsed = await getParsedResumeService(resumeId.toString());
  if (isParsed) {
    return isParsed;
  }

  const parsedData = await parseResume(resumeUrl);
  if (parsedData == null) {
    throw new AppError('Something went wrong while parsing!', 500);
  }

  // 3. Map parsed data to structured format
  const mapped = mapParsedResumeData(parsedData);

  // 4. Create and save the parsed resume document
  const newParsedResume = new ParsedResumeModel({
    resumeId: resume._id,
    ...mapped,
  });

  await newParsedResume.save();
  return newParsedResume;
};

export const getParsedResumeService = async (resumeId: string) => {
  if (!resumeId) {
    throw new AppError('Invalid resumeId', 400);
  }

  const parsedResume = await ParsedResumeModel.findOne({ resumeId });

  return parsedResume;
};
