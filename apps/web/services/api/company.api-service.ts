import { getUntypedClient } from "@trpc/client";
import { trpcClient } from "@/lib/api/trpc-client";
import type {
  CompanyApplicantStatusChangeInput,
  CompanyOfferCreateInput,
  CompanyOfferUpdateInput,
  CompanyProfileUpdateInput,
} from "@/types";
import {
  mapBackendCompanyApplicant,
  mapBackendCompanyApplicationHistory,
  type BackendCompanyApplicant,
  type BackendCompanyApplicantHistory,
} from "@/services/mappers/company-applicants.mapper";
import {
  mapBackendCompanyOfferToSummary,
  type BackendCompanyOffer,
} from "@/services/mappers/company-offers.mapper";
import {
  mapBackendCompanyProfile,
  mapBackendCompanyValidationState,
  type BackendCompanyProfile,
  type BackendCompanyValidationState,
} from "@/services/mappers/company.mapper";

type PaginatedResponse<T> = {
  data?: T[];
  meta?: unknown;
};

const untypedTrpcClient = getUntypedClient(trpcClient);

function getItems<T>(response: unknown) {
  const payload = response as PaginatedResponse<T>;
  return Array.isArray(payload) ? payload : (payload.data ?? []);
}

function normalizeText(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeNullableText(value?: string) {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export const companyApiService = {
  async getProfile() {
    const response = await untypedTrpcClient.query("empresas.getMiPerfil");
    return mapBackendCompanyProfile(response as BackendCompanyProfile);
  },

  async updateProfile(input: CompanyProfileUpdateInput) {
    const response = await untypedTrpcClient.mutation("empresas.updateMiPerfil", {
      ...(input.nombreComercial !== undefined
        ? { nombreComercial: normalizeText(input.nombreComercial) }
        : {}),
      ...(input.descripcion !== undefined
        ? { descripcion: normalizeNullableText(input.descripcion) }
        : {}),
      ...(input.sitioWeb !== undefined
        ? { sitioWeb: normalizeNullableText(input.sitioWeb) }
        : {}),
      ...(input.ciudad !== undefined ? { ciudad: normalizeNullableText(input.ciudad) } : {}),
      ...(input.region !== undefined ? { region: normalizeNullableText(input.region) } : {}),
      ...(input.pais !== undefined ? { pais: normalizeNullableText(input.pais) } : {}),
    });

    return mapBackendCompanyProfile(response as BackendCompanyProfile);
  },

  async getValidationStatus() {
    const response = await untypedTrpcClient.query("empresas.getEstadoValidacion");
    return mapBackendCompanyValidationState(response as BackendCompanyValidationState);
  },

  async getOffers() {
    const response = await untypedTrpcClient.query("ofertas.misOfertas", {
      page: 1,
      limit: 50,
    });

    return getItems<BackendCompanyOffer>(response).map(mapBackendCompanyOfferToSummary);
  },

  async getOfferById(id: string) {
    const response = await untypedTrpcClient.query("ofertas.getById", { id });

    if (!response) {
      return null;
    }

    return mapBackendCompanyOfferToSummary(response as BackendCompanyOffer);
  },

  async createOffer(input: CompanyOfferCreateInput) {
    const response = await untypedTrpcClient.mutation("ofertas.create", {
      titulo: input.titulo.trim(),
      descripcion: input.descripcion.trim(),
      modalidad: input.modalidad,
      tipoContrato: input.tipoContrato,
      ciudad: normalizeNullableText(input.ciudad),
      region: normalizeNullableText(input.region),
      pais: normalizeNullableText(input.pais),
      salarioMin: input.salarioMin ?? null,
      salarioMax: input.salarioMax ?? null,
      cierreEn: input.cierreEn ? new Date(input.cierreEn).toISOString() : null,
      habilidadIds: input.habilidadIds ?? [],
    });

    return mapBackendCompanyOfferToSummary(response as BackendCompanyOffer);
  },

  async updateOffer(input: CompanyOfferUpdateInput) {
    const response = await untypedTrpcClient.mutation("ofertas.update", {
      id: input.id,
      titulo: input.titulo.trim(),
      descripcion: input.descripcion.trim(),
      modalidad: input.modalidad,
      tipoContrato: input.tipoContrato,
      ciudad: normalizeNullableText(input.ciudad),
      region: normalizeNullableText(input.region),
      pais: normalizeNullableText(input.pais),
      salarioMin: input.salarioMin ?? null,
      salarioMax: input.salarioMax ?? null,
      cierreEn: input.cierreEn ? new Date(input.cierreEn).toISOString() : null,
      habilidadIds: input.habilidadIds ?? [],
    });

    return mapBackendCompanyOfferToSummary(response as BackendCompanyOffer);
  },

  async closeOffer(id: string) {
    const response = await untypedTrpcClient.mutation("ofertas.cerrar", { id });
    return mapBackendCompanyOfferToSummary(response as BackendCompanyOffer);
  },

  async getApplicantsByOfferId(offerId: string) {
    const response = await untypedTrpcClient.query("postulaciones.postulantesPorOferta", {
      ofertaId: offerId,
      page: 1,
      limit: 100,
    });

    return getItems<BackendCompanyApplicant>(response).map(mapBackendCompanyApplicant);
  },

  async getApplicantById(id: string) {
    const response = await untypedTrpcClient.query("postulaciones.getById", { id });

    if (!response) {
      return null;
    }

    return mapBackendCompanyApplicant(response as BackendCompanyApplicant);
  },

  async changeApplicantStatus(input: CompanyApplicantStatusChangeInput) {
    const response = await untypedTrpcClient.mutation("postulaciones.cambiarEstado", {
      postulacionId: input.applicationId,
      nuevoEstado: input.status,
      ...(input.reason !== undefined ? { motivo: normalizeNullableText(input.reason) } : {}),
    });

    return mapBackendCompanyApplicant(response as BackendCompanyApplicant);
  },

  async getApplicationHistory(applicationId: string) {
    const response = await untypedTrpcClient.query("postulaciones.historial", {
      postulacionId: applicationId,
    });

    return (response as BackendCompanyApplicantHistory[]).map(
      mapBackendCompanyApplicationHistory,
    );
  },
};
