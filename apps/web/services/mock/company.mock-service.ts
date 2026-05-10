import { applicationStatuses, companyValidationStatuses, offerStatuses } from "@/lib/constants";
import { mockCompanyApplicants, mockCompanyOffers, mockCompanyProfile } from "@/lib/mocks";
import type {
  CompanyApplicantStatusChangeInput,
  CompanyOfferCreateInput,
  CompanyOfferUpdateInput,
  CompanyProfileUpdateInput,
} from "@/types";

export const companyMockService = {
  async getProfile() {
    return mockCompanyProfile;
  },

  async updateProfile(input: CompanyProfileUpdateInput) {
    return {
      ...mockCompanyProfile,
      ...(input.nombreComercial !== undefined
        ? { nombreComercial: input.nombreComercial }
        : {}),
      ...(input.descripcion !== undefined ? { descripcion: input.descripcion } : {}),
      ...(input.sitioWeb !== undefined ? { sitioWeb: input.sitioWeb } : {}),
      ...(input.ciudad !== undefined ? { ciudad: input.ciudad } : {}),
      ...(input.region !== undefined ? { region: input.region } : {}),
    };
  },

  async getValidationStatus() {
    return {
      status: companyValidationStatuses.approved,
      canPublishOffers: true,
      message: "Tu empresa fue aprobada y ya puede publicar ofertas.",
    };
  },

  async getOffers() {
    return mockCompanyOffers;
  },

  async getOfferById(id: string) {
    return mockCompanyOffers.find((offer) => offer.id === id) ?? null;
  },

  async createOffer(input: CompanyOfferCreateInput) {
    return {
      id: `mock-offer-${input.titulo.toLowerCase().replace(/\s+/g, "-")}`,
      job: {
        id: `mock-offer-${input.titulo.toLowerCase().replace(/\s+/g, "-")}`,
        title: input.titulo,
        company: mockCompanyProfile.nombreComercial,
        location: [input.ciudad, input.region, input.pais].filter(Boolean).join(", ") || "Ubicación no especificada",
        modality: input.modalidad,
        contractType: input.tipoContrato,
        salaryRange:
          input.salarioMin !== undefined || input.salarioMax !== undefined
            ? `S/ ${input.salarioMin ?? 0} - S/ ${input.salarioMax ?? 0}`
            : undefined,
        skills: [],
        match: 0,
        status: offerStatuses.pendingReview,
        description: input.descripcion,
        requirements: [],
        publishedDate: new Date().toISOString().slice(0, 10),
        closingDate: input.cierreEn ?? "",
      },
      status: offerStatuses.pendingReview,
      applicationsCount: 0,
      reviewingCount: 0,
      interviewCount: 0,
      hiredCount: 0,
    };
  },

  async updateOffer(input: CompanyOfferUpdateInput) {
    const existing = mockCompanyOffers.find((offer) => offer.id === input.id);

    if (!existing?.job) {
      return null;
    }

    return {
      ...existing,
      job: {
        ...existing.job,
        title: input.titulo,
        description: input.descripcion,
        modality: input.modalidad,
        contractType: input.tipoContrato,
        location: [input.ciudad, input.region, input.pais].filter(Boolean).join(", ") || existing.job.location,
        closingDate: input.cierreEn ?? existing.job.closingDate,
      },
    };
  },

  async closeOffer(id: string) {
    const existing = mockCompanyOffers.find((offer) => offer.id === id);

    if (!existing) {
      return null;
    }

    return {
      ...existing,
      status: offerStatuses.closed,
      job: existing.job
        ? {
            ...existing.job,
            status: offerStatuses.closed,
          }
        : existing.job,
    };
  },

  async getApplicantsByOfferId(offerId: string) {
    return mockCompanyApplicants.filter((applicant) => applicant.offerId === offerId);
  },

  async getApplicantById(id: string) {
    return (
      mockCompanyApplicants.find(
        (applicant) => applicant.id === id || applicant.applicationId === id,
      ) ?? null
    );
  },

  async changeApplicantStatus(input: CompanyApplicantStatusChangeInput) {
    const applicant = mockCompanyApplicants.find(
      (item) => item.applicationId === input.applicationId || item.id === input.applicationId,
    );

    if (!applicant) {
      return null;
    }

    return {
      ...applicant,
      status: input.status,
      historial: [
        ...(applicant.historial ?? []),
        {
          id: `history-${input.applicationId}-${input.status}`,
          estadoAnterior: applicant.status,
          estadoNuevo: input.status,
          creadoEn: new Date().toISOString(),
        },
      ],
    };
  },

  async getApplicationHistory(applicationId: string) {
    return (
      mockCompanyApplicants.find(
        (applicant) => applicant.applicationId === applicationId || applicant.id === applicationId,
      )?.historial ?? []
    );
  },
};
