import { Module } from '@nestjs/common';
import { CarrerasRouter } from './carreras.router';
import { CarrerasService } from './carreras.service';

@Module({
  providers: [CarrerasService, CarrerasRouter],
  exports: [CarrerasService, CarrerasRouter],
})
export class CarrerasModule {}
