import { Injectable } from '@nestjs/common';
import { RolUsuario } from '@graduate-employment-management/database';
import { requireRole } from '../trpc/trpc-auth.util';
import { TrpcService } from '../trpc/trpc.service';
import { AuditoriaService } from './auditoria.service';
import {
  getAuditoriaByIdSchema,
  listarAuditoriaSchema,
} from './schemas/auditoria.schemas';

@Injectable()
export class AuditoriaRouter {
  readonly router: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly auditoriaService: AuditoriaService,
  ) {
    this.router = this.trpc.router({
      listar: this.trpc.protectedProcedure
        .input(listarAuditoriaSchema.optional().default({}))
        .query(({ ctx, input }) => {
          const actor = requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.auditoriaService.listar(actor, input);
        }),
      getById: this.trpc.protectedProcedure
        .input(getAuditoriaByIdSchema)
        .query(({ ctx, input }) => {
          const actor = requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.auditoriaService.getById(actor, input);
        }),
    });
  }
}
