import { Module } from '@nestjs/common';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { ArchivosController } from './archivos.controller';
import { ArchivosRouter } from './archivos.router';
import { ArchivosService } from './archivos.service';
import { FileStorageService } from './services/file-storage.service';
import { LocalFileStorageService } from './services/local-file-storage.service';

@Module({
  imports: [AuditoriaModule],
  controllers: [ArchivosController],
  providers: [
    ArchivosService,
    ArchivosRouter,
    {
      provide: FileStorageService,
      useClass: LocalFileStorageService,
    },
  ],
  exports: [ArchivosService, FileStorageService],
})
export class ArchivosModule {}
