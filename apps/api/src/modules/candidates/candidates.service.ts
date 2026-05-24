import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import type { ResumeContent } from "@talenthub/shared";
import { AiService } from "../ai/ai.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateResumeDto, UpdateResumeDto } from "./dto/resume.dto";

@Injectable()
export class CandidatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  private async getProfile(userId: string) {
    let profile = await this.prisma.candidateProfile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await this.prisma.candidateProfile.create({ data: { userId } });
    }
    return profile;
  }

  async getProfileWithUser(userId: string) {
    const profile = await this.getProfile(userId);
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });
    const resumeCount = await this.prisma.resume.count({ where: { candidateId: profile.id } });
    return {
      profile: {
        id: profile.id,
        headline: profile.headline,
        location: profile.location,
        about: profile.about,
        visibility: profile.visibility,
        resumeCount,
      },
      user,
    };
  }

  async listResumes(userId: string) {
    const profile = await this.getProfile(userId);
    const items = await this.prisma.resume.findMany({
      where: { candidateId: profile.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        aiScore: true,
        promoted: true,
        updatedAt: true,
      },
    });
    return {
      items: items.map((r) => ({
        ...r,
        updatedAt: r.updatedAt.toISOString(),
      })),
    };
  }

  async getResume(userId: string, resumeId: string) {
    const profile = await this.getProfile(userId);
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, candidateId: profile.id },
    });
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }
    return this.mapResume(resume);
  }

  async createResume(userId: string, dto: CreateResumeDto) {
    const profile = await this.getProfile(userId);
    const resume = await this.prisma.resume.create({
      data: {
        candidateId: profile.id,
        title: dto.title,
        content: dto.content as unknown as Prisma.InputJsonValue,
      },
    });
    await this.syncProfileFromResume(userId, dto.content as ResumeContent);
    return this.mapResume(resume);
  }

  async updateResume(userId: string, resumeId: string, dto: UpdateResumeDto) {
    const profile = await this.getProfile(userId);
    const existing = await this.prisma.resume.findFirst({
      where: { id: resumeId, candidateId: profile.id },
    });
    if (!existing) {
      throw new NotFoundException("Resume not found");
    }

    const resume = await this.prisma.resume.update({
      where: { id: resumeId },
      data: {
        title: dto.title,
        content: dto.content ? (dto.content as unknown as Prisma.InputJsonValue) : undefined,
      },
    });

    if (dto.content) {
      await this.syncProfileFromResume(userId, dto.content as ResumeContent);
    }

    return this.mapResume(resume);
  }

  async deleteResume(userId: string, resumeId: string) {
    const profile = await this.getProfile(userId);
    const existing = await this.prisma.resume.findFirst({
      where: { id: resumeId, candidateId: profile.id },
    });
    if (!existing) {
      throw new NotFoundException("Resume not found");
    }
    await this.prisma.resume.delete({ where: { id: resumeId } });
    return { ok: true };
  }

  private async syncProfileFromResume(userId: string, content: ResumeContent) {
    await this.prisma.candidateProfile.update({
      where: { userId },
      data: {
        headline: content.personal.desiredPosition || undefined,
        location: content.personal.city || undefined,
        about: content.about || undefined,
      },
    });
  }

  private mapResume(resume: {
    id: string;
    title: string;
    content: unknown;
    aiScore: number | null;
    promoted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: resume.id,
      title: resume.title,
      content: resume.content as ResumeContent,
      aiScore: resume.aiScore,
      promoted: resume.promoted,
      createdAt: resume.createdAt.toISOString(),
      updatedAt: resume.updatedAt.toISOString(),
    };
  }

  async improveResumeWithAi(userId: string, resumeId: string) {
    const resume = await this.getResume(userId, resumeId);
    const improved = await this.ai.improveResume(resume.content, userId);
    return this.updateResume(userId, resumeId, {
      title: resume.title,
      content: improved.content,
    });
  }

  async assertResumeOwner(userId: string, resumeId: string) {
    const profile = await this.getProfile(userId);
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, candidateId: profile.id },
    });
    if (!resume) {
      throw new ForbiddenException();
    }
    return resume;
  }
}
