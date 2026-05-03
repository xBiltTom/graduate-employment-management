import { Module } from '@nestjs/common';
import { EmpresasModule } from '../empresas/empresas.module';
import { OfertasRouter } from './ofertas.router';
import { OfertasService } from './ofertas.service';

@Module({
  imports: [EmpresasModule],
  providers: [OfertasService, OfertasRouter],
  exports: [OfertasService, OfertasRouter],
})
export class OfertasModule {}
