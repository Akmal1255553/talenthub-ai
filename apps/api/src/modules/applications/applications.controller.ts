import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '@talenthub/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { RequestUser } from '../../common/strategies/jwt.strategy';
import { ApplicationsService } from './applications.service';

@ApiTags('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ApplicationsController {
  constructor(private readonly applications: ApplicationsService) {}

  @Get('candidate/applications')
  @Roles(UserRole.Candidate)
  mine(@CurrentUser() user: RequestUser): Promise<any> {
    return this.applications.listForCandidate(user.id);
  }

  @Post('candidate/applications')
  @Roles(UserRole.Candidate)
  apply(@CurrentUser() user: RequestUser, @Body() body: { vacancyId: string; coverLetter?: string }): Promise<any> {
    return this.applications.create(user.id, body.vacancyId, body.coverLetter);
  }

  @Get('employer/vacancies/:id/applications')
  @Roles(UserRole.Employer)
  forVacancy(@CurrentUser() user: RequestUser, @Param('id') id: string): Promise<any> {
    return this.applications.listForVacancy(user.id, id);
  }

  @Post('employer/applications/:id/score')
  @Roles(UserRole.Employer)
  score(@CurrentUser() user: RequestUser, @Param('id') id: string): Promise<any> {
    return this.applications.score(user.id, id);
  }
}
