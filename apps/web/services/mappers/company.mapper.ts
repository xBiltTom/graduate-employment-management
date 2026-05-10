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
  descripcion?: string | null;
  sitioWeb?: string | null;
  ciudad?: string | null;
  region?: string | null;
  pais?: string | null;
  estadoValidacion?: string | null;
  sector?: {
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
    case companyValidationStatuses.pending:
      return companyValidationStatuses.pending;
    case companyValidationStatuses.rejected:
      return companyValidationStatuses.rejected;
    case companyValidationStatuses.approved:
    default:
      return companyValidationStatuses.approved;
  }
}

export function mapBackendCompanyProfile(profile: BackendCompanyProfile): CompanyProfile {
  return {
    id: profile.id,
    nombreComercial: profile.nombreComercial ?? "Empresa",
    razonSocial: profile.razonSocial ?? "Razón social no especificada",
    ruc: profile.ruc ?? "",
    sector: profile.sector?.nombre ?? "Sector no especificado",
    email: profile.usuario?.email ?? "",
    sitioWeb: profile.sitioWeb ?? undefined,
    ciudad: profile.ciudad ?? undefined,
    region: profile.region ?? undefined,
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
