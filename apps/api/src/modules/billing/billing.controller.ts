import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PLAN_LIMITS } from '@talenthub/shared';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  @Get('plans')
  plans() {
    return PLAN_LIMITS;
  }

  @Post('checkout')
  checkout(@Body() body: unknown) {
    return { message: 'Checkout session placeholder', body };
  }

  @Post('webhooks/stripe')
  stripeWebhook(@Body() body: unknown) {
    return { received: true, body };
  }
}
