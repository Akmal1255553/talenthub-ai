import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { getDevStore, isDevDataMode } from '../../dev/dev-store';
import { PrismaService } from '../prisma/prisma.service';

type CompanyInput = {
  name?: string;
  description?: string;
  website?: string;
};

@Injectable()
export class EmployersService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompany(employerUserId: string, input: CompanyInput): Promise<any> {
    if (!input.name?.trim()) {
      throw new ForbiddenException('Company name is required');
    }

    if (isDevDataMode()) {
      return getDevStore().createCompany(input.name, input.description, input.website);
    }

    const company = await this.prisma.company.create({
      data: {
        name: input.name,
        slug: await this.uniqueSlug(input.name),
        description: input.description,
        website: input.website,
        members: { create: { userId: employerUserId, role: 'OWNER' } },
      },
      include: { members: true },
    });
    return company;
  }

  async getCompany(employerUserId: string, id: string): Promise<any> {
    if (isDevDataMode()) {
      const company = getDevStore().getCompany(id);
      if (!company) throw new NotFoundException('Company not found');
      return company;
    }

    const company = await this.prisma.company.findFirst({
      where: { id, members: { some: { userId: employerUserId } } },
      include: { vacancies: true, members: true },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async updateCompany(employerUserId: string, id: string, input: CompanyInput): Promise<any> {
    if (isDevDataMode()) {
      const company = getDevStore().updateCompany(id, input);
      if (!company) throw new NotFoundException('Company not found');
      return company;
    }

    await this.requireCompanyOwner(employerUserId, id);
    return this.prisma.company.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        website: input.website,
      },
    });
  }

  async deleteCompany(employerUserId: string, id: string): Promise<any> {
    if (isDevDataMode()) {
      const company = getDevStore().getCompany(id);
      if (!company) throw new NotFoundException('Company not found');
      return { ok: true };
    }

    await this.requireCompanyOwner(employerUserId, id);
    await this.prisma.company.delete({ where: { id } });
    return { ok: true };
  }

  async getAnalytics(employerUserId: string): Promise<any> {
    if (isDevDataMode()) {
      const vacancies = getDevStore().listVacancies();
      const applications = getDevStore().listApplications();
      return {
        activeVacancies: vacancies.filter((vacancy) => vacancy.status === 'PUBLISHED').length,
        applications: applications.length,
        conversionRate: applications.length ? 0.18 : 0,
      };
    }

    const companies = await this.prisma.company.findMany({
      where: { members: { some: { userId: employerUserId } } },
      select: { id: true },
    });
    const companyIds = companies.map((company) => company.id);
    const activeVacancies = await this.prisma.vacancy.count({
      where: { companyId: { in: companyIds }, status: 'PUBLISHED' },
    });
    const applications = await this.prisma.application.count({
      where: { vacancy: { companyId: { in: companyIds } } },
    });
    const converted = await this.prisma.application.count({
      where: {
        vacancy: { companyId: { in: companyIds } },
        status: { in: ['INTERVIEW', 'OFFER'] },
      },
    });

    return {
      activeVacancies,
      applications,
      conversionRate: applications ? Number((converted / applications).toFixed(2)) : 0,
    };
  }

  private async requireCompanyOwner(employerUserId: string, companyId: string) {
    const company = await this.prisma.company.findFirst({
      where: { id: companyId, members: { some: { userId: employerUserId } } },
    });
    if (!company) throw new ForbiddenException('You do not own this company');
    return company;
  }

  private async uniqueSlug(name: string) {
    const base = slugify(name);
    let slug = base;
    let suffix = 2;
    while (await this.prisma.company.findUnique({ where: { slug } })) {
      slug = `${base}-${suffix++}`;
    }
    return slug;
  }
}

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'company'
  );
}
