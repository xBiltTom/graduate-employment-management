import { getUntypedClient } from "@trpc/client";
import { env } from "@/lib/env";
import { applicationStatuses, companyValidationStatuses, offerStatuses } from "@/lib/constants";
import { trpcClient } from "@/lib/api/trpc-client";
import type {
  AdminApplicationsFilters,
  AdminCompanyValidationInput,
  AdminOfferModerationInput,
  AdminReportRequestInput,
  AdminSkillCreateInput,
  AdminSkillUpdateInput,
} from "@/types";
import {
  mapBackendAdminCompany,
  type BackendAdminCompany,
} from "@/services/mappers/admin-companies.mapper";
import {
  mapBackendAdminApplicationSummary,
  mapBackendAdminGraduate,
  type BackendAdminApplication,
  type BackendAdminGraduate,
} from "@/services/mappers/admin-graduates.mapper";
import {
  mapBackendAdminOffer,
  type BackendAdminOffer,
} from "@/services/mappers/admin-offers.mapper";
import {
  mapBackendAdminReport,
  type BackendAdminReport,
} from "@/services/mappers/admin-reports.mapper";
import {
  mapBackendAdminSkill,
  type BackendAdminSkill,
} from "@/services/mappers/admin-skills.mapper";

type PaginationMeta = {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

type PaginatedResponse<T> = {
  data?: T[];
  meta?: PaginationMeta;
};

const untypedTrpcClient = getUntypedClient(trpcClient);

function getItems<T>(response: unknown) {
  const payload = response as PaginatedResponse<T>;
  return Array.isArray(payload) ? payload : (payload.data ?? []);
}

function getTotal(response: unknown) {
  if (Array.isArray(response)) {
    return response.length;
  }

  const payload = response as PaginatedResponse<unknown>;
  return payload.meta?.total ?? payload.data?.length ?? 0;
}

function normalizeNullableText(value?: string) {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function buildDownloadUrl(path?: string | null) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedBaseUrl = env.apiBaseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

async function getApplicationsTotal(filters: Record<string, unknown>) {
  const response = await untypedTrpcClient.query("postulaciones.adminList", {
    page: 1,
    limit: 1,
    ...filters,
  });

  return getTotal(response);
}

async function buildSkillUsageMaps() {
  const [graduatesResponse, offersResponse] = await Promise.all([
    untypedTrpcClient.query("egresados.buscar", {
      page: 1,
      limit: 100,
    }),
    untypedTrpcClient.query("ofertas.adminList", {
      page: 1,
      limit: 100,
    }),
  ]);

  const graduateUsage = getItems<BackendAdminGraduate>(graduatesResponse).reduce<Record<string, number>>(
    (accumulator, graduate) => {
      for (const skill of graduate.habilidades ?? []) {
        const skillId = skill.habilidad?.id;

        if (!skillId) {
          continue;
        }

        accumulator[skillId] = (accumulator[skillId] ?? 0) + 1;
      }

      return accumulator;
    },
    {},
  );

  const offerUsage = getItems<BackendAdminOffer & {
    habilidades?: { habilidad?: { id?: string | null } | null }[];
  }>(offersResponse).reduce<Record<string, number>>((accumulator, offer) => {
    for (const skill of offer.habilidades ?? []) {
      const skillId = skill.habilidad?.id;

      if (!skillId) {
        continue;
      }

      accumulator[skillId] = (accumulator[skillId] ?? 0) + 1;
    }

    return accumulator;
  }, {});

  return {
    graduateUsage,
    offerUsage,
  };
}

export const adminApiService = {
  async getStats() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [
      totalGraduates,
      activeCompanies,
      pendingCompanies,
      activeOffers,
      monthlyApplications,
      totalApplications,
      hiredApplications,
    ] = await Promise.all([
      untypedTrpcClient.query("egresados.buscar", { page: 1, limit: 1 }),
      untypedTrpcClient.query("empresas.listar", {
        page: 1,
        limit: 1,
        estadoValidacion: companyValidationStatuses.approved,
      }),
      untypedTrpcClient.query("empresas.listar", {
        page: 1,
        limit: 1,
        estadoValidacion: companyValidationStatuses.pending,
      }),
      untypedTrpcClient.query("ofertas.adminList", {
        page: 1,
        limit: 1,
        estado: offerStatuses.active,
      }),
      untypedTrpcClient.query("postulaciones.adminList", {
        page: 1,
        limit: 1,
        fechaDesde: monthStart,
      }),
      untypedTrpcClient.query("postulaciones.adminList", { page: 1, limit: 1 }),
      untypedTrpcClient.query("postulaciones.adminList", {
        page: 1,
        limit: 1,
        estado: applicationStatuses.hired,
      }),
    ]);

    const totalApplicationsCount = getTotal(totalApplications);

    return {
      totalGraduates: getTotal(totalGraduates),
      activeCompanies: getTotal(activeCompanies),
      pendingCompanies: getTotal(pendingCompanies),
      activeOffers: getTotal(activeOffers),
      monthlyApplications: getTotal(monthlyApplications),
      employabilityRate:
        totalApplicationsCount > 0
          ? Math.round((getTotal(hiredApplications) / totalApplicationsCount) * 100)
          : 0,
    };
  },

  async getGraduates() {
    const [response, applicationsResponse] = await Promise.all([
      untypedTrpcClient.query("egresados.buscar", {
        page: 1,
        limit: 100,
      }),
      untypedTrpcClient.query("postulaciones.adminList", {
        page: 1,
        limit: 100,
      }),
    ]);

    const applicationsByGraduate = getItems<BackendAdminApplication & {
      egresado?: { id?: string | null } | null;
    }>(applicationsResponse).reduce<Record<string, number>>((accumulator, application) => {
      const graduateId = application.egresado?.id;

      if (!graduateId) {
        return accumulator;
      }

      accumulator[graduateId] = (accumulator[graduateId] ?? 0) + 1;
      return accumulator;
    }, {});

    return getItems<BackendAdminGraduate>(response).map((graduate) =>
      mapBackendAdminGraduate(graduate, applicationsByGraduate[graduate.id] ?? 0),
    );
  },

  async getGraduateById(id: string) {
    const [graduateResponse, applicationsCount] = await Promise.all([
      untypedTrpcClient.query("egresados.getById", { id }),
      getApplicationsTotal({ egresadoId: id }),
    ]);

    if (!graduateResponse) {
      return null;
    }

    return mapBackendAdminGraduate(
      graduateResponse as BackendAdminGraduate,
      applicationsCount,
    );
  },

  async getApplications(filters: AdminApplicationsFilters = {}) {
    const response = await untypedTrpcClient.query("postulaciones.adminList", {
      page: 1,
      limit: 100,
      ...(filters.graduateId ? { egresadoId: filters.graduateId } : {}),
      ...(filters.companyId ? { empresaId: filters.companyId } : {}),
      ...(filters.offerId ? { ofertaId: filters.offerId } : {}),
      ...(filters.status ? { estado: filters.status } : {}),
      ...(filters.from ? { fechaDesde: filters.from } : {}),
      ...(filters.to ? { fechaHasta: filters.to } : {}),
    });

    return getItems<BackendAdminApplication>(response).map(mapBackendAdminApplicationSummary);
  },

  async getCompanies() {
    const [response, offersResponse] = await Promise.all([
      untypedTrpcClient.query("empresas.listar", {
        page: 1,
        limit: 100,
      }),
      untypedTrpcClient.query("ofertas.adminList", {
        page: 1,
        limit: 100,
      }),
    ]);

    const offersByCompanyId = getItems<BackendAdminOffer & {
      empresa?: { id?: string | null } | null;
    }>(offersResponse).reduce<Record<string, number>>((accumulator, offer) => {
      const companyId = offer.empresa?.id;

      if (!companyId) {
        return accumulator;
      }

      accumulator[companyId] = (accumulator[companyId] ?? 0) + 1;
      return accumulator;
    }, {});

    return getItems<BackendAdminCompany>(response).map((company) =>
      mapBackendAdminCompany(company, offersByCompanyId[company.id] ?? 0),
    );
  },

  async getCompanyById(id: string) {
    const [companyResponse, offersResponse] = await Promise.all([
      untypedTrpcClient.query("empresas.getById", { id }),
      untypedTrpcClient.query("ofertas.adminList", {
        page: 1,
        limit: 100,
        empresaId: id,
      }),
    ]);

    if (!companyResponse) {
      return null;
    }

    return mapBackendAdminCompany(
      companyResponse as BackendAdminCompany,
      getTotal(offersResponse),
    );
  },

  async validateCompany(input: AdminCompanyValidationInput) {
    const response = await untypedTrpcClient.mutation("empresas.validar", {
      empresaId: input.companyId,
      decision: input.decision,
      ...(input.reason !== undefined
        ? { motivoRechazo: normalizeNullableText(input.reason) }
        : {}),
    });

    const offersResponse = await untypedTrpcClient.query("ofertas.adminList", {
      page: 1,
      limit: 1,
      empresaId: input.companyId,
    });

    return mapBackendAdminCompany(response as BackendAdminCompany, getTotal(offersResponse));
  },

  async getOffers() {
    const response = await untypedTrpcClient.query("ofertas.adminList", {
      page: 1,
      limit: 100,
    });

    return getItems<BackendAdminOffer>(response).map(mapBackendAdminOffer);
  },

  async getOfferById(id: string) {
    const response = await untypedTrpcClient.query("ofertas.getById", { id });

    if (!response) {
      return null;
    }

    return mapBackendAdminOffer(response as BackendAdminOffer);
  },

  async moderateOffer(input: AdminOfferModerationInput) {
    const response = await untypedTrpcClient.mutation("ofertas.adminModerar", {
      id: input.id,
      decision: input.decision,
      ...(input.reason !== undefined
        ? { motivoRechazo: normalizeNullableText(input.reason) }
        : {}),
    });

    return mapBackendAdminOffer(response as BackendAdminOffer);
  },

  async getReports() {
    const response = await untypedTrpcClient.query("reportes.misReportes", {
      page: 1,
      limit: 50,
    });

    return getItems<BackendAdminReport>(response).map((report) => {
      const mapped = mapBackendAdminReport(report);
      return {
        ...mapped,
        downloadUrl: buildDownloadUrl(mapped.downloadUrl),
      };
    });
  },

  async requestReport(input: AdminReportRequestInput) {
    const response = await untypedTrpcClient.mutation("reportes.solicitar", {
      tipo: input.type,
      parametros: input.parameters,
    });

    const mapped = mapBackendAdminReport(response as BackendAdminReport);
    return {
      ...mapped,
      downloadUrl: buildDownloadUrl(mapped.downloadUrl),
    };
  },

  async retryReport(id: string) {
    const response = await untypedTrpcClient.mutation("reportes.reintentar", { id });
    const mapped = mapBackendAdminReport(response as BackendAdminReport);

    return {
      ...mapped,
      downloadUrl: buildDownloadUrl(mapped.downloadUrl),
    };
  },

  async downloadReport(id: string) {
    const response = await untypedTrpcClient.query("reportes.getById", { id });
    const mapped = mapBackendAdminReport(response as BackendAdminReport);
    const downloadUrl = buildDownloadUrl(mapped.downloadUrl);

    if (!downloadUrl) {
      throw new Error("El reporte todavía no está disponible para descarga.");
    }

    return downloadUrl;
  },

  async getSkills() {
    const [skillsResponse, usageMaps] = await Promise.all([
      untypedTrpcClient.query("habilidades.list", {}),
      buildSkillUsageMaps(),
    ]);

    return (skillsResponse as BackendAdminSkill[]).map((skill) =>
      mapBackendAdminSkill(
        skill,
        usageMaps.graduateUsage[skill.id] ?? 0,
        usageMaps.offerUsage[skill.id] ?? 0,
      ),
    );
  },

  async createSkill(input: AdminSkillCreateInput) {
    const response = await untypedTrpcClient.mutation("habilidades.create", {
      nombre: input.name.trim(),
      tipo: input.type,
      ...(input.category ? { categoria: input.category.trim() } : {}),
    });

    return mapBackendAdminSkill(response as BackendAdminSkill, 0, 0);
  },

  async updateSkill(input: AdminSkillUpdateInput) {
    const response = await untypedTrpcClient.mutation("habilidades.update", {
      id: input.id,
      ...(input.name !== undefined ? { nombre: input.name.trim() } : {}),
      ...(input.type !== undefined ? { tipo: input.type } : {}),
      ...(input.category !== undefined
        ? { categoria: normalizeNullableText(input.category) }
        : {}),
    });

    return mapBackendAdminSkill(response as BackendAdminSkill, 0, 0);
  },

  async deleteSkill(id: string) {
    await untypedTrpcClient.mutation("habilidades.delete", { id });
  },
};
