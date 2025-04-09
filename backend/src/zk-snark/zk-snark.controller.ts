import { Controller, Post, Body } from '@nestjs/common';
import { ZkSnarkService } from './zk-snark.service';

@Controller('zk-snark')
export class ZkSnarkController {
  constructor(private readonly zkSnarkService: ZkSnarkService) {}

  @Post('generate')
  async generateProof(@Body('data') data: number) {
    return this.zkSnarkService.generateProof(data);
  }

  @Post('verify')
  async verifyProof(@Body('proof') proof: any) {
    return this.zkSnarkService.verifyProof(proof);
  }
}