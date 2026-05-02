import { TipoHabilidad } from '@graduate-employment-management/database';
import { z } from 'zod';

const trimmedString = z.string().trim();

export const habilidadesListSchema = z.object({
  search: trimmedString.min(1).optional(),
  tipo: z.nativeEnum(TipoHabilidad).optional(),
  categoria: trimmedString.min(1).optional(),
});

export const habilidadByIdSchema = z.object({
  id: z.string().uuid(),
});

export const habilidadCreateSchema = z.object({
  nombre: trimmedString.min(1),
  tipo: z.nativeEnum(TipoHabilidad),
  categoria: trimmedString.min(1).optional(),
});

export const habilidadUpdateSchema = z.object({
  id: z.string().uuid(),
  nombre: trimmedString.min(1).optional(),
  tipo: z.nativeEnum(TipoHabilidad).optional(),
  categoria: z.union([trimmedString.min(1), z.null()]).optional(),
});

export const habilidadDeleteSchema = z.object({
  id: z.string().uuid(),
});

export type HabilidadesListInput = z.infer<typeof habilidadesListSchema>;
export type HabilidadByIdInput = z.infer<typeof habilidadByIdSchema>;
export type HabilidadCreateInput = z.infer<typeof habilidadCreateSchema>;
export type HabilidadUpdateInput = z.infer<typeof habilidadUpdateSchema>;
export type HabilidadDeleteInput = z.infer<typeof habilidadDeleteSchema>;
