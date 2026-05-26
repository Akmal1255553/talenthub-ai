import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import type { ResumeContent } from '@talenthub/shared';
import { UserRole } from '@talenthub/shared';

export function isDevDataMode(): boolean {
  return process.env.SKIP_DB_CONNECT === 'true';
}

interface DevUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  googleId?: string | null;
  avatarUrl?: string | null;
  candidateId?: string | null;
}

interface DevCandidateProfile {
  id: string;
  userId: string;
  headline?: string | null;
  location?: string | null;
  about?: string | null;
  visibility: string;
}

interface DevResume {
  id: string;
  candidateId: string;
  title: string;
  content: ResumeContent;
  aiScore?: number | null;
  promoted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DevCompany {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  website?: string | null;
  verified: boolean;
  createdAt: string;
}

interface DevVacancy {
  id: string;
  companyId: string;
  title: string;
  slug: string;
  description: string;
  requirements?: string | null;
  responsibilities?: string | null;
  benefits?: string | null;
  skills?: string | null;
  experience?: string | null;
  schedule?: string | null;
  location?: string | null;
  employmentType: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency: string;
  status: string;
  promoted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DevApplication {
  id: string;
  vacancyId: string;
  candidateUserId: string;
  coverLetter?: string | null;
  status: string;
  aiScore?: number | null;
  aiSummary?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DevStoreData {
  users: DevUser[];
  profiles: DevCandidateProfile[];
  resumes: DevResume[];
  companies?: DevCompany[];
  vacancies?: DevVacancy[];
  applications?: DevApplication[];
}

const STORE_PATH = path.join(process.cwd(), '.dev-data', 'store.json');

function defaultData(): DevStoreData {
  return { users: [], profiles: [], resumes: [], companies: [], vacancies: [], applications: [] };
}

function load(): DevStoreData {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as DevStoreData;
      if (!parsed.companies) parsed.companies = [];
      if (!parsed.vacancies) parsed.vacancies = [];
      if (!parsed.applications) parsed.applications = [];
      return parsed;
    }
  } catch {
    /* ignore corrupt file */
  }
  return defaultData();
}

function save(data: DevStoreData) {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export class DevStore {
  private data = load();

  private persist() {
    save(this.data);
  }

  findUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  findUserById(id: string) {
    return this.data.users.find((u) => u.id === id) ?? null;
  }

  findUserByGoogleOrEmail(googleId: string, email: string) {
    return (
      this.data.users.find((u) => u.googleId === googleId || u.email.toLowerCase() === email.toLowerCase()) ??
      null
    );
  }

  createUser(input: {
    email: string;
    passwordHash: string;
    name: string;
    role: string;
    googleId?: string | null;
    avatarUrl?: string | null;
  }) {
    const user: DevUser = {
      id: randomUUID(),
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      name: input.name,
      role: input.role,
      googleId: input.googleId ?? null,
      avatarUrl: input.avatarUrl ?? null,
    };

    if (input.role === UserRole.Candidate) {
      const profile: DevCandidateProfile = {
        id: randomUUID(),
        userId: user.id,
        visibility: 'PUBLIC',
      };
      this.data.profiles.push(profile);
      user.candidateId = profile.id;
    }

    this.data.users.push(user);
    this.persist();
    return user;
  }

  updateUser(id: string, patch: Partial<Pick<DevUser, 'googleId' | 'name' | 'avatarUrl'>>) {
    const user = this.findUserById(id);
    if (!user) return null;
    Object.assign(user, patch);
    this.persist();
    return user;
  }

  getCandidateProfile(userId: string) {
    let profile = this.data.profiles.find((p) => p.userId === userId);
    if (!profile) {
      profile = { id: randomUUID(), userId, visibility: 'PUBLIC' };
      this.data.profiles.push(profile);
      const user = this.findUserById(userId);
      if (user) user.candidateId = profile.id;
      this.persist();
    }
    return profile;
  }

  countResumes(candidateId: string) {
    return this.data.resumes.filter((r) => r.candidateId === candidateId).length;
  }

  listResumes(candidateId: string) {
    return this.data.resumes
      .filter((r) => r.candidateId === candidateId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  getResume(candidateId: string, resumeId: string) {
    return this.data.resumes.find((r) => r.id === resumeId && r.candidateId === candidateId) ?? null;
  }

  createResume(candidateId: string, title: string, content: ResumeContent) {
    const now = new Date().toISOString();
    const resume: DevResume = {
      id: randomUUID(),
      candidateId,
      title,
      content,
      aiScore: null,
      promoted: false,
      createdAt: now,
      updatedAt: now,
    };
    this.data.resumes.push(resume);
    this.syncProfileFromResume(candidateId, content);
    this.persist();
    return resume;
  }

  updateResume(candidateId: string, resumeId: string, title?: string, content?: ResumeContent, aiScore?: number | null) {
    const resume = this.getResume(candidateId, resumeId);
    if (!resume) return null;
    if (title) resume.title = title;
    if (content) {
      resume.content = content;
      this.syncProfileFromResume(candidateId, content);
    }
    if (aiScore !== undefined) {
      resume.aiScore = aiScore;
    }
    resume.updatedAt = new Date().toISOString();
    this.persist();
    return resume;
  }

  deleteResume(candidateId: string, resumeId: string) {
    const before = this.data.resumes.length;
    this.data.resumes = this.data.resumes.filter(
      (r) => !(r.id === resumeId && r.candidateId === candidateId),
    );
    if (this.data.resumes.length < before) {
      this.persist();
      return true;
    }
    return false;
  }

  listVacancies(): DevVacancy[] {
    if (!this.data.vacancies || this.data.vacancies.length === 0) {
      const { JOB_VACANCIES } = require('@talenthub/shared');
      this.data.vacancies = JOB_VACANCIES.map((j: any) => ({
        id: j.id,
        companyId: "dev-company-1",
        title: j.title,
        slug: j.slug,
        description: j.description,
        requirements: Array.isArray(j.requirements) ? j.requirements.join('\n') : (j.requirements || ''),
        responsibilities: Array.isArray(j.responsibilities) ? j.responsibilities.join('\n') : (j.responsibilities || ''),
        benefits: Array.isArray(j.benefits) ? j.benefits.join('\n') : (j.benefits || ''),
        skills: Array.isArray(j.skills) ? j.skills.join('\n') : (j.skills || ''),
        experience: j.experience || '',
        schedule: j.schedule || '',
        location: j.location,
        employmentType: j.employmentType || "FULL_TIME",
        salaryMin: j.salary ? 1000 : null,
        salaryMax: j.salary ? 3000 : null,
        currency: "USD",
        status: "PUBLISHED",
        promoted: j.promoted || false,
        createdAt: j.publishedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      this.persist();
    }
    return this.data.vacancies ?? [];
  }

  getVacancy(idOrSlug: string): DevVacancy | null {
    this.listVacancies();
    return this.data.vacancies!.find((v) => v.id === idOrSlug || v.slug === idOrSlug) ?? null;
  }

  createVacancy(companyId: string, title: string, description: string, data: Partial<DevVacancy>) {
    this.listVacancies();
    const now = new Date().toISOString();
    const vacancy: DevVacancy = {
      id: randomUUID(),
      companyId,
      title,
      slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`,
      description,
      requirements: data.requirements ?? null,
      location: data.location ?? null,
      employmentType: data.employmentType ?? "FULL_TIME",
      salaryMin: data.salaryMin ?? null,
      salaryMax: data.salaryMax ?? null,
      currency: data.currency ?? "USD",
      status: data.status ?? "DRAFT",
      promoted: false,
      createdAt: now,
      updatedAt: now,
    };
    this.data.vacancies!.push(vacancy);
    this.persist();
    return vacancy;
  }

  updateVacancy(id: string, patch: Partial<DevVacancy>) {
    const vacancy = this.getVacancy(id);
    if (!vacancy) return null;
    Object.assign(vacancy, patch);
    vacancy.updatedAt = new Date().toISOString();
    this.persist();
    return vacancy;
  }

  listCompanies(): DevCompany[] {
    if (!this.data.companies || this.data.companies.length === 0) {
      this.data.companies = [
        {
          id: "dev-company-1",
          name: "TalentHub Labs",
          slug: "talenthub-labs",
          description: "Продуктовая IT-компания. Разрабатываем платформу поиска работы с AI.",
          website: "https://talenthub.ai",
          verified: true,
          createdAt: new Date().toISOString(),
        }
      ];
      this.persist();
    }
    return this.data.companies;
  }

  getCompany(id: string): DevCompany | null {
    this.listCompanies();
    return this.data.companies!.find((c) => c.id === id || c.slug === id) ?? null;
  }

  createCompany(name: string, description?: string, website?: string) {
    this.listCompanies();
    const company: DevCompany = {
      id: randomUUID(),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description ?? null,
      website: website ?? null,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    this.data.companies!.push(company);
    this.persist();
    return company;
  }

  updateCompany(id: string, patch: Partial<DevCompany>) {
    const company = this.getCompany(id);
    if (!company) return null;
    Object.assign(company, patch);
    this.persist();
    return company;
  }

  listApplications(): DevApplication[] {
    if (!this.data.applications) {
      this.data.applications = [];
    }
    return this.data.applications;
  }

  listApplicationsForCandidate(userId: string): DevApplication[] {
    return this.listApplications().filter((app) => app.candidateUserId === userId);
  }

  listApplicationsForVacancy(vacancyId: string): DevApplication[] {
    return this.listApplications().filter((app) => app.vacancyId === vacancyId);
  }

  createApplication(vacancyId: string, candidateUserId: string, coverLetter?: string) {
    const apps = this.listApplications();
    const existing = apps.find(
      (a) => a.vacancyId === vacancyId && a.candidateUserId === candidateUserId
    );
    if (existing) return existing;

    const now = new Date().toISOString();
    const app: DevApplication = {
      id: randomUUID(),
      vacancyId,
      candidateUserId,
      coverLetter: coverLetter ?? null,
      status: "APPLIED",
      aiScore: null,
      aiSummary: null,
      createdAt: now,
      updatedAt: now,
    };
    apps.push(app);
    this.persist();
    return app;
  }

  updateApplicationStatus(applicationId: string, status: string) {
    const apps = this.listApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (!app) return null;
    app.status = status;
    app.updatedAt = new Date().toISOString();
    this.persist();
    return app;
  }

  scoreApplication(applicationId: string, aiScore: number, aiSummary: string) {
    const apps = this.listApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (!app) return null;
    app.aiScore = aiScore;
    app.aiSummary = aiSummary;
    app.updatedAt = new Date().toISOString();
    this.persist();
    return app;
  }

  private syncProfileFromResume(candidateId: string, content: ResumeContent) {
    const profile = this.data.profiles.find((p) => p.id === candidateId);
    if (!profile) return;
    profile.headline = content.personal.desiredPosition || profile.headline;
    profile.location = content.personal.city ?? profile.location;
    profile.about = content.about ?? profile.about;
  }
}

let singleton: DevStore | null = null;

export function getDevStore(): DevStore {
  if (!singleton) singleton = new DevStore();
  return singleton;
}
