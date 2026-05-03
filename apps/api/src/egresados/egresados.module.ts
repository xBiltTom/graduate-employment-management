import { Module } from '@nestjs/common';
import { EgresadosRouter } from './egresados.router';
import { EgresadosService } from './egresados.service';

@Module({
  providers: [EgresadosService, EgresadosRouter],
  exports: [EgresadosService, EgresadosRouter],
})
export class EgresadosModule {}
