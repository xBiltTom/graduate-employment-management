import { Injectable } from '@nestjs/common';
import { requireUser } from '../trpc/trpc-auth.util';
import { TrpcService } from '../trpc/trpc.service';
import {
  getReporteByIdSchema,
  misReportesSchema,
  reintentarReporteSchema,
  solicitarReporteSchema,
} from './schemas/reportes.schemas';
import { ReportesService } from './reportes.service';

@Injectable()
export class ReportesRouter {
  readonly router: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly reportesService: ReportesService,
  ) {
    this.router = this.trpc.router({
      solicitar: this.trpc.protectedProcedure
        .input(solicitarReporteSchema)
        .mutation(({ ctx, input }) => {
          const user = requireUser(ctx);
          return this.reportesService.solicitar(user, input);
        }),
      misReportes: this.trpc.protectedProcedure
        .input(misReportesSchema.optional().default({}))
        .query(({ ctx, input }) => {
          const user = requireUser(ctx);
          return this.reportesService.misReportes(user.id, input);
        }),
      getById: this.trpc.protectedProcedure
        .input(getReporteByIdSchema)
        .query(({ ctx, input }) => {
          const user = requireUser(ctx);
          return this.reportesService.getById(user, input.id);
        }),
      reintentar: this.trpc.protectedProcedure
        .input(reintentarReporteSchema)
        .mutation(({ ctx, input }) => {
          const user = requireUser(ctx);
          return this.reportesService.reintentar(user, input.id);
        }),
    });
  }
}
