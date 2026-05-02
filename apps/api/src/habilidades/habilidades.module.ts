import { Module } from '@nestjs/common';
import { HabilidadesRouter } from './habilidades.router';
import { HabilidadesService } from './habilidades.service';

@Module({
  providers: [HabilidadesService, HabilidadesRouter],
  exports: [HabilidadesService, HabilidadesRouter],
})
export class HabilidadesModule {}
