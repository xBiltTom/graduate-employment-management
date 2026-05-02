import { Injectable } from '@nestjs/common';
import { initTRPC, TRPCError } from '@trpc/server';
import { TrpcContext } from './trpc.context';

@Injectable()
export class TrpcService {
  private readonly t = initTRPC.context<TrpcContext>().create();

  readonly router = this.t.router;
  readonly procedure = this.t.procedure;
  readonly publicProcedure = this.t.procedure;

  readonly protectedProcedure = this.t.procedure.use(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Autenticación requerida',
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
}
