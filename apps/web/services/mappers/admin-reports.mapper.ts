import type { AdminReport } from "@/types";

export type BackendAdminReport = {
  id: string;
  tipo?: string | null;
  estado?: string | null;
   parametros?: Record<string, unknown> | null;
   creadoEn?: string | null;
   nombreArchivo?: string | null;
   mensajeError?: string | null;
   downloadUrl?: string | null;
   archivo?: {
     nombreArchivo?: string | null;
   } | null;
};

export function mapBackendAdminReport(report: BackendAdminReport): AdminReport {
  return {
    id: report.id,
    type: (report.tipo as AdminReport["type"] | undefined) ?? "EMPLEABILIDAD",
    status: (report.estado as AdminReport["status"] | undefined) ?? "PENDIENTE",
    createdAt: report.creadoEn ?? "",
    fileName: report.archivo?.nombreArchivo ?? report.nombreArchivo ?? null,
    parameters: report.parametros ?? null,
    errorMessage: report.mensajeError ?? null,
    downloadUrl: report.downloadUrl ?? null,
  };
}
