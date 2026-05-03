import { Injectable } from '@nestjs/common';
import { ArchivosRouter } from '../archivos/archivos.router';
import { CarrerasRouter } from '../carreras/carreras.router';
import { EstadisticasRouter } from '../estadisticas/estadisticas.router';
import { EmpresasRouter } from '../empresas/empresas.router';
import { EgresadosRouter } from '../egresados/egresados.router';
import { HabilidadesRouter } from '../habilidades/habilidades.router';
import { NotificacionesRouter } from '../notificaciones/notificaciones.router';
import { OfertasRouter } from '../ofertas/ofertas.router';
import { PostulacionesRouter } from '../postulaciones/postulaciones.router';
import { ReportesRouter } from '../reportes/reportes.router';
import { SectoresRouter } from '../sectores/sectores.router';
import { TrpcService } from './trpc.service';

@Injectable()
export class TrpcRouter {
  readonly appRouter: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly archivosRouter: ArchivosRouter,
    private readonly carrerasRouter: CarrerasRouter,
    private readonly empresasRouter: EmpresasRouter,
    private readonly estadisticasRouter: EstadisticasRouter,
    private readonly egresadosRouter: EgresadosRouter,
    private readonly sectoresRouter: SectoresRouter,
    private readonly habilidadesRouter: HabilidadesRouter,
    private readonly notificacionesRouter: NotificacionesRouter,
    private readonly ofertasRouter: OfertasRouter,
    private readonly postulacionesRouter: PostulacionesRouter,
    private readonly reportesRouter: ReportesRouter,
  ) {
    this.appRouter = this.trpc.router({
      auth: this.trpc.router({
        me: this.trpc.protectedProcedure.query(({ ctx }) => ctx.user),
      }),
      archivos: this.archivosRouter.router,
      carreras: this.carrerasRouter.router,
      empresas: this.empresasRouter.router,
      estadisticas: this.estadisticasRouter.router,
      egresados: this.egresadosRouter.router,
      health: this.trpc.router({
        check: this.trpc.publicProcedure.query(() => ({
          status: 'ok',
          transport: 'trpc',
          timestamp: new Date().toISOString(),
        })),
      }),
      habilidades: this.habilidadesRouter.router,
      notificaciones: this.notificacionesRouter.router,
      ofertas: this.ofertasRouter.router,
      postulaciones: this.postulacionesRouter.router,
      reportes: this.reportesRouter.router,
      sectores: this.sectoresRouter.router,
    });
  }
}

export type AppRouter = TrpcRouter['appRouter'];
