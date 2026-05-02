import { z } from 'zod';

const trimmedString = z.string().trim();

export const sectoresListSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  search: trimmedString.min(1).optional(),
  estaActivo: z.boolean().optional(),
});

export const sectorByIdSchema = z.object({
  id: z.string().uuid(),
});

export const sectorCreateSchema = z.object({
  nombre: trimmedString.min(1),
  descripcion: trimmedString.min(1).optional(),
});

export const sectorUpdateSchema = z.object({
  id: z.string().uuid(),
  nombre: trimmedString.min(1).optional(),
  descripcion: z.union([trimmedString.min(1), z.null()]).optional(),
});

export const sectorToggleActivoSchema = z.object({
  id: z.string().uuid(),
});

export type SectoresListInput = z.infer<typeof sectoresListSchema>;
export type SectorByIdInput = z.infer<typeof sectorByIdSchema>;
export type SectorCreateInput = z.infer<typeof sectorCreateSchema>;
export type SectorUpdateInput = z.infer<typeof sectorUpdateSchema>;
export type SectorToggleActivoInput = z.infer<typeof sectorToggleActivoSchema>;
