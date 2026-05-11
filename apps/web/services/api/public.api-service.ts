import { publicStats } from "@/lib/mocks";
import { getUntypedClient } from "@trpc/client";
import { trpcClient } from "@/lib/api/trpc-client";
import { mapBackendOfferToJobSummary, type BackendPublicOffer } from "@/services/mappers/public-offers.mapper";
import type { CatalogOption, SkillCatalogOption } from "@/types";

type BackendFeedResponse = {
  data?: BackendPublicOffer[];
  meta?: unknown;
};

type BackendCareer = {
  id: string;
  nombre?: string | null;
};

type BackendCareerListResponse = {
  data?: BackendCareer[];
};

type BackendSkill = {
  id: string;
  nombre?: string | null;
  categoria?: string | null;
  tipo?: string | null;
};

const untypedTrpcClient = getUntypedClient(trpcClient);

export const publicApiService = {
  async getFeaturedJobs() {
    try {
      const response = await untypedTrpcClient.query("ofertas.publicFeed", {
        page: 1,
        limit: 6,
      });

      const payload = response as BackendFeedResponse;
      const items = Array.isArray(payload) ? payload : (payload.data ?? []);

      return items.map(mapBackendOfferToJobSummary);
    } catch (error) {
      throw error;
    }
  },

  async getPublicStats() {
    return publicStats;
  },

  async getCareers(): Promise<CatalogOption[]> {
    const response = await untypedTrpcClient.query("carreras.list", {
      page: 1,
      limit: 100,
      estaActiva: true,
    });

    const payload = response as BackendCareerListResponse;
    const items = Array.isArray(payload) ? payload : (payload.data ?? []);

    return items.map((career) => ({
      id: career.id,
      name: career.nombre ?? "Carrera sin nombre",
    }));
  },

  async getSkills(): Promise<SkillCatalogOption[]> {
    const response = await untypedTrpcClient.query("habilidades.list", {});

    return (response as BackendSkill[]).map((skill) => ({
      id: skill.id,
      name: skill.nombre ?? "Habilidad sin nombre",
      category: skill.categoria ?? undefined,
      type: skill.tipo ?? undefined,
    }));
  },

  async getJobById(id: string) {
    try {
      const response = await untypedTrpcClient.query("ofertas.publicGetById", { id });

      if (!response) {
        return null;
      }

      return mapBackendOfferToJobSummary(response as BackendPublicOffer);
    } catch (error) {
      throw error;
    }
  },
};
