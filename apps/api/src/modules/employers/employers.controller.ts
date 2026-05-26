import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '@talenthub/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { RequestUser } from '../../common/strategies/jwt.strategy';
import { EmployersService } from './employers.service';

@ApiTags('employer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Employer)
@Controller('employer')
export class EmployersController {
  constructor(private readonly employers: EmployersService) {}

  @Post('companies')
  createCompany(
    @CurrentUser() user: RequestUser,
    @Body() body: { name?: string; description?: string; website?: string },
  ): Promise<any> {
    return this.employers.createCompany(user.id, body);
  }

  @Get('companies/:id')
  company(@CurrentUser() user: RequestUser, @Param('id') id: string): Promise<any> {
    return this.employers.getCompany(user.id, id);
  }

  @Patch('companies/:id')
  updateCompany(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; website?: string },
  ): Promise<any> {
    return this.employers.updateCompany(user.id, id, body);
  }

  @Delete('companies/:id')
  deleteCompany(@CurrentUser() user: RequestUser, @Param('id') id: string): Promise<any> {
    return this.employers.deleteCompany(user.id, id);
  }

  @Get('analytics')
  analytics(@CurrentUser() user: RequestUser): Promise<any> {
    return this.employers.getAnalytics(user.id);
  }
}
