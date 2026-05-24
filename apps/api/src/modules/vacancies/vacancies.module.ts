import { Module } from '@nestjs/common';
import { VacanciesController } from './vacancies.controller';

@Module({ controllers: [VacanciesController] })
export class VacanciesModule {}
