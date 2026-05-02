import { z } from 'zod';

const trimmedString = z.string().trim();

export const carrerasListSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  search: trimmedString.min(1).optional(),
  estaActiva: z.boolean().optional(),
});

export const carreraByIdSchema = z.object({
  id: z.string().uuid(),
});

export const carreraCreateSchema = z.object({
  nombre: trimmedString.min(1),
  descripcion: trimmedString.min(1).optional(),
});

export const carreraUpdateSchema = z.object({
  id: z.string().uuid(),
  nombre: trimmedString.min(1).optional(),
  descripcion: z.union([trimmedString.min(1), z.null()]).optional(),
});

export const carreraToggleActivaSchema = z.object({
  id: z.string().uuid(),
});

export type CarrerasListInput = z.infer<typeof carrerasListSchema>;
export type CarreraByIdInput = z.infer<typeof carreraByIdSchema>;
export type CarreraCreateInput = z.infer<typeof carreraCreateSchema>;
export type CarreraUpdateInput = z.infer<typeof carreraUpdateSchema>;
export type CarreraToggleActivaInput = z.infer<
  typeof carreraToggleActivaSchema
>;
