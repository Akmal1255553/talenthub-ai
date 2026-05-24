import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get('me/limits')
  limits() {
    return { message: 'Plan limits endpoint placeholder' };
  }
}
