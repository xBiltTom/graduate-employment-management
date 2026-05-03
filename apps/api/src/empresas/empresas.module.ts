import { Module } from '@nestjs/common';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { EmpresasRouter } from './empresas.router';
import { EmpresasService } from './empresas.service';

@Module({
  imports: [NotificacionesModule, AuditoriaModule],
  providers: [EmpresasService, EmpresasRouter],
  exports: [EmpresasService, EmpresasRouter],
})
export class EmpresasModule {}
