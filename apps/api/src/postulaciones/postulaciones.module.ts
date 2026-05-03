import { Module } from '@nestjs/common';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { PostulacionesRouter } from './postulaciones.router';
import { PostulacionesService } from './postulaciones.service';

@Module({
  imports: [NotificacionesModule],
  providers: [PostulacionesService, PostulacionesRouter],
  exports: [PostulacionesService, PostulacionesRouter],
})
export class PostulacionesModule {}
