import { Module } from '@nestjs/common';
import { EstadisticasRouter } from './estadisticas.router';
import { EstadisticasService } from './estadisticas.service';

@Module({
  providers: [EstadisticasService, EstadisticasRouter],
  exports: [EstadisticasService, EstadisticasRouter],
})
export class EstadisticasModule {}
