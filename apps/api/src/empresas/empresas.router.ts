import { Injectable } from '@nestjs/common';
import { RolUsuario } from '@graduate-employment-management/database';
import { requireRole, requireUser } from '../trpc/trpc-auth.util';
import { TrpcService } from '../trpc/trpc.service';
import { EmpresasService } from './empresas.service';
import {
  getEmpresaByIdSchema,
  listarEmpresasSchema,
  updateMiPerfilEmpresaSchema,
  validarEmpresaSchema,
} from './schemas/empresas.schemas';

@Injectable()
export class EmpresasRouter {
  readonly router: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly empresasService: EmpresasService,
  ) {
    this.router = this.trpc.router({
      getMiPerfil: this.trpc.protectedProcedure.query(({ ctx }) => {
        const user = requireRole(ctx, RolUsuario.EMPRESA);
        return this.empresasService.getMiPerfil(user.id);
      }),
      updateMiPerfil: this.trpc.protectedProcedure
        .input(updateMiPerfilEmpresaSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EMPRESA);
          return this.empresasService.updateMiPerfil(user.id, input);
        }),
      getById: this.trpc.protectedProcedure
        .input(getEmpresaByIdSchema)
        .query(({ ctx, input }) => {
          const viewer = requireUser(ctx);
          return this.empresasService.getById(input, viewer);
        }),
      listar: this.trpc.protectedProcedure
        .input(listarEmpresasSchema.optional().default({}))
        .query(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.empresasService.listar(input);
        }),
      validar: this.trpc.protectedProcedure
        .input(validarEmpresaSchema)
        .mutation(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.empresasService.validar(user.id, input);
        }),
      getEstadoValidacion: this.trpc.protectedProcedure.query(({ ctx }) => {
        const user = requireRole(ctx, RolUsuario.EMPRESA);
        return this.empresasService.getEstadoValidacion(user.id);
      }),
    });
  }
}
