import { companyValidationStatuses } from "@/lib/constants";
import type {
  CompanyProfile,
  CompanyValidationState,
  CompanyValidationStatus,
} from "@/types";

export type BackendCompanyProfile = {
  id: string;
  nombreComercial?: string | null;
  razonSocial?: string | null;
  ruc?: string | null;
  telefono?: string | null;
  descripcion?: string | null;
  sitioWeb?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  region?: string | null;
  pais?: string | null;
  estadoValidacion?: string | null;
  sector?: {
    id?: string | null;
    nombre?: string | null;
  } | null;
  usuario?: {
    email?: string | null;
  } | null;
};

export type BackendCompanyValidationState = {
  estadoValidacion?: string | null;
  puedePublicarOfertas?: boolean | null;
  mensaje?: string | null;
};

export function mapCompanyValidationStatus(value?: string | null): CompanyValidationStatus {
  switch (value) {
    case companyValidationStatuses.approved:
      return companyValidationStatuses.approved;
    case companyValidationStatuses.pending:
      return companyValidationStatuses.pending;
    case companyValidationStatuses.rejected:
      return companyValidationStatuses.rejected;
    default:
      return companyValidationStatuses.pending;
  }
}

export function mapBackendCompanyProfile(profile: BackendCompanyProfile): CompanyProfile {
  return {
    id: profile.id,
    nombreComercial: profile.nombreComercial ?? "Empresa",
    razonSocial: profile.razonSocial ?? "Razón social no especificada",
    ruc: profile.ruc ?? "",
    sectorId: profile.sector?.id ?? undefined,
    sector: profile.sector?.nombre ?? "Sector no especificado",
    email: profile.usuario?.email ?? "",
    telefono: profile.telefono ?? undefined,
    sitioWeb: profile.sitioWeb ?? undefined,
    direccion: profile.direccion ?? undefined,
    ciudad: profile.ciudad ?? undefined,
    region: profile.region ?? undefined,
    pais: profile.pais ?? undefined,
    descripcion: profile.descripcion ?? undefined,
    validationStatus: mapCompanyValidationStatus(profile.estadoValidacion),
  };
}

export function mapBackendCompanyValidationState(
  state: BackendCompanyValidationState,
): CompanyValidationState {
  return {
    status: mapCompanyValidationStatus(state.estadoValidacion),
    canPublishOffers: Boolean(state.puedePublicarOfertas),
    message: state.mensaje ?? undefined,
  };
}
