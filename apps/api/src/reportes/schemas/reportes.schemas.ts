import {
  EstadoReporte,
  TipoReporte,
} from '@graduate-employment-management/database';
import { z } from 'zod';

export const solicitarReporteSchema = z.object({
  tipo: z.nativeEnum(TipoReporte),
  parametros: z.record(z.string(), z.unknown()).optional(),
  asincrono: z.boolean().optional(),
});

export const misReportesSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  tipo: z.nativeEnum(TipoReporte).optional(),
  estado: z.nativeEnum(EstadoReporte).optional(),
});

export const getReporteByIdSchema = z.object({
  id: z.string().uuid(),
});

export const reintentarReporteSchema = z.object({
  id: z.string().uuid(),
});

export type SolicitarReporteInput = z.infer<typeof solicitarReporteSchema>;
export type MisReportesInput = z.infer<typeof misReportesSchema>;
export type GetReporteByIdInput = z.infer<typeof getReporteByIdSchema>;
export type ReintentarReporteInput = z.infer<typeof reintentarReporteSchema>;
