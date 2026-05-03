import { Injectable } from '@nestjs/common';
import { RolUsuario } from '@graduate-employment-management/database';
import { requireRole, requireUser } from '../trpc/trpc-auth.util';
import { TrpcService } from '../trpc/trpc.service';
import { NotificacionesService } from './notificaciones.service';
import {
  adminCrearSistemaSchema,
  getNotificacionByIdSchema,
  marcarLeidaSchema,
  misNotificacionesSchema,
} from './schemas/notificaciones.schemas';

@Injectable()
export class NotificacionesRouter {
  readonly router: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly notificacionesService: NotificacionesService,
  ) {
    this.router = this.trpc.router({
      misNotificaciones: this.trpc.protectedProcedure
        .input(misNotificacionesSchema.optional().default({}))
        .query(({ ctx, input }) => {
          const user = requireUser(ctx);
          return this.notificacionesService.misNotificaciones(user.id, input);
        }),
      noLeidasCount: this.trpc.protectedProcedure.query(({ ctx }) => {
        const user = requireUser(ctx);
        return this.notificacionesService.noLeidasCount(user.id);
      }),
      getById: this.trpc.protectedProcedure
        .input(getNotificacionByIdSchema)
        .query(({ ctx, input }) => {
          const user = requireUser(ctx);
          return this.notificacionesService.getById(user.id, input.id);
        }),
      marcarLeida: this.trpc.protectedProcedure
        .input(marcarLeidaSchema)
        .mutation(({ ctx, input }) => {
          const user = requireUser(ctx);
          return this.notificacionesService.marcarLeida(user.id, input.id);
        }),
      marcarTodasLeidas: this.trpc.protectedProcedure.mutation(({ ctx }) => {
        const user = requireUser(ctx);
        return this.notificacionesService.marcarTodasLeidas(user.id);
      }),
      adminCrearSistema: this.trpc.protectedProcedure
        .input(adminCrearSistemaSchema)
        .mutation(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.notificacionesService.adminCrearSistema(input);
        }),
    });
  }
}
