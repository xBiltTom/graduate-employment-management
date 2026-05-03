import { Module } from '@nestjs/common';
import { AuditoriaRouter } from './auditoria.router';
import { AuditoriaService } from './auditoria.service';

@Module({
  providers: [AuditoriaService, AuditoriaRouter],
  exports: [AuditoriaService, AuditoriaRouter],
})
export class AuditoriaModule {}
