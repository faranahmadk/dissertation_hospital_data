import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { Patient } from './patient.entity';

@Module({
  controllers: [PatientsController],
  providers: [Patient]
})
export class PatientsModule {}
