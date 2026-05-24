import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import type { ResumeContent } from "@talenthub/shared";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import type { RequestUser } from "../../common/strategies/jwt.strategy";
import { AiService } from "./ai.service";

@ApiTags("ai")
@Controller("ai")
export class AiController {
  constructor(private readonly ai: AiService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("assistant")
  assistant(@CurrentUser() user: RequestUser, @Body() body: { message?: string }) {
    return this.ai.assistant(body.message ?? "", user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("resume/improve")
  improveResume(@CurrentUser() user: RequestUser, @Body() body: { content: ResumeContent }) {
    return this.ai.improveResume(body.content, user.id);
  }
}
