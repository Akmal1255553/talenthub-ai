import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  @Get('overview')
  overview() {
    return {
      users: 0,
      vacanciesPendingReview: 0,
      paymentsToday: 0,
      aiRequestsToday: 0,
    };
  }

  @Get('audit-logs')
  auditLogs() {
    return { items: [] };
  }
}
