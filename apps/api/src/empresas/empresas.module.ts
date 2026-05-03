import { Module } from '@nestjs/common';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { EmpresasRouter } from './empresas.router';
import { EmpresasService } from './empresas.service';

@Module({
  imports: [NotificacionesModule],
  providers: [EmpresasService, EmpresasRouter],
  exports: [EmpresasService, EmpresasRouter],
})
export class EmpresasModule {}
