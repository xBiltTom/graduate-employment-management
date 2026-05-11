import { NivelHabilidad } from '@graduate-employment-management/database';
import { z } from 'zod';

const trimmedString = z.string().trim();
const dateLikeSchema = z.union([z.string(), z.date(), z.null()]);

export const updateMiPerfilSchema = z.object({
  nombres: trimmedString.min(1).optional(),
  apellidos: trimmedString.min(1).optional(),
  presentacion: z.union([trimmedString.min(1), z.null()]).optional(),
  telefono: z.union([trimmedString.min(1), z.null()]).optional(),
  direccion: z.union([trimmedString.min(1), z.null()]).optional(),
  ciudad: z.union([trimmedString.min(1), z.null()]).optional(),
  region: z.union([trimmedString.min(1), z.null()]).optional(),
  pais: z.union([trimmedString.min(1), z.null()]).optional(),
  fechaNacimiento: dateLikeSchema.optional(),
  carreraId: z.union([z.string().uuid(), z.null()]).optional(),
  anioEgreso: z.number().int().nullable().optional(),
});

export const formacionIdSchema = z.object({
  id: z.string().uuid(),
});

export const addFormacionSchema = z.object({
  institucion: trimmedString.min(1),
  grado: z.union([trimmedString.min(1), z.null()]).optional(),
  campo: z.union([trimmedString.min(1), z.null()]).optional(),
  fechaInicio: dateLikeSchema.optional(),
  fechaFin: dateLikeSchema.optional(),
  esActual: z.boolean().optional(),
  descripcion: z.union([trimmedString.min(1), z.null()]).optional(),
});

export const updateFormacionSchema = formacionIdSchema.extend({
  institucion: trimmedString.min(1).optional(),
  grado: z.union([trimmedString.min(1), z.null()]).optional(),
  campo: z.union([trimmedString.min(1), z.null()]).optional(),
  fechaInicio: dateLikeSchema.optional(),
  fechaFin: dateLikeSchema.optional(),
  esActual: z.boolean().optional(),
  descripcion: z.union([trimmedString.min(1), z.null()]).optional(),
});

export const addExperienciaSchema = z.object({
  empresa: trimmedString.min(1),
  cargo: trimmedString.min(1),
  descripcion: z.union([trimmedString.min(1), z.null()]).optional(),
  fechaInicio: dateLikeSchema.optional(),
  fechaFin: dateLikeSchema.optional(),
  esActual: z.boolean().optional(),
});

export const updateExperienciaSchema = z.object({
  id: z.string().uuid(),
  empresa: trimmedString.min(1).optional(),
  cargo: trimmedString.min(1).optional(),
  descripcion: z.union([trimmedString.min(1), z.null()]).optional(),
  fechaInicio: dateLikeSchema.optional(),
  fechaFin: dateLikeSchema.optional(),
  esActual: z.boolean().optional(),
});

export const experienciaIdSchema = z.object({
  id: z.string().uuid(),
});

export const syncHabilidadesSchema = z.object({
  habilidades: z.array(
    z.object({
      habilidadId: z.string().uuid(),
      nivel: z.nativeEnum(NivelHabilidad),
    }),
  ),
});

export const getEgresadoByIdSchema = z.object({
  id: z.string().uuid(),
});

export const buscarEgresadosSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  search: trimmedString.min(1).optional(),
  carreraId: z.string().uuid().optional(),
  anioEgreso: z.number().int().optional(),
  habilidadIds: z.array(z.string().uuid()).optional(),
  ciudad: trimmedString.min(1).optional(),
  region: trimmedString.min(1).optional(),
});

export type UpdateMiPerfilInput = z.infer<typeof updateMiPerfilSchema>;
export type FormacionIdInput = z.infer<typeof formacionIdSchema>;
export type AddFormacionInput = z.infer<typeof addFormacionSchema>;
export type UpdateFormacionInput = z.infer<typeof updateFormacionSchema>;
export type AddExperienciaInput = z.infer<typeof addExperienciaSchema>;
export type UpdateExperienciaInput = z.infer<typeof updateExperienciaSchema>;
export type ExperienciaIdInput = z.infer<typeof experienciaIdSchema>;
export type SyncHabilidadesInput = z.infer<typeof syncHabilidadesSchema>;
export type GetEgresadoByIdInput = z.infer<typeof getEgresadoByIdSchema>;
export type BuscarEgresadosInput = z.infer<typeof buscarEgresadosSchema>;
