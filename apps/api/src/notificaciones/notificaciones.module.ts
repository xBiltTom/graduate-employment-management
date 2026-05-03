import { Module } from '@nestjs/common';
import { NotificacionesRouter } from './notificaciones.router';
import { NotificacionesService } from './notificaciones.service';
import { MailService } from './services/mail.service';

@Module({
  providers: [NotificacionesService, NotificacionesRouter, MailService],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}
