import { Injectable } from '@nestjs/common';
import { CarrerasRouter } from '../carreras/carreras.router';
import { EmpresasRouter } from '../empresas/empresas.router';
import { EgresadosRouter } from '../egresados/egresados.router';
import { HabilidadesRouter } from '../habilidades/habilidades.router';
import { OfertasRouter } from '../ofertas/ofertas.router';
import { PostulacionesRouter } from '../postulaciones/postulaciones.router';
import { SectoresRouter } from '../sectores/sectores.router';
import { TrpcService } from './trpc.service';

@Injectable()
export class TrpcRouter {
  readonly appRouter: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly carrerasRouter: CarrerasRouter,
    private readonly empresasRouter: EmpresasRouter,
    private readonly egresadosRouter: EgresadosRouter,
    private readonly sectoresRouter: SectoresRouter,
    private readonly habilidadesRouter: HabilidadesRouter,
    private readonly ofertasRouter: OfertasRouter,
    private readonly postulacionesRouter: PostulacionesRouter,
  ) {
    this.appRouter = this.trpc.router({
      auth: this.trpc.router({
        me: this.trpc.protectedProcedure.query(({ ctx }) => ctx.user),
      }),
      carreras: this.carrerasRouter.router,
      empresas: this.empresasRouter.router,
      egresados: this.egresadosRouter.router,
      health: this.trpc.router({
        check: this.trpc.publicProcedure.query(() => ({
          status: 'ok',
          transport: 'trpc',
          timestamp: new Date().toISOString(),
        })),
      }),
      habilidades: this.habilidadesRouter.router,
      ofertas: this.ofertasRouter.router,
      postulaciones: this.postulacionesRouter.router,
      sectores: this.sectoresRouter.router,
    });
  }
}

export type AppRouter = TrpcRouter['appRouter'];
