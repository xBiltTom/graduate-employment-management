import { Injectable } from '@nestjs/common';
import { CarrerasRouter } from '../carreras/carreras.router';
import { HabilidadesRouter } from '../habilidades/habilidades.router';
import { SectoresRouter } from '../sectores/sectores.router';
import { TrpcService } from './trpc.service';

@Injectable()
export class TrpcRouter {
  readonly appRouter: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly carrerasRouter: CarrerasRouter,
    private readonly sectoresRouter: SectoresRouter,
    private readonly habilidadesRouter: HabilidadesRouter,
  ) {
    this.appRouter = this.trpc.router({
      auth: this.trpc.router({
        me: this.trpc.protectedProcedure.query(({ ctx }) => ctx.user),
      }),
      carreras: this.carrerasRouter.router,
      health: this.trpc.router({
        check: this.trpc.publicProcedure.query(() => ({
          status: 'ok',
          transport: 'trpc',
          timestamp: new Date().toISOString(),
        })),
      }),
      habilidades: this.habilidadesRouter.router,
      sectores: this.sectoresRouter.router,
    });
  }
}

export type AppRouter = TrpcRouter['appRouter'];
