import { EstadoValidacionEmpresa } from '@graduate-employment-management/database';
import { z } from 'zod';

const trimmedString = z.string().trim();

export const updateMiPerfilEmpresaSchema = z.object({
  nombreComercial: trimmedString.min(1).optional(),
  descripcion: z.union([trimmedString.min(1), z.null()]).optional(),
  sitioWeb: z.union([trimmedString.min(1), z.null()]).optional(),
  direccion: z.union([trimmedString.min(1), z.null()]).optional(),
  ciudad: z.union([trimmedString.min(1), z.null()]).optional(),
  region: z.union([trimmedString.min(1), z.null()]).optional(),
  pais: z.union([trimmedString.min(1), z.null()]).optional(),
  sectorId: z.union([z.string().uuid(), z.null()]).optional(),
});

export const getEmpresaByIdSchema = z.object({
  id: z.string().uuid(),
});

export const listarEmpresasSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  search: trimmedString.min(1).optional(),
  estadoValidacion: z.nativeEnum(EstadoValidacionEmpresa).optional(),
  sectorId: z.string().uuid().optional(),
  ciudad: trimmedString.min(1).optional(),
  region: trimmedString.min(1).optional(),
});

export const validarEmpresaSchema = z
  .object({
    empresaId: z.string().uuid(),
    decision: z.enum([
      EstadoValidacionEmpresa.APROBADA,
      EstadoValidacionEmpresa.RECHAZADA,
    ]),
    motivoRechazo: z.union([trimmedString.min(1), z.null()]).optional(),
  })
  .superRefine((input, ctx) => {
    if (
      input.decision === EstadoValidacionEmpresa.RECHAZADA &&
      !input.motivoRechazo?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El motivo de rechazo es obligatorio',
        path: ['motivoRechazo'],
      });
    }
  });

export type UpdateMiPerfilEmpresaInput = z.infer<
  typeof updateMiPerfilEmpresaSchema
>;
export type GetEmpresaByIdInput = z.infer<typeof getEmpresaByIdSchema>;
export type ListarEmpresasInput = z.infer<typeof listarEmpresasSchema>;
export type ValidarEmpresaInput = z.infer<typeof validarEmpresaSchema>;
