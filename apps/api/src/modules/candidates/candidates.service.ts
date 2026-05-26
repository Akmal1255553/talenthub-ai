import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { ResumeContent } from '@talenthub/shared';
import * as pdf from 'pdf-parse';
import { getDevStore, isDevDataMode } from '../../dev/dev-store';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class CandidatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  async listResumes(userId: string): Promise<any> {
    if (isDevDataMode()) {
      const profile = getDevStore().getCandidateProfile(userId);
      return { items: getDevStore().listResumes(profile.id) };
    }

    const profile = await this.requireCandidateProfile(userId);
    const resumes = await this.prisma.resume.findMany({
      where: { candidateId: profile.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        aiScore: true,
        promoted: true,
        updatedAt: true,
      },
    });
    return { items: resumes };
  }

  async getResume(userId: string, resumeId: string): Promise<any> {
    if (isDevDataMode()) {
      const profile = getDevStore().getCandidateProfile(userId);
      const resume = getDevStore().getResume(profile.id, resumeId);
      if (!resume) throw new NotFoundException('Resume not found');
      return resume;
    }

    const profile = await this.requireCandidateProfile(userId);
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, candidateId: profile.id },
    });
    if (!resume) throw new NotFoundException('Resume not found');
    return resume;
  }

  async createResume(userId: string, title: string, content: ResumeContent): Promise<any> {
    if (isDevDataMode()) {
      const profile = getDevStore().getCandidateProfile(userId);
      return getDevStore().createResume(profile.id, title, content);
    }

    const profile = await this.requireCandidateProfile(userId);
    const resume = await this.prisma.resume.create({
      data: {
        candidateId: profile.id,
        title,
        content: content as object,
      },
    });
    await this.syncProfileFromResume(profile.id, content);
    return resume;
  }

  async updateResume(
    userId: string,
    resumeId: string,
    data: { title?: string; content?: ResumeContent },
  ): Promise<any> {
    if (isDevDataMode()) {
      const profile = getDevStore().getCandidateProfile(userId);
      const resume = getDevStore().updateResume(profile.id, resumeId, data.title, data.content);
      if (!resume) throw new NotFoundException('Resume not found');
      return resume;
    }

    const profile = await this.requireCandidateProfile(userId);
    const existing = await this.prisma.resume.findFirst({
      where: { id: resumeId, candidateId: profile.id },
    });
    if (!existing) throw new NotFoundException('Resume not found');

    const resume = await this.prisma.resume.update({
      where: { id: resumeId },
      data: {
        title: data.title,
        content: data.content ? (data.content as object) : undefined,
      },
    });

    if (data.content) {
      await this.syncProfileFromResume(profile.id, data.content);
    }

    return resume;
  }

  async deleteResume(userId: string, resumeId: string) {
    if (isDevDataMode()) {
      const profile = getDevStore().getCandidateProfile(userId);
      if (!getDevStore().deleteResume(profile.id, resumeId)) {
        throw new NotFoundException('Resume not found');
      }
      return { ok: true };
    }

    const profile = await this.requireCandidateProfile(userId);
    const existing = await this.prisma.resume.findFirst({
      where: { id: resumeId, candidateId: profile.id },
    });
    if (!existing) throw new NotFoundException('Resume not found');
    await this.prisma.resume.delete({ where: { id: resumeId } });
    return { ok: true };
  }

  async getProfileWithUser(userId: string): Promise<any> {
    if (isDevDataMode()) {
      const user = getDevStore().findUserById(userId);
      const profile = getDevStore().getCandidateProfile(userId);
      return {
        ...profile,
        user: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              avatarUrl: user.avatarUrl,
            }
          : null,
      };
    }

    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!profile) {
      throw new ForbiddenException('Candidate profile required');
    }

    return profile;
  }

  async improveResumeWithAi(userId: string, resumeId: string): Promise<any> {
    const resume = await this.getResume(userId, resumeId);
    
    // Call AI service to improve content
    const result = await this.ai.improveResume(resume.content as any, userId);
    
    // Simulate AI Score
    const aiScore = Math.floor(Math.random() * 25) + 75; // Score between 75 and 99
    
    if (isDevDataMode()) {
      const profile = getDevStore().getCandidateProfile(userId);
      const updated = getDevStore().updateResume(profile.id, resumeId, undefined, result.content, aiScore);
      if (!updated) throw new NotFoundException('Resume not found');
      return updated;
    }
    
    const updated = await this.prisma.resume.update({
      where: { id: resumeId },
      data: {
        content: result.content as any,
        aiScore,
      },
    });
    
    await this.syncProfileFromResume(resume.candidateId, result.content);
    return updated;
  }

  async createResumeFromPdf(userId: string, fileBuffer: Buffer, originalFilename: string): Promise<any> {
    let text = '';
    try {
      const parsedPdf = await (pdf as any)(fileBuffer);
      text = parsedPdf.text || '';
    } catch (err) {
      text = fileBuffer.toString('utf-8');
    }

    let parsedContent: ResumeContent | null = null;
    try {
      parsedContent = await this.ai.parseResumeFromText(text, userId);
    } catch (err) {
      // ignore, fallback will handle
    }

    if (!parsedContent) {
      parsedContent = this.fallbackParseResume(text);
    }

    const title = originalFilename ? originalFilename.replace(/\.[^/.]+$/, "") : "Резюме из PDF";
    return this.createResume(userId, title, parsedContent);
  }

  private fallbackParseResume(text: string): ResumeContent {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Extract email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : "";
    
    // Extract phone
    const phoneMatch = text.match(/(?:\+?[\d\s-()]{10,16})/);
    const phone = phoneMatch ? phoneMatch[0].trim() : "";
    
    // Try to get Full Name (first line that is not email/phone/url and is 2-4 words)
    let fullName = "";
    for (const line of lines) {
      if (line.includes('@') || line.match(/https?:\/\//) || line.match(/\+?\d/)) {
        continue;
      }
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        fullName = line;
        break;
      }
    }
    if (!fullName && lines.length > 0) {
      fullName = lines[0];
    }
    
    // Try to find desired position
    let desiredPosition = "";
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
      const line = lines[i];
      if (line.toLowerCase().includes("должность") || line.toLowerCase().includes("position") || line.toLowerCase().includes("желаемая")) {
        desiredPosition = line.replace(/.*(?:должность|position|желаемая)\s*:?\s*/gi, "").trim();
        break;
      }
    }
    if (!desiredPosition) {
      desiredPosition = "Специалист";
    }

    // Skills
    const skills: string[] = [];
    const commonSkills = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL", "Git", "Docker", "Next.js", "NestJS", "HTML", "CSS", "Prisma", "PostgreSQL"];
    for (const skill of commonSkills) {
      if (new RegExp(`\\b${skill}\\b`, 'i').test(text)) {
        skills.push(skill);
      }
    }

    return {
      personal: {
        fullName,
        email,
        phone,
        city: "",
        desiredPosition,
        employmentTypes: ["FULL_TIME"],
        relocation: false,
      },
      about: text.slice(0, 1000) + (text.length > 1000 ? "..." : ""),
      experience: [],
      education: [],
      skills: skills.length > 0 ? skills : ["Программирование"],
      languages: [],
      links: [],
    };
  }

  private async requireCandidateProfile(userId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new ForbiddenException('Candidate profile required');
    }
    return profile;
  }

  private async syncProfileFromResume(candidateId: string, content: ResumeContent) {
    await this.prisma.candidateProfile.update({
      where: { id: candidateId },
      data: {
        headline: content.personal.desiredPosition || undefined,
        location: content.personal.city,
        about: content.about,
      },
    });
  }
}
