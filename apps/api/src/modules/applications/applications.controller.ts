import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('applications')
@Controller()
export class ApplicationsController {
  @Get('candidate/applications')
  mine() {
    return { items: [] };
  }

  @Post('candidate/applications')
  apply(@Body() body: unknown) {
    return { message: 'Application create placeholder', body };
  }

  @Get('employer/vacancies/:id/applications')
  forVacancy(@Param('id') id: string) {
    return { vacancyId: id, items: [] };
  }

  @Post('employer/applications/:id/score')
  score(@Param('id') id: string) {
    return { id, message: 'AI candidate scoring queued' };
  }
}
