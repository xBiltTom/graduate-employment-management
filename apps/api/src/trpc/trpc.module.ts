import { Global, Module } from '@nestjs/common';
import { ArchivosModule } from '../archivos/archivos.module';
import { ArchivosRouter } from '../archivos/archivos.router';
import { CarrerasModule } from '../carreras/carreras.module';
import { EstadisticasModule } from '../estadisticas/estadisticas.module';
import { EmpresasModule } from '../empresas/empresas.module';
import { EgresadosModule } from '../egresados/egresados.module';
import { HabilidadesModule } from '../habilidades/habilidades.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { NotificacionesRouter } from '../notificaciones/notificaciones.router';
import { OfertasModule } from '../ofertas/ofertas.module';
import { PostulacionesModule } from '../postulaciones/postulaciones.module';
import { ReportesModule } from '../reportes/reportes.module';
import { ReportesRouter } from '../reportes/reportes.router';
import { SectoresModule } from '../sectores/sectores.module';
import { TrpcRouter } from './trpc.router';
import { TrpcService } from './trpc.service';

@Global()
@Module({
  imports: [
    ArchivosModule,
    CarrerasModule,
    SectoresModule,
    HabilidadesModule,
    NotificacionesModule,
    EmpresasModule,
    EstadisticasModule,
    EgresadosModule,
    OfertasModule,
    PostulacionesModule,
    ReportesModule,
  ],
  providers: [
    TrpcService,
    TrpcRouter,
    NotificacionesRouter,
    ReportesRouter,
    ArchivosRouter,
  ],
  exports: [TrpcService, TrpcRouter],
})
export class TrpcModule {}
