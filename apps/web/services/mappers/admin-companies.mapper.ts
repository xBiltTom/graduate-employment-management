import type { AdminCompany } from "@/types";
import { mapCompanyValidationStatus } from "@/services/mappers/company.mapper";

export type BackendAdminCompany = {
  id: string;
  nombreComercial?: string | null;
  razonSocial?: string | null;
  ruc?: string | null;
  descripcion?: string | null;
  sitioWeb?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  region?: string | null;
  pais?: string | null;
  estadoValidacion?: string | null;
  validadoEn?: string | null;
  motivoRechazo?: string | null;
  creadoEn?: string | null;
  usuario?: {
    email?: string | null;
  } | null;
  sector?: {
    id?: string | null;
    nombre?: string | null;
  } | null;
};

export function mapBackendAdminCompany(
  company: BackendAdminCompany,
  offersCount = 0,
): AdminCompany {
  return {
    id: company.id,
    nombreComercial: company.nombreComercial ?? "Empresa",
    razonSocial: company.razonSocial ?? "Razón social no especificada",
    ruc: company.ruc ?? "",
    sector: company.sector?.nombre ?? "Sector no especificado",
    email: company.usuario?.email ?? "",
    sitioWeb: company.sitioWeb ?? undefined,
    ciudad: company.ciudad ?? undefined,
    region: company.region ?? undefined,
    descripcion: company.descripcion ?? undefined,
    estadoValidacion: mapCompanyValidationStatus(company.estadoValidacion),
    ofertasPublicadas: offersCount,
    fechaRegistro: company.creadoEn ?? "",
    motivoRechazo: company.motivoRechazo ?? undefined,
    validadoEn: company.validadoEn ?? undefined,
  };
}
