// zk-snark.module.ts
import { Module } from '@nestjs/common';
import { ZkSnarkService } from './zk-snark.service';
import { ZkSnarkController } from './zk-snark.controller';

@Module({
  providers: [ZkSnarkService],
  controllers: [ZkSnarkController],
  exports: [ZkSnarkService],    
})
export class ZkSnarkModule {}