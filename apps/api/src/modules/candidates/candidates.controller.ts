import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@talenthub/shared";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import type { RequestUser } from "../../common/strategies/jwt.strategy";
import { CandidatesService } from "./candidates.service";
import { CreateResumeDto, UpdateResumeDto } from "./dto/resume.dto";

@ApiTags("candidate")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Candidate)
@Controller("candidate")
export class CandidatesController {
  constructor(private readonly candidates: CandidatesService) {}

  @Get("profile")
  profile(@CurrentUser() user: RequestUser) {
    return this.candidates.getProfileWithUser(user.id);
  }

  @Get("resumes")
  resumes(@CurrentUser() user: RequestUser) {
    return this.candidates.listResumes(user.id);
  }

  @Get("resumes/:id")
  getResume(@CurrentUser() user: RequestUser, @Param("id") id: string) {
    return this.candidates.getResume(user.id, id);
  }

  @Post("resumes")
  createResume(@CurrentUser() user: RequestUser, @Body() dto: CreateResumeDto) {
    return this.candidates.createResume(user.id, dto);
  }

  @Patch("resumes/:id")
  updateResume(
    @CurrentUser() user: RequestUser,
    @Param("id") id: string,
    @Body() dto: UpdateResumeDto,
  ) {
    return this.candidates.updateResume(user.id, id, dto);
  }

  @Delete("resumes/:id")
  deleteResume(@CurrentUser() user: RequestUser, @Param("id") id: string) {
    return this.candidates.deleteResume(user.id, id);
  }

  @Post("resumes/:id/improve")
  improveResume(@CurrentUser() user: RequestUser, @Param("id") id: string) {
    return this.candidates.improveResumeWithAi(user.id, id);
  }

  @Get("recommendations")
  recommendations() {
    return { items: [] };
  }
}
