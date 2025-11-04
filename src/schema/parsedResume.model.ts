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
    tenure?: string;
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

// Add a virtual property to calculate "tenure" for experience
ParsedResumeSchema.virtual('experience.tenure').get(function (this: IParsedResume) {
  if (!this.experience) return;

  this.experience.forEach((exp) => {
    if (exp.startDate) {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();

      if (!isNaN(start.getTime())) {
        const diffInMs = end.getTime() - start.getTime();
        const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
        const years = Math.floor(diffInMonths / 12);
        const months = diffInMonths % 12;

        exp.tenure = years > 0 ? `${years} years ${months} months` : `${months} months`;
      } else {
        exp.tenure = 'Fresher';
      }
    } else {
      exp.tenure = 'Fresher';
    }
  });
});

export const ParsedResumeModel = mongoose.model<IParsedResume>('ParsedResume', ParsedResumeSchema);
