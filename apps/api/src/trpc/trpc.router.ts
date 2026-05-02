import { Injectable } from '@nestjs/common';
import { TrpcService } from './trpc.service';

@Injectable()
export class TrpcRouter {
  readonly appRouter;

  constructor(private readonly trpc: TrpcService) {
    this.appRouter = this.trpc.router({
      auth: this.trpc.router({
        me: this.trpc.protectedProcedure.query(({ ctx }) => ctx.user),
      }),
      health: this.trpc.router({
        check: this.trpc.publicProcedure.query(() => ({
          status: 'ok',
          transport: 'trpc',
          timestamp: new Date().toISOString(),
        })),
      }),
    });
  }
}

export type AppRouter = TrpcRouter['appRouter'];
