import { Injectable } from '@nestjs/common';
import { RolUsuario } from '@graduate-employment-management/database';
import { requireRole } from '../trpc/trpc-auth.util';
import { TrpcService } from '../trpc/trpc.service';
import { EstadisticasService } from './estadisticas.service';
import {
  adminContratacionPorCohorteSchema,
  adminDemandaHabilidadesSchema,
  adminEgresadosPorCarreraSchema,
  adminKpisSchema,
  adminOfertasVsPostulacionesSchema,
  adminPostulacionesPorEstadoSchema,
  egresadoRecomendacionesBasicasSchema,
  empresaEmbudoPostulantesSchema,
  empresaRendimientoOfertasSchema,
  empresaResumenSchema,
} from './schemas/estadisticas.schemas';

@Injectable()
export class EstadisticasRouter {
  readonly router: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly estadisticasService: EstadisticasService,
  ) {
    this.router = this.trpc.router({
      adminKPIs: this.trpc.protectedProcedure
        .input(adminKpisSchema.optional().default({}))
        .query(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.estadisticasService.adminKPIs(input);
        }),
      adminOfertasVsPostulaciones: this.trpc.protectedProcedure
        .input(adminOfertasVsPostulacionesSchema.optional().default({}))
        .query(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.estadisticasService.adminOfertasVsPostulaciones(input);
        }),
      adminEgresadosPorCarrera: this.trpc.protectedProcedure
        .input(adminEgresadosPorCarreraSchema.optional().default({}))
        .query(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.estadisticasService.adminEgresadosPorCarrera(input);
        }),
      adminDemandaHabilidades: this.trpc.protectedProcedure
        .input(adminDemandaHabilidadesSchema.optional().default({}))
        .query(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.estadisticasService.adminDemandaHabilidades(input);
        }),
      adminContratacionPorCohorte: this.trpc.protectedProcedure
        .input(adminContratacionPorCohorteSchema.optional().default({}))
        .query(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.estadisticasService.adminContratacionPorCohorte(input);
        }),
      adminPostulacionesPorEstado: this.trpc.protectedProcedure
        .input(adminPostulacionesPorEstadoSchema.optional().default({}))
        .query(({ ctx, input }) => {
          requireRole(ctx, RolUsuario.ADMINISTRADOR);
          return this.estadisticasService.adminPostulacionesPorEstado(input);
        }),
      egresadoResumen: this.trpc.protectedProcedure.query(({ ctx }) => {
        const user = requireRole(ctx, RolUsuario.EGRESADO);
        return this.estadisticasService.egresadoResumen(user.id);
      }),
      egresadoPostulacionesPorEstado: this.trpc.protectedProcedure.query(
        ({ ctx }) => {
          const user = requireRole(ctx, RolUsuario.EGRESADO);
          return this.estadisticasService.egresadoPostulacionesPorEstado(
            user.id,
          );
        },
      ),
      egresadoRecomendacionesBasicas: this.trpc.protectedProcedure
        .input(egresadoRecomendacionesBasicasSchema.optional().default({}))
        .query(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EGRESADO);
          return this.estadisticasService.egresadoRecomendacionesBasicas(
            user.id,
            input,
          );
        }),
      empresaResumen: this.trpc.protectedProcedure
        .input(empresaResumenSchema.optional().default({}))
        .query(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EMPRESA);
          return this.estadisticasService.empresaResumen(user.id, input);
        }),
      empresaEmbudoPostulantes: this.trpc.protectedProcedure
        .input(empresaEmbudoPostulantesSchema.optional().default({}))
        .query(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EMPRESA);
          return this.estadisticasService.empresaEmbudoPostulantes(
            user.id,
            input,
          );
        }),
      empresaRendimientoOfertas: this.trpc.protectedProcedure
        .input(empresaRendimientoOfertasSchema.optional().default({}))
        .query(({ ctx, input }) => {
          const user = requireRole(ctx, RolUsuario.EMPRESA);
          return this.estadisticasService.empresaRendimientoOfertas(
            user.id,
            input,
          );
        }),
    });
  }
}
