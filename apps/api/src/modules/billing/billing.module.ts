import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BillingController } from './billing.controller';

@Module({ imports: [PrismaModule], controllers: [BillingController] })
export class BillingModule {}
