import {
  EstadoOferta,
  EstadoPostulacion,
  ModalidadOferta,
} from '@graduate-employment-management/database';
import { z } from 'zod';

export const dateRangeSchema = z.object({
  fechaDesde: z.coerce.date().optional(),
  fechaHasta: z.coerce.date().optional(),
});

export const adminMetricBaseSchema = dateRangeSchema.extend({
  carreraId: z.string().uuid().optional(),
  sectorId: z.string().uuid().optional(),
  ciudad: z.string().trim().min(1).optional(),
  region: z.string().trim().min(1).optional(),
  modalidad: z.nativeEnum(ModalidadOferta).optional(),
});

export const adminKpisSchema = dateRangeSchema;

export const adminOfertasVsPostulacionesSchema = dateRangeSchema.extend({
  modalidad: z.nativeEnum(ModalidadOferta).optional(),
  sectorId: z.string().uuid().optional(),
});

export const adminEgresadosPorCarreraSchema = dateRangeSchema;

export const adminDemandaHabilidadesSchema = dateRangeSchema.extend({
  modalidad: z.nativeEnum(ModalidadOferta).optional(),
  limit: z.number().int().positive().max(50).optional(),
});

export const adminContratacionPorCohorteSchema = z.object({
  carreraId: z.string().uuid().optional(),
});

export const adminPostulacionesPorEstadoSchema = dateRangeSchema;

export const egresadoRecomendacionesBasicasSchema = z.object({
  limit: z.number().int().positive().max(20).optional(),
});

export const empresaResumenSchema = dateRangeSchema;

export const empresaEmbudoPostulantesSchema = dateRangeSchema.extend({
  ofertaId: z.string().uuid().optional(),
});

export const empresaRendimientoOfertasSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  estado: z.nativeEnum(EstadoOferta).optional(),
});

export type DateRangeInput = z.infer<typeof dateRangeSchema>;
export type AdminKpisInput = z.infer<typeof adminKpisSchema>;
export type AdminOfertasVsPostulacionesInput = z.infer<
  typeof adminOfertasVsPostulacionesSchema
>;
export type AdminEgresadosPorCarreraInput = z.infer<
  typeof adminEgresadosPorCarreraSchema
>;
export type AdminDemandaHabilidadesInput = z.infer<
  typeof adminDemandaHabilidadesSchema
>;
export type AdminContratacionPorCohorteInput = z.infer<
  typeof adminContratacionPorCohorteSchema
>;
export type AdminPostulacionesPorEstadoInput = z.infer<
  typeof adminPostulacionesPorEstadoSchema
>;
export type EgresadoRecomendacionesBasicasInput = z.infer<
  typeof egresadoRecomendacionesBasicasSchema
>;
export type EmpresaResumenInput = z.infer<typeof empresaResumenSchema>;
export type EmpresaEmbudoPostulantesInput = z.infer<
  typeof empresaEmbudoPostulantesSchema
>;
export type EmpresaRendimientoOfertasInput = z.infer<
  typeof empresaRendimientoOfertasSchema
>;

export type EstadoPostulacionCount = {
  estado: EstadoPostulacion;
  total: number;
};
