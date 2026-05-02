import { Injectable } from '@nestjs/common';
import { RolUsuario } from '@graduate-employment-management/database';
import { TrpcService } from '../trpc/trpc.service';
import { requireRole } from '../trpc/trpc-auth.util';
import { SectoresService } from './sectores.service';
import {
  sectorByIdSchema,
  sectorCreateSchema,
  sectoresListSchema,
  sectorToggleActivoSchema,
  sectorUpdateSchema,
} from './schemas/sectores.schemas';

@Injectable()
export class SectoresRouter {
  readonly router: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly sectoresService: SectoresService,
  ) {
    this.router = this.trpc.router({
      list: this.trpc.publicProcedure
        .input(sectoresListSchema.optional().default({}))
        .query(({ input }) => this.sectoresService.list(input)),
      getById: this.trpc.publicProcedure
        .input(sectorByIdSchema)
        .query(({ input }) => this.sectoresService.getById(input)),
      create: this.trpc.protectedProcedure
        .input(sectorCreateSchema)
        .mutation(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.sectoresService.create(input);
        }),
      update: this.trpc.protectedProcedure
        .input(sectorUpdateSchema)
        .mutation(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.sectoresService.update(input);
        }),
      toggleActivo: this.trpc.protectedProcedure
        .input(sectorToggleActivoSchema)
        .mutation(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.sectoresService.toggleActivo(input);
        }),
    });
  }
}
