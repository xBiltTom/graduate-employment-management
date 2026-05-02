import { Module } from '@nestjs/common';
import { SectoresRouter } from './sectores.router';
import { SectoresService } from './sectores.service';

@Module({
  providers: [SectoresService, SectoresRouter],
  exports: [SectoresService, SectoresRouter],
})
export class SectoresModule {}
