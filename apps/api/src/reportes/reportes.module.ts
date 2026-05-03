import { Module } from '@nestjs/common';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { ReportesController } from './reportes.controller';
import { ReportesRouter } from './reportes.router';
import { ReportesService } from './reportes.service';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { ReportsJobService } from './services/reports-job.service';
import { ReportsStorageService } from './services/reports-storage.service';

@Module({
  imports: [NotificacionesModule],
  controllers: [ReportesController],
  providers: [
    ReportesService,
    ReportesRouter,
    ReportsStorageService,
    PdfGeneratorService,
    ReportsJobService,
  ],
  exports: [ReportesService],
})
export class ReportesModule {}
