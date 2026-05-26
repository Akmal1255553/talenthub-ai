import { Injectable, NotFoundException } from "@nestjs/common";
import { getDevStore, isDevDataMode } from "../../dev/dev-store";
import { PrismaService } from "../prisma/prisma.service";

type VacancyInput = {
  companyId?: string;
  title?: string;
  description?: string;
  requirements?: string | string[];
  location?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  status?: string;
};

@Injectable()
export class VacanciesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, string>): Promise<any> {
    const q = query.q?.toLowerCase();

    if (isDevDataMode()) {
      let items = getDevStore().listVacancies();
      if (q) {
        items = items.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.description.toLowerCase().includes(q) ||
            j.location?.toLowerCase().includes(q)
        );
      }
      return {
        items: items.map((j) => {
          const comp = getDevStore().getCompany(j.companyId);
          return {
            id: j.id,
            slug: j.slug,
            title: j.title,
            company: comp?.name ?? "Company",
            verified: comp?.verified ?? false,
            location: j.location,
            salary: j.salaryMin ? `${j.salaryMin} - ${j.salaryMax} ${j.currency}` : undefined,
            employmentType: j.employmentType,
            description: j.description,
            skills: j.skills ? j.skills.split('\n') : [],
            experience: j.experience || undefined,
            schedule: j.schedule || undefined,
            createdAt: j.createdAt,
            publishedAt: j.createdAt.split('T')[0],
          };
        }),
      };
    }

    const where: any = {
      status: "PUBLISHED",
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ];
    }

    const vacancies = await this.prisma.vacancy.findMany({
      where,
      include: {
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      items: vacancies.map((v) => ({
        id: v.id,
        slug: v.slug,
        title: v.title,
        company: v.company.name,
        verified: v.company.verified,
        location: v.location,
        salary: v.salaryMin ? `${v.salaryMin} - ${v.salaryMax} ${v.currency}` : undefined,
        employmentType: v.employmentType,
        description: v.description,
        skills: v.skills ? v.skills.split("\n") : [],
        experience: v.experience || undefined,
        schedule: v.schedule || undefined,
        createdAt: v.createdAt,
        publishedAt: v.createdAt.toISOString().split("T")[0],
      })),
    };
  }

  async getBySlug(slug: string): Promise<any> {
    if (isDevDataMode()) {
      const v = getDevStore().getVacancy(slug);
      if (!v) throw new NotFoundException("Vacancy not found");
      const comp = getDevStore().getCompany(v.companyId);
      return {
        ...v,
        company: comp?.name ?? "Company",
        companyDescription: comp?.description ?? undefined,
        verified: comp?.verified ?? false,
        skills: v.skills ? v.skills.split('\n') : [],
        requirements: v.requirements ? v.requirements.split('\n') : [],
        responsibilities: v.responsibilities ? v.responsibilities.split('\n') : [],
        benefits: v.benefits ? v.benefits.split('\n') : [],
      };
    }

    const vacancy = await this.prisma.vacancy.findUnique({
      where: { slug },
      include: { company: true },
    });

    if (!vacancy) {
      throw new NotFoundException("Vacancy not found");
    }

    return {
      id: vacancy.id,
      slug: vacancy.slug,
      title: vacancy.title,
      company: vacancy.company.name,
      companyDescription: vacancy.company.description,
      verified: vacancy.company.verified,
      location: vacancy.location,
      salary: vacancy.salaryMin ? `${vacancy.salaryMin} - ${vacancy.salaryMax} ${vacancy.currency}` : undefined,
      description: vacancy.description,
      requirements: vacancy.requirements ? vacancy.requirements.split("\n") : [],
      responsibilities: vacancy.responsibilities ? vacancy.responsibilities.split("\n") : [],
      benefits: vacancy.benefits ? vacancy.benefits.split("\n") : [],
      skills: vacancy.skills ? vacancy.skills.split("\n") : [],
      experience: vacancy.experience || undefined,
      schedule: vacancy.schedule || undefined,
      employmentType: vacancy.employmentType,
    };
  }

  async getById(id: string): Promise<any> {
    if (isDevDataMode()) {
      const v = getDevStore().getVacancy(id);
      if (!v) throw new NotFoundException("Vacancy not found");
      const comp = getDevStore().getCompany(v.companyId);
      return {
        ...v,
        company: comp?.name ?? "Company",
        companyDescription: comp?.description ?? undefined,
        verified: comp?.verified ?? false,
        skills: v.skills ? v.skills.split('\n') : [],
        requirements: v.requirements ? v.requirements.split('\n') : [],
        responsibilities: v.responsibilities ? v.responsibilities.split('\n') : [],
        benefits: v.benefits ? v.benefits.split('\n') : [],
      };
    }

    const vacancy = await this.prisma.vacancy.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!vacancy) {
      throw new NotFoundException("Vacancy not found");
    }

    return {
      id: vacancy.id,
      slug: vacancy.slug,
      title: vacancy.title,
      company: vacancy.company.name,
      companyDescription: vacancy.company.description,
      verified: vacancy.company.verified,
      location: vacancy.location,
      salary: vacancy.salaryMin ? `${vacancy.salaryMin} - ${vacancy.salaryMax} ${vacancy.currency}` : undefined,
      description: vacancy.description,
      requirements: vacancy.requirements ? vacancy.requirements.split("\n") : [],
      responsibilities: vacancy.responsibilities ? vacancy.responsibilities.split("\n") : [],
      benefits: vacancy.benefits ? vacancy.benefits.split("\n") : [],
      skills: vacancy.skills ? vacancy.skills.split("\n") : [],
      experience: vacancy.experience || undefined,
      schedule: vacancy.schedule || undefined,
      employmentType: vacancy.employmentType,
    };
  }

  async createForEmployer(employerUserId: string, input: VacancyInput): Promise<any> {
    if (!input.title?.trim() || !input.description?.trim()) {
      throw new NotFoundException("Vacancy title and description are required");
    }

    if (isDevDataMode()) {
      const company = input.companyId
        ? getDevStore().getCompany(input.companyId)
        : getDevStore().listCompanies()[0];
      if (!company) throw new NotFoundException("Company not found");
      return getDevStore().createVacancy(company.id, input.title, input.description, {
        requirements: this.normalizeRequirements(input.requirements),
        location: input.location,
        employmentType: input.employmentType ?? "FULL_TIME",
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
        currency: input.currency ?? "USD",
        status: input.status ?? "DRAFT",
      });
    }

    const company = await this.prisma.company.findFirst({
      where: {
        id: input.companyId,
        members: { some: { userId: employerUserId } },
      },
    });
    if (!company) throw new NotFoundException("Company not found");

    return this.prisma.vacancy.create({
      data: {
        companyId: company.id,
        title: input.title,
        slug: await this.uniqueSlug(input.title),
        description: input.description,
        requirements: this.normalizeRequirements(input.requirements),
        location: input.location,
        employmentType: input.employmentType ?? "FULL_TIME",
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
        currency: input.currency ?? "USD",
        status: (input.status ?? "DRAFT") as any,
      },
      include: { company: true },
    });
  }

  async updateForEmployer(employerUserId: string, id: string, input: VacancyInput): Promise<any> {
    if (isDevDataMode()) {
      const vacancy = getDevStore().updateVacancy(id, {
        title: input.title,
        description: input.description,
        requirements: this.normalizeRequirements(input.requirements),
        location: input.location,
        employmentType: input.employmentType,
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
        currency: input.currency,
        status: input.status,
      });
      if (!vacancy) throw new NotFoundException("Vacancy not found");
      return vacancy;
    }

    const existing = await this.prisma.vacancy.findFirst({
      where: {
        id,
        company: { members: { some: { userId: employerUserId } } },
      },
    });
    if (!existing) throw new NotFoundException("Vacancy not found");

    return this.prisma.vacancy.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        requirements: this.normalizeRequirements(input.requirements),
        location: input.location,
        employmentType: input.employmentType,
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
        currency: input.currency,
        status: input.status as any,
      },
      include: { company: true },
    });
  }

  private normalizeRequirements(requirements?: string | string[]) {
    if (Array.isArray(requirements)) return requirements.join("\n");
    return requirements;
  }

  private async uniqueSlug(title: string) {
    const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "vacancy";
    let slug = base;
    let suffix = 2;
    while (await this.prisma.vacancy.findUnique({ where: { slug } })) {
      slug = `${base}-${suffix++}`;
    }
    return slug;
  }
}
