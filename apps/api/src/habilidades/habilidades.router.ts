import { Injectable } from '@nestjs/common';
import { RolUsuario } from '@graduate-employment-management/database';
import { TrpcService } from '../trpc/trpc.service';
import { requireRole } from '../trpc/trpc-auth.util';
import { HabilidadesService } from './habilidades.service';
import {
  habilidadByIdSchema,
  habilidadCreateSchema,
  habilidadDeleteSchema,
  habilidadesListSchema,
  habilidadUpdateSchema,
} from './schemas/habilidades.schemas';

@Injectable()
export class HabilidadesRouter {
  readonly router: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly habilidadesService: HabilidadesService,
  ) {
    this.router = this.trpc.router({
      list: this.trpc.publicProcedure
        .input(habilidadesListSchema.optional().default({}))
        .query(({ input }) => this.habilidadesService.list(input)),
      getById: this.trpc.publicProcedure
        .input(habilidadByIdSchema)
        .query(({ input }) => this.habilidadesService.getById(input)),
      create: this.trpc.protectedProcedure
        .input(habilidadCreateSchema)
        .mutation(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.habilidadesService.create(input);
        }),
      update: this.trpc.protectedProcedure
        .input(habilidadUpdateSchema)
        .mutation(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.habilidadesService.update(input);
        }),
      delete: this.trpc.protectedProcedure
        .input(habilidadDeleteSchema)
        .mutation(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.habilidadesService.delete(input);
        }),
    });
  }
}
