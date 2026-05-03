import { CategoriaArchivo } from '@graduate-employment-management/database';
import { z } from 'zod';

export const getArchivoByIdSchema = z.object({
  id: z.string().uuid(),
});

export const misArchivosSchema = z.object({
  categoria: z.nativeEnum(CategoriaArchivo).optional(),
});

export type GetArchivoByIdInput = z.infer<typeof getArchivoByIdSchema>;
export type MisArchivosInput = z.infer<typeof misArchivosSchema>;
