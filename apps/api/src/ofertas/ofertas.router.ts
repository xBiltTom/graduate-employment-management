import { Injectable } from '@nestjs/common';
import { RolUsuario } from '@graduate-employment-management/database';
import { requireRole, requireUser } from '../trpc/trpc-auth.util';
import { TrpcService } from '../trpc/trpc.service';
import { OfertasService } from './ofertas.service';
import {
  adminListOfertasSchema,
  adminModerarOfertaSchema,
  cerrarOfertaSchema,
  createOfertaSchema,
  deleteOfertaSchema,
  feedOfertasSchema,
  getOfertaByIdSchema,
  misOfertasSchema,
  updateOfertaSchema,
} from './schemas/ofertas.schemas';

@Injectable()
export class OfertasRouter {
  readonly router: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly ofertasService: OfertasService,
  ) {
    this.router = this.trpc.router({
      publicFeed: this.trpc.publicProcedure
        .input(feedOfertasSchema.optional().default({}))
        .query(({ input }) => {
          return this.ofertasService.publicFeed(input);
        }),
      publicGetById: this.trpc.publicProcedure
        .input(getOfertaByIdSchema)
        .query(({ input }) => {
          return this.ofertasService.publicGetById(input.id);
        }),
      feed: this.trpc.protectedProcedure
        .input(feedOfertasSchema.optional().default({}))
        .query(({ ctx, input }) => {
          const viewer = requireUser(ctx);
          return this.ofertasService.feed(input, viewer);
        }),
      getById: this.trpc.protectedProcedure
        .input(getOfertaByIdSchema)
        .query(({ ctx, input }) => {
          const viewer = requireUser(ctx);
          return this.ofertasService.getById(input.id, viewer);
        }),
      misOfertas: this.trpc.protectedProcedure
        .input(misOfertasSchema.optional().default({}))
        .query(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EMPRESA);
          return this.ofertasService.misOfertas(user.id, input);
        }),
      create: this.trpc.protectedProcedure
        .input(createOfertaSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EMPRESA);
          return this.ofertasService.create(user.id, input);
        }),
      update: this.trpc.protectedProcedure
        .input(updateOfertaSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EMPRESA);
          return this.ofertasService.update(user.id, input);
        }),
      cerrar: this.trpc.protectedProcedure
        .input(cerrarOfertaSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EMPRESA);
          return this.ofertasService.cerrar(user.id, input.id);
        }),
      delete: this.trpc.protectedProcedure
        .input(deleteOfertaSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EMPRESA);
          return this.ofertasService.delete(user.id, input.id);
        }),
      adminList: this.trpc.protectedProcedure
        .input(adminListOfertasSchema.optional().default({}))
        .query(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.ofertasService.adminList(input);
        }),
      adminModerar: this.trpc.protectedProcedure
        .input(adminModerarOfertaSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.ofertasService.adminModerar(user.id, input);
        }),
    });
  }
}
