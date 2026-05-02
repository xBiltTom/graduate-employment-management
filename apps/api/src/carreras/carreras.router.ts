import { Injectable } from '@nestjs/common';
import { RolUsuario } from '@graduate-employment-management/database';
import { TrpcService } from '../trpc/trpc.service';
import { requireRole } from '../trpc/trpc-auth.util';
import { CarrerasService } from './carreras.service';
import {
  carreraByIdSchema,
  carreraCreateSchema,
  carrerasListSchema,
  carreraToggleActivaSchema,
  carreraUpdateSchema,
} from './schemas/carreras.schemas';

@Injectable()
export class CarrerasRouter {
  readonly router: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly carrerasService: CarrerasService,
  ) {
    this.router = this.trpc.router({
      list: this.trpc.publicProcedure
        .input(carrerasListSchema.optional().default({}))
        .query(({ input }) => this.carrerasService.list(input)),
      getById: this.trpc.publicProcedure
        .input(carreraByIdSchema)
        .query(({ input }) => this.carrerasService.getById(input)),
      create: this.trpc.protectedProcedure
        .input(carreraCreateSchema)
        .mutation(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.carrerasService.create(input);
        }),
      update: this.trpc.protectedProcedure
        .input(carreraUpdateSchema)
        .mutation(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.carrerasService.update(input);
        }),
      toggleActiva: this.trpc.protectedProcedure
        .input(carreraToggleActivaSchema)
        .mutation(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.carrerasService.toggleActiva(input);
        }),
    });
  }
}
