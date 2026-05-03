import { EstadoPostulacion } from '@graduate-employment-management/database';
import { z } from 'zod';

const trimmedString = z.string().trim();
const optionalDateLikeSchema = z.union([z.string(), z.date()]).optional();

export const postularSchema = z.object({
  ofertaId: z.string().uuid(),
  mensaje: z.union([trimmedString.min(1), z.null()]).optional(),
});

export const misPostulacionesSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  estado: z.nativeEnum(EstadoPostulacion).optional(),
});

export const getPostulacionByIdSchema = z.object({
  id: z.string().uuid(),
});

export const postulantesPorOfertaSchema = z.object({
  ofertaId: z.string().uuid(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  estado: z.nativeEnum(EstadoPostulacion).optional(),
});

export const cambiarEstadoPostulacionSchema = z.object({
  postulacionId: z.string().uuid(),
  nuevoEstado: z.nativeEnum(EstadoPostulacion),
  motivo: z.union([trimmedString.min(1), z.null()]).optional(),
});

export const historialPostulacionSchema = z.object({
  postulacionId: z.string().uuid(),
});

export const adminListPostulacionesSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  estado: z.nativeEnum(EstadoPostulacion).optional(),
  ofertaId: z.string().uuid().optional(),
  egresadoId: z.string().uuid().optional(),
  empresaId: z.string().uuid().optional(),
  fechaDesde: optionalDateLikeSchema,
  fechaHasta: optionalDateLikeSchema,
});

export type PostularInput = z.infer<typeof postularSchema>;
export type MisPostulacionesInput = z.infer<typeof misPostulacionesSchema>;
export type GetPostulacionByIdInput = z.infer<typeof getPostulacionByIdSchema>;
export type PostulantesPorOfertaInput = z.infer<
  typeof postulantesPorOfertaSchema
>;
export type CambiarEstadoPostulacionInput = z.infer<
  typeof cambiarEstadoPostulacionSchema
>;
export type HistorialPostulacionInput = z.infer<
  typeof historialPostulacionSchema
>;
export type AdminListPostulacionesInput = z.infer<
  typeof adminListPostulacionesSchema
>;
