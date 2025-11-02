import { JobModel, IJob } from '../schema/job.model';
import { Types } from 'mongoose';

export const createJob = async (payload: Partial<IJob>) => {
  const job = new JobModel(payload);
  return job.save();
};

export const findJobById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return JobModel.findById(id).lean();
};

export const updateJobById = async (id: string, update: Partial<IJob>) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return JobModel.findByIdAndUpdate(id, update, { new: true }).lean();
};

export const deleteJobById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return JobModel.findByIdAndDelete(id);
};

export const searchJobs = async (
  query: { text?: string; skill?: string; experience?: number },
  options = { limit: 20, skip: 0 },
) => {
  const q: any = {};
  if (query.text) q.$text = { $search: query.text };
  if (query.skill) q.required_skills = { $in: [query.skill] };
  if (typeof query.experience === 'number') q.min_experience_years = { $lte: query.experience };

  return JobModel.find(q).skip(options.skip).limit(options.limit).lean();
};
