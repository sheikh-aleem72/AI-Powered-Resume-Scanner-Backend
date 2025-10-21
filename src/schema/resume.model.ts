// src/models/resume.model.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IResumeInput {
  filename: string;
  url: string;
  folder?: string;
  size?: number;
  format?: string;
  uploadedBy: string;
}

export interface IResume extends Document {
  filename: string;
  url: string;
  folder?: string;
  size?: number;
  format?: string;
  uploadedBy: Types.ObjectId;
}

const resumeSchema = new Schema<IResume>(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    folder: { type: String, default: 'resumes' },
    size: { type: Number },
    format: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const ResumeModel = model<IResume>('Resume', resumeSchema);
