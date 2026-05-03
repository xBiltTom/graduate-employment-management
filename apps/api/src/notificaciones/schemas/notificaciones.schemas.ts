import { TipoNotificacion } from '@graduate-employment-management/database';
import { z } from 'zod';

export const misNotificacionesSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  leida: z.boolean().optional(),
  tipo: z.nativeEnum(TipoNotificacion).optional(),
});

export const getNotificacionByIdSchema = z.object({
  id: z.string().uuid(),
});

export const marcarLeidaSchema = z.object({
  id: z.string().uuid(),
});

export const adminCrearSistemaSchema = z.object({
  usuarioId: z.string().uuid(),
  titulo: z.string().trim().min(1),
  contenido: z.string().trim().min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type MisNotificacionesInput = z.infer<typeof misNotificacionesSchema>;
export type GetNotificacionByIdInput = z.infer<
  typeof getNotificacionByIdSchema
>;
export type MarcarLeidaInput = z.infer<typeof marcarLeidaSchema>;
export type AdminCrearSistemaInput = z.infer<typeof adminCrearSistemaSchema>;
