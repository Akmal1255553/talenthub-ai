import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CandidatesModule } from './candidates/candidates.module';
import { EmployersModule } from './employers/employers.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { ApplicationsModule } from './applications/applications.module';
import { AiModule } from './ai/ai.module';
import { BillingModule } from './billing/billing.module';
import { AdminModule } from './admin/admin.module';

const queueImports =
  process.env.DISABLE_REDIS === 'true'
    ? []
    : [
        BullModule.forRoot({
          connection: {
            url: process.env.REDIS_URL ?? 'redis://localhost:6379',
          },
        }),
      ];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(__dirname, '../../../../.env'), '.env'],
    }),
    ...queueImports,
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CandidatesModule,
    EmployersModule,
    VacanciesModule,
    ApplicationsModule,
    AiModule,
    BillingModule,
    AdminModule,
  ],
})
export class AppModule {}
