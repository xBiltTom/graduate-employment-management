import { Module } from '@nestjs/common';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { EmpresasModule } from '../empresas/empresas.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { OfertasRouter } from './ofertas.router';
import { OfertasService } from './ofertas.service';

@Module({
  imports: [EmpresasModule, NotificacionesModule, AuditoriaModule],
  providers: [OfertasService, OfertasRouter],
  exports: [OfertasService, OfertasRouter],
})
export class OfertasModule {}
