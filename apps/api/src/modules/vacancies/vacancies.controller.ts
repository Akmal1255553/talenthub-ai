import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserRole } from "@talenthub/shared";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import type { RequestUser } from "../../common/strategies/jwt.strategy";
import { VacanciesService } from "./vacancies.service";

@ApiTags("jobs")
@Controller()
export class VacanciesController {
  constructor(private readonly vacancies: VacanciesService) {}

  @Get("jobs")
  search(@Query() query: Record<string, string>) {
    return this.vacancies.list(query);
  }

  @Get("jobs/:slug")
  details(@Param("slug") slug: string) {
    return this.vacancies.getBySlug(slug);
  }

  @Get("jobs/id/:id")
  detailsById(@Param("id") id: string) {
    return this.vacancies.getById(id);
  }

  @Post("employer/vacancies")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Employer)
  create(@CurrentUser() user: RequestUser, @Body() body: any) {
    return this.vacancies.createForEmployer(user.id, body);
  }

  @Patch("employer/vacancies/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Employer)
  update(@CurrentUser() user: RequestUser, @Param("id") id: string, @Body() body: any) {
    return this.vacancies.updateForEmployer(user.id, id, body);
  }
}
