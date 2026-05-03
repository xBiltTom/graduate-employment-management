import { Module } from '@nestjs/common';
import { PostulacionesRouter } from './postulaciones.router';
import { PostulacionesService } from './postulaciones.service';

@Module({
  providers: [PostulacionesService, PostulacionesRouter],
  exports: [PostulacionesService, PostulacionesRouter],
})
export class PostulacionesModule {}
