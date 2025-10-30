import { IParsedResume } from '../schema/parsedResume.model';

/**
 * Safely maps unstructured parsed resume data from microservice
 * into a structured format matching IParsedResume schema.
 */
export const mapParsedResumeData = (parsedData: any): Partial<IParsedResume> => {
  const safeArray = (data: any) => (Array.isArray(data) ? data : []);
  const safeString = (data: any) => (typeof data === 'string' ? data.trim() : '');
  const safeObject = (data: any) => (typeof data === 'object' && data !== null ? data : {});

  return {
    name: safeString(parsedData.name),
    email: safeString(parsedData.email),
    phone: safeString(parsedData.phone),

    education: safeArray(parsedData.education).map((edu: any) => ({
      institution: safeString(edu.institution || edu.school || edu.name),
      degree: safeString(edu.degree),
      fieldOfStudy: safeString(edu.fieldOfStudy || edu.branch || edu.stream),
      startDate: safeString(edu.startDate || edu.from),
      endDate: safeString(edu.endDate || edu.to),
      description: safeString(edu.description),
    })),

    experience: safeArray(parsedData.experience).map((exp: any) => ({
      company: safeString(exp.company || exp.organization || exp.name),
      role: safeString(exp.role || exp.position || exp.designation),
      startDate: safeString(exp.startDate || exp.from),
      endDate: safeString(exp.endDate || exp.to),
      description: safeString(exp.description),
    })),

    projects: safeArray(parsedData.projects).map((proj: any) => ({
      name: safeString(proj.name),
      description: safeString(proj.description),
      techStack: safeArray(proj.techStack || proj.technologies || []),
      link: safeString(proj.link || proj.url),
    })),

    achievements: safeArray(parsedData.achievements).map((ach: any) => ({
      title: safeString(ach.title || ach.name),
      description: safeString(ach.description),
    })),

    certifications: safeArray(parsedData.certifications).map((cert: any) => ({
      title: safeString(cert.title || cert.name),
      issuer: safeString(cert.issuer || cert.organization),
      date: safeString(cert.date || cert.issuedOn),
      description: safeString(cert.description),
    })),

    skills: safeArray(parsedData.skills).map((s: any) => safeString(s)),
  };
};
