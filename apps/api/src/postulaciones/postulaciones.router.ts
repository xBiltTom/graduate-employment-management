import { Injectable } from '@nestjs/common';
import { RolUsuario } from '@graduate-employment-management/database';
import { requireRole, requireUser } from '../trpc/trpc-auth.util';
import { TrpcService } from '../trpc/trpc.service';
import { PostulacionesService } from './postulaciones.service';
import {
  adminListPostulacionesSchema,
  cambiarEstadoPostulacionSchema,
  getPostulacionByIdSchema,
  historialPostulacionSchema,
  misPostulacionesSchema,
  postularSchema,
  postulantesPorOfertaSchema,
} from './schemas/postulaciones.schemas';

@Injectable()
export class PostulacionesRouter {
  readonly router: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly postulacionesService: PostulacionesService,
  ) {
    this.router = this.trpc.router({
      postular: this.trpc.protectedProcedure
        .input(postularSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EGRESADO);
          return this.postulacionesService.postular(user.id, input);
        }),
      misPostulaciones: this.trpc.protectedProcedure
        .input(misPostulacionesSchema.optional().default({}))
        .query(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EGRESADO);
          return this.postulacionesService.misPostulaciones(user.id, input);
        }),
      getById: this.trpc.protectedProcedure
        .input(getPostulacionByIdSchema)
        .query(({ ctx, input }) => {
          const viewer = requireUser(ctx);
          return this.postulacionesService.getById(input.id, viewer);
        }),
      postulantesPorOferta: this.trpc.protectedProcedure
        .input(postulantesPorOfertaSchema)
        .query(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EMPRESA);
          return this.postulacionesService.postulantesPorOferta(user.id, input);
        }),
      cambiarEstado: this.trpc.protectedProcedure
        .input(cambiarEstadoPostulacionSchema)
        .mutation(({ ctx, input }) => {
          const actor = requireRole(
            ctx,
            RolUsuario.EMPRESA,
            RolUsuario.ADMINISTRADOR,
          );
          return this.postulacionesService.cambiarEstado(actor, input);
        }),
      historial: this.trpc.protectedProcedure
        .input(historialPostulacionSchema)
        .query(({ ctx, input }) => {
          const viewer = requireUser(ctx);
          return this.postulacionesService.historial(
            input.postulacionId,
            viewer,
          );
        }),
      adminList: this.trpc.protectedProcedure
        .input(adminListPostulacionesSchema.optional().default({}))
        .query(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.postulacionesService.adminList(input);
        }),
    });
  }
}
