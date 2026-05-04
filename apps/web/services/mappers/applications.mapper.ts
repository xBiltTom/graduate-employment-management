import { applicationStatuses } from "@/lib/constants";
import { mapBackendOfferToJobSummary, type BackendPublicOffer } from "@/services/mappers/public-offers.mapper";
import type { ApplicationHistoryEntry, GraduateApplication } from "@/types";

type BackendApplicationOffer = BackendPublicOffer;

export type BackendApplication = {
  id: string;
  estado: string;
  postuladoEn?: string | null;
  creadoEn?: string | null;
  oferta?: BackendApplicationOffer | null;
};

export type BackendApplicationHistory = {
  id: string;
  estadoAnterior?: string | null;
  estadoNuevo: string;
  creadoEn?: string | null;
};

function mapApplicationStatus(value?: string | null): GraduateApplication["status"] {
  switch (value) {
    case applicationStatuses.reviewing:
      return applicationStatuses.reviewing;
    case applicationStatuses.interview:
      return applicationStatuses.interview;
    case applicationStatuses.hired:
      return applicationStatuses.hired;
    case applicationStatuses.rejected:
      return applicationStatuses.rejected;
    case applicationStatuses.applied:
    default:
      return applicationStatuses.applied;
  }
}

export function mapBackendApplication(
  application: BackendApplication,
): GraduateApplication {
  return {
    id: application.id,
    jobId: application.oferta?.id ?? "",
    status: mapApplicationStatus(application.estado),
    appliedAt: application.postuladoEn ?? application.creadoEn ?? "",
    job: application.oferta
      ? mapBackendOfferToJobSummary(application.oferta)
      : undefined,
  };
}

export function mapBackendApplicationHistory(
  entry: BackendApplicationHistory,
): ApplicationHistoryEntry {
  return {
    id: entry.id,
    estadoAnterior: entry.estadoAnterior
      ? mapApplicationStatus(entry.estadoAnterior)
      : null,
    estadoNuevo: mapApplicationStatus(entry.estadoNuevo),
    creadoEn: entry.creadoEn ?? "",
  };
}
