import type { CompanyOfferSummary } from "@/types";
import {
  mapBackendOfferToJobSummary,
  type BackendPublicOffer,
} from "@/services/mappers/public-offers.mapper";

export type BackendCompanyOffer = BackendPublicOffer & {
  _count?: {
    postulaciones?: number;
  };
};

export function mapBackendCompanyOfferToSummary(
  offer: BackendCompanyOffer,
): CompanyOfferSummary {
  const job = mapBackendOfferToJobSummary(offer);

  return {
    id: offer.id,
    job,
    status: job.status,
    applicationsCount: offer._count?.postulaciones ?? 0,
    reviewingCount: 0,
    interviewCount: 0,
    hiredCount: 0,
  };
}
