import { z } from 'zod';

export const listarAuditoriaSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  usuarioId: z.string().uuid().optional(),
  accion: z.string().trim().min(1).max(100).optional(),
  entidad: z.string().trim().min(1).max(100).optional(),
  entidadId: z.string().trim().min(1).max(100).optional(),
  fechaDesde: z.coerce.date().optional(),
  fechaHasta: z.coerce.date().optional(),
});

export const getAuditoriaByIdSchema = z.object({
  id: z.string().uuid(),
});

export type ListarAuditoriaInput = z.infer<typeof listarAuditoriaSchema>;
export type GetAuditoriaByIdInput = z.infer<typeof getAuditoriaByIdSchema>;
