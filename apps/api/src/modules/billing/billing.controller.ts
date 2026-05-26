import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionOwnerType, SubscriptionPlan } from '@prisma/client';
import { PLAN_LIMITS } from '@talenthub/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestUser } from '../../common/strategies/jwt.strategy';
import { isDevDataMode } from '../../dev/dev-store';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('plans')
  plans() {
    return PLAN_LIMITS;
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(@CurrentUser() user: RequestUser, @Body() body: { plan?: string }) {
    const plan = this.normalizePlan(body.plan);
    const amount = plan === SubscriptionPlan.BUSINESS ? 4900 : plan === SubscriptionPlan.PREMIUM ? 1900 : 0;

    if (isDevDataMode()) {
      return {
        checkoutUrl: `/billing/success?plan=${plan.toLowerCase()}`,
        subscription: {
          ownerType: SubscriptionOwnerType.CANDIDATE,
          ownerId: user.id,
          plan,
          status: 'ACTIVE',
        },
      };
    }

    const existing = await this.prisma.subscription.findFirst({
      where: { ownerType: SubscriptionOwnerType.CANDIDATE, ownerId: user.id },
    });
    const subscription = existing
      ? await this.prisma.subscription.update({
          where: { id: existing.id },
          data: { plan, status: 'ACTIVE', provider: 'mock-stripe' },
        })
      : await this.prisma.subscription.create({
          data: {
            ownerType: SubscriptionOwnerType.CANDIDATE,
            ownerId: user.id,
            plan,
            status: 'ACTIVE',
            provider: 'mock-stripe',
          },
        });

    const providerRef = `mock_${subscription.id}_${Date.now()}`;
    const payment = await this.prisma.payment.create({
      data: {
        ownerType: SubscriptionOwnerType.CANDIDATE,
        ownerId: user.id,
        provider: 'mock-stripe',
        providerRef,
        amount,
        currency: 'USD',
        status: 'PAID',
      },
    });

    return {
      checkoutUrl: `/billing/success?session=${providerRef}`,
      subscription,
      payment,
    };
  }

  @Post('webhooks/stripe')
  async stripeWebhook(@Body() body: { subscriptionId?: string; status?: string; plan?: string }) {
    if (!isDevDataMode() && body.subscriptionId) {
      await this.prisma.subscription.update({
        where: { id: body.subscriptionId },
        data: {
          status: body.status ?? 'ACTIVE',
          plan: body.plan ? this.normalizePlan(body.plan) : undefined,
        },
      });
    }
    return { received: true };
  }

  private normalizePlan(plan?: string) {
    const upper = (plan ?? SubscriptionPlan.PREMIUM).toUpperCase();
    if (upper === SubscriptionPlan.FREE || upper === SubscriptionPlan.PREMIUM || upper === SubscriptionPlan.BUSINESS) {
      return upper as SubscriptionPlan;
    }
    return SubscriptionPlan.PREMIUM;
  }
}
