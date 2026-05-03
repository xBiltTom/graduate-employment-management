import {
  EstadoOferta,
  ModalidadOferta,
  TipoContrato,
} from '@graduate-employment-management/database';
import { z } from 'zod';

const trimmedString = z.string().trim();
const optionalTrimmedNullableString = z
  .union([trimmedString.min(1), z.null()])
  .optional();
const optionalDateLikeSchema = z
  .union([z.string(), z.date(), z.null()])
  .optional();

export const feedOfertasSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  search: trimmedString.min(1).optional(),
  modalidad: z.nativeEnum(ModalidadOferta).optional(),
  tipoContrato: z.nativeEnum(TipoContrato).optional(),
  ciudad: trimmedString.min(1).optional(),
  region: trimmedString.min(1).optional(),
  pais: trimmedString.min(1).optional(),
  salarioMin: z.number().nonnegative().optional(),
  salarioMax: z.number().nonnegative().optional(),
  habilidadIds: z.array(z.string().uuid()).optional(),
});

export const getOfertaByIdSchema = z.object({
  id: z.string().uuid(),
});

export const misOfertasSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  estado: z.nativeEnum(EstadoOferta).optional(),
  search: trimmedString.min(1).optional(),
});

export const createOfertaSchema = z.object({
  titulo: trimmedString.min(1),
  descripcion: trimmedString.min(1),
  modalidad: z.nativeEnum(ModalidadOferta),
  tipoContrato: z.nativeEnum(TipoContrato),
  ciudad: optionalTrimmedNullableString,
  region: optionalTrimmedNullableString,
  pais: optionalTrimmedNullableString,
  salarioMin: z.number().nonnegative().nullable().optional(),
  salarioMax: z.number().nonnegative().nullable().optional(),
  cierreEn: optionalDateLikeSchema,
  habilidadIds: z.array(z.string().uuid()).optional(),
});

export const updateOfertaSchema = z.object({
  id: z.string().uuid(),
  titulo: trimmedString.min(1).optional(),
  descripcion: trimmedString.min(1).optional(),
  modalidad: z.nativeEnum(ModalidadOferta).optional(),
  tipoContrato: z.nativeEnum(TipoContrato).optional(),
  ciudad: optionalTrimmedNullableString,
  region: optionalTrimmedNullableString,
  pais: optionalTrimmedNullableString,
  salarioMin: z.number().nonnegative().nullable().optional(),
  salarioMax: z.number().nonnegative().nullable().optional(),
  cierreEn: optionalDateLikeSchema,
  habilidadIds: z.array(z.string().uuid()).optional(),
});

export const cerrarOfertaSchema = z.object({
  id: z.string().uuid(),
});

export const deleteOfertaSchema = z.object({
  id: z.string().uuid(),
});

export const adminListOfertasSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  search: trimmedString.min(1).optional(),
  estado: z.nativeEnum(EstadoOferta).optional(),
  empresaId: z.string().uuid().optional(),
  modalidad: z.nativeEnum(ModalidadOferta).optional(),
  tipoContrato: z.nativeEnum(TipoContrato).optional(),
  ciudad: trimmedString.min(1).optional(),
  region: trimmedString.min(1).optional(),
});

export const adminModerarOfertaSchema = z.object({
  id: z.string().uuid(),
  decision: z.enum(['APROBAR', 'RECHAZAR']),
  motivoRechazo: z.union([trimmedString.min(1), z.null()]).optional(),
});

export type FeedOfertasInput = z.infer<typeof feedOfertasSchema>;
export type GetOfertaByIdInput = z.infer<typeof getOfertaByIdSchema>;
export type MisOfertasInput = z.infer<typeof misOfertasSchema>;
export type CreateOfertaInput = z.infer<typeof createOfertaSchema>;
export type UpdateOfertaInput = z.infer<typeof updateOfertaSchema>;
export type CerrarOfertaInput = z.infer<typeof cerrarOfertaSchema>;
export type DeleteOfertaInput = z.infer<typeof deleteOfertaSchema>;
export type AdminListOfertasInput = z.infer<typeof adminListOfertasSchema>;
export type AdminModerarOfertaInput = z.infer<typeof adminModerarOfertaSchema>;
