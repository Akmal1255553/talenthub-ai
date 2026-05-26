import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { getDevStore, isDevDataMode } from '../../dev/dev-store';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  async create(userId: string, vacancyId: string, coverLetter?: string): Promise<any> {
    const aiScore = this.estimateScore(coverLetter);

    if (isDevDataMode()) {
      const vacancy = getDevStore().getVacancy(vacancyId);
      if (!vacancy) throw new NotFoundException('Vacancy not found');
      const application = getDevStore().createApplication(vacancy.id, userId, coverLetter);
      return getDevStore().updateApplicationStatus(application.id, application.status) ?? application;
    }

    const vacancy = await this.prisma.vacancy.findUnique({ where: { id: vacancyId } });
    if (!vacancy) throw new NotFoundException('Vacancy not found');

    return this.prisma.application.upsert({
      where: { vacancyId_candidateUserId: { vacancyId, candidateUserId: userId } },
      create: {
        vacancyId,
        candidateUserId: userId,
        coverLetter,
        aiScore,
        aiSummary: 'Initial compatibility score generated from application details.',
      },
      update: {
        coverLetter,
        aiScore,
        aiSummary: 'Application details refreshed and rescored.',
      },
      include: { vacancy: { include: { company: true } } },
    });
  }

  async listForCandidate(userId: string): Promise<any> {
    if (isDevDataMode()) {
      const items = getDevStore().listApplicationsForCandidate(userId).map((application) => ({
        ...application,
        vacancy: getDevStore().getVacancy(application.vacancyId),
      }));
      return { items };
    }

    const items = await this.prisma.application.findMany({
      where: { candidateUserId: userId },
      include: { vacancy: { include: { company: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { items };
  }

  async listForVacancy(employerUserId: string, vacancyId: string): Promise<any> {
    if (isDevDataMode()) {
      const vacancy = getDevStore().getVacancy(vacancyId);
      if (!vacancy) throw new NotFoundException('Vacancy not found');
      const items = getDevStore().listApplicationsForVacancy(vacancy.id).map((application) => ({
        ...application,
        candidate: getDevStore().findUserById(application.candidateUserId),
      }));
      return { vacancyId: vacancy.id, items };
    }

    await this.requireVacancyOwner(employerUserId, vacancyId);
    const items = await this.prisma.application.findMany({
      where: { vacancyId },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            candidate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { vacancyId, items };
  }

  async score(employerUserId: string, applicationId: string): Promise<any> {
    if (isDevDataMode()) {
      const application = getDevStore().listApplications().find((item) => item.id === applicationId);
      if (!application) throw new NotFoundException('Application not found');
      const score = this.estimateScore(application.coverLetter ?? undefined);
      return { ...application, aiScore: score, aiSummary: 'Candidate scored with development AI simulation.' };
    }

    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { vacancy: { include: { company: { include: { members: true } } } }, candidate: true },
    });
    if (!application) throw new NotFoundException('Application not found');
    if (!application.vacancy.company.members.some((member) => member.userId === employerUserId)) {
      throw new ForbiddenException('You do not own this vacancy');
    }

    const reply = await this.ai.assistant(
      `Score candidate ${application.candidate.name} for vacancy ${application.vacancy.title}.`,
      employerUserId,
    );
    const aiScore = this.estimateScore(`${application.coverLetter ?? ''} ${reply.reply}`);

    return this.prisma.application.update({
      where: { id: applicationId },
      data: {
        aiScore,
        aiSummary: reply.reply.slice(0, 500),
      },
    });
  }

  private async requireVacancyOwner(employerUserId: string, vacancyId: string) {
    const vacancy = await this.prisma.vacancy.findFirst({
      where: {
        id: vacancyId,
        company: { members: { some: { userId: employerUserId } } },
      },
    });
    if (!vacancy) throw new ForbiddenException('You do not own this vacancy');
    return vacancy;
  }

  private estimateScore(input?: string | null) {
    const text = input?.trim() ?? '';
    return Math.min(98, Math.max(62, 72 + Math.floor(text.length / 40)));
  }
}
