import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('employer')
@Controller('employer')
export class EmployersController {
  @Post('companies')
  createCompany(@Body() body: unknown) {
    return { message: 'Company create placeholder', body };
  }

  @Get('companies/:id')
  company(@Param('id') id: string) {
    return { id };
  }

  @Patch('companies/:id')
  updateCompany(@Param('id') id: string, @Body() body: unknown) {
    return { id, body };
  }

  @Get('analytics')
  analytics() {
    return { views: 0, applications: 0, conversionRate: 0 };
  }
}
