import { Injectable } from '@nestjs/common';
import { RolUsuario } from '@graduate-employment-management/database';
import { TrpcService } from '../trpc/trpc.service';
import { requireRole, requireUser } from '../trpc/trpc-auth.util';
import { EgresadosService } from './egresados.service';
import {
  addExperienciaSchema,
  addFormacionSchema,
  buscarEgresadosSchema,
  experienciaIdSchema,
  formacionIdSchema,
  getEgresadoByIdSchema,
  syncHabilidadesSchema,
  updateExperienciaSchema,
  updateFormacionSchema,
  updateMiPerfilSchema,
} from './schemas/egresados.schemas';

@Injectable()
export class EgresadosRouter {
  readonly router: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly egresadosService: EgresadosService,
  ) {
    this.router = this.trpc.router({
      getMiPerfil: this.trpc.protectedProcedure.query(({ ctx }) => {
        const user = requireRole(ctx, RolUsuario.EGRESADO);
        return this.egresadosService.getMiPerfil(user.id);
      }),
      updateMiPerfil: this.trpc.protectedProcedure
        .input(updateMiPerfilSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EGRESADO);
          return this.egresadosService.updateMiPerfil(user.id, input);
        }),
      addFormacion: this.trpc.protectedProcedure
        .input(addFormacionSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EGRESADO);
          return this.egresadosService.addFormacion(user.id, input);
        }),
      updateFormacion: this.trpc.protectedProcedure
        .input(updateFormacionSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EGRESADO);
          return this.egresadosService.updateFormacion(user.id, input);
        }),
      deleteFormacion: this.trpc.protectedProcedure
        .input(formacionIdSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EGRESADO);
          return this.egresadosService.deleteFormacion(user.id, input.id);
        }),
      addExperiencia: this.trpc.protectedProcedure
        .input(addExperienciaSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EGRESADO);
          return this.egresadosService.addExperiencia(user.id, input);
        }),
      updateExperiencia: this.trpc.protectedProcedure
        .input(updateExperienciaSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EGRESADO);
          return this.egresadosService.updateExperiencia(user.id, input);
        }),
      deleteExperiencia: this.trpc.protectedProcedure
        .input(experienciaIdSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EGRESADO);
          return this.egresadosService.deleteExperiencia(user.id, input.id);
        }),
      syncHabilidades: this.trpc.protectedProcedure
        .input(syncHabilidadesSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EGRESADO);
          return this.egresadosService.syncHabilidades(user.id, input);
        }),
      getById: this.trpc.protectedProcedure
        .input(getEgresadoByIdSchema)
        .query(({ ctx, input }) => {
          const viewer = requireUser(ctx);
          return this.egresadosService.getById(input, viewer);
        }),
      buscar: this.trpc.protectedProcedure
        .input(buscarEgresadosSchema.optional().default({}))
        .query(({ ctx, input }) => {
          const viewer = requireRole(
            ctx,
            RolUsuario.ADMINISTRADOR,
            RolUsuario.EMPRESA,
          );
          return this.egresadosService.buscar(input, viewer);
        }),
    });
  }
}
