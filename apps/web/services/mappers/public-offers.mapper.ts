import { contractTypes, offerModalities, offerStatuses } from "@/lib/constants";
import type { ContractType, JobSummary, OfferModality, OfferStatus } from "@/types";

type BackendOfferSkill = {
  habilidad?: {
    nombre?: string | null;
  } | null;
};

type BackendOfferCompany = {
  nombreComercial?: string | null;
};

export type BackendPublicOffer = {
  id: string;
  titulo: string;
  descripcion?: string | null;
  modalidad?: string | null;
  tipoContrato?: string | null;
  salarioMin?: string | number | null;
  salarioMax?: string | number | null;
  pais?: string | null;
  region?: string | null;
  ciudad?: string | null;
  distrito?: string | null;
  estado?: string | null;
  publicadoEn?: string | null;
  cierreEn?: string | null;
  empresa?: BackendOfferCompany | null;
  habilidades?: BackendOfferSkill[];
};

function mapModality(value?: string | null): OfferModality {
  switch (value) {
    case offerModalities.remote:
      return offerModalities.remote;
    case offerModalities.onsite:
      return offerModalities.onsite;
    case offerModalities.hybrid:
    default:
      return offerModalities.hybrid;
  }
}

function mapContractType(value?: string | null): ContractType {
  switch (value) {
    case contractTypes.partTime:
      return contractTypes.partTime;
    case contractTypes.project:
      return contractTypes.project;
    case contractTypes.internship:
      return contractTypes.internship;
    case contractTypes.fullTime:
    default:
      return contractTypes.fullTime;
  }
}

function mapOfferStatus(value?: string | null): OfferStatus {
  switch (value) {
    case offerStatuses.draft:
      return offerStatuses.draft;
    case offerStatuses.pendingReview:
      return offerStatuses.pendingReview;
    case offerStatuses.approved:
      return offerStatuses.approved;
    case offerStatuses.rejected:
      return offerStatuses.rejected;
    case offerStatuses.closed:
      return offerStatuses.closed;
    case offerStatuses.expired:
      return offerStatuses.expired;
    case offerStatuses.active:
    default:
      return offerStatuses.active;
  }
}

function formatSalaryRange(min?: string | number | null, max?: string | number | null) {
  if (min == null && max == null) {
    return undefined;
  }

  const formatValue = (value: string | number) => {
    const parsed = typeof value === "number" ? value : Number(value);

    if (Number.isNaN(parsed)) {
      return undefined;
    }

    return `S/ ${parsed.toLocaleString("es-PE")}`;
  };

  const minFormatted = min != null ? formatValue(min) : undefined;
  const maxFormatted = max != null ? formatValue(max) : undefined;

  if (minFormatted && maxFormatted) {
    return `${minFormatted} - ${maxFormatted}`;
  }

  return minFormatted ?? maxFormatted;
}

export function mapBackendOfferToJobSummary(offer: BackendPublicOffer): JobSummary {
  const locationParts = [offer.ciudad, offer.region, offer.pais].filter(Boolean);

  return {
    id: offer.id,
    title: offer.titulo,
    company: offer.empresa?.nombreComercial ?? "Empresa no especificada",
    location: locationParts.length ? locationParts.join(", ") : "Ubicación no especificada",
    modality: mapModality(offer.modalidad),
    contractType: mapContractType(offer.tipoContrato),
    salaryRange: formatSalaryRange(offer.salarioMin, offer.salarioMax),
    skills:
      offer.habilidades
        ?.map((item) => item.habilidad?.nombre)
        .filter((skill): skill is string => Boolean(skill)) ?? [],
    match: 0,
    status: mapOfferStatus(offer.estado),
    description: offer.descripcion ?? "Sin descripción disponible.",
    requirements: [],
    publishedDate: offer.publicadoEn ?? "",
    closingDate: offer.cierreEn ?? "",
  };
}
