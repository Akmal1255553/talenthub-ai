export type ResumeSalaryPeriod = "month" | "year";

export interface ResumeSalary {
  amount: number;
  currency: string;
  period: ResumeSalaryPeriod;
}

export interface ResumePersonal {
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  desiredPosition: string;
  salary?: ResumeSalary;
  employmentTypes?: string[];
  relocation?: boolean;
}

export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
}

export interface ResumeLanguage {
  name: string;
  level: string;
}

export interface ResumeLink {
  label: string;
  url: string;
}

export interface ResumeContent {
  personal: ResumePersonal;
  about?: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
  languages: ResumeLanguage[];
  links?: ResumeLink[];
}

export interface ResumeListItem {
  id: string;
  title: string;
  aiScore?: number | null;
  promoted: boolean;
  updatedAt: string;
}

export interface ResumeRecord extends ResumeListItem {
  content: ResumeContent;
  createdAt: string;
}

export const EMPTY_RESUME_CONTENT: ResumeContent = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    city: "",
    desiredPosition: "",
    employmentTypes: [],
    relocation: false,
  },
  about: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  links: [],
};

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
