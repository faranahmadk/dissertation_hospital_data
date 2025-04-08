import { Module } from '@nestjs/common';
import { HospitalsController } from './hospitals.controller';
import { Hospital } from './hospital.entity';

@Module({
  controllers: [HospitalsController],
  providers: [Hospital]
})
export class HospitalsModule {}
