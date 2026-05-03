import { Module } from '@nestjs/common';
import { ArchivosController } from './archivos.controller';
import { ArchivosRouter } from './archivos.router';
import { ArchivosService } from './archivos.service';
import { FileStorageService } from './services/file-storage.service';
import { LocalFileStorageService } from './services/local-file-storage.service';

@Module({
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
