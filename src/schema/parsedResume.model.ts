// parsedResume.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IParsedResume extends Document {
  resumeId: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  phone: string;

  education?: {
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];

  experience?: {
    company?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];

  projects?: {
    name?: string;
    description?: string;
    techStack?: string[];
    link?: string;
  }[];

  achievements?: {
    title?: string;
    description?: string;
  }[];

  certifications?: {
    title?: string;
    issuer?: string;
    date?: string;
    description?: string;
  }[];

  skills?: string[];
}

const ParsedResumeSchema = new Schema<IParsedResume>(
  {
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    name: { type: String },
    email: { type: String },
    phone: { type: String },

    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    projects: [
      {
        name: String,
        description: String,
        techStack: [String],
        link: String,
      },
    ],

    achievements: [
      {
        title: String,
        description: String,
      },
    ],

    certifications: [
      {
        title: String,
        issuer: String,
        date: String,
        description: String,
      },
    ],

    skills: [String],
  },
  { timestamps: true },
);

export default mongoose.model<IParsedResume>('ParsedResume', ParsedResumeSchema);
