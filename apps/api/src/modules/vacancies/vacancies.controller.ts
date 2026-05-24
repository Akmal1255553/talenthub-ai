import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('jobs')
@Controller()
export class VacanciesController {
  @Get('jobs')
  search(@Query() query: Record<string, string>) {
    return { items: [], query };
  }

  @Get('jobs/:slug')
  details(@Param('slug') slug: string) {
    return { slug };
  }

  @Post('employer/vacancies')
  create(@Body() body: unknown) {
    return { message: 'Vacancy create placeholder', body };
  }

  @Get('employer/vacancies')
  employerVacancies() {
    return { items: [] };
  }

  @Patch('employer/vacancies/:id')
  update(@Param('id') id: string, @Body() body: unknown) {
    return { id, body };
  }
}
