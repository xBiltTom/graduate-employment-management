import { publicStats } from "@/lib/mocks";
import { getUntypedClient } from "@trpc/client";
import { trpcClient } from "@/lib/api/trpc-client";
import { mapBackendOfferToJobSummary, type BackendPublicOffer } from "@/services/mappers/public-offers.mapper";

type BackendFeedResponse = {
  data?: BackendPublicOffer[];
  meta?: unknown;
};

const untypedTrpcClient = getUntypedClient(trpcClient);

function getMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "No se pudo completar la operación";
}

export const publicApiService = {
  async getFeaturedJobs() {
    try {
      const response = await untypedTrpcClient.query("ofertas.feed", {
        page: 1,
        limit: 6,
      });

      const payload = response as BackendFeedResponse;
      const items = Array.isArray(payload) ? payload : (payload.data ?? []);

      return items.map(mapBackendOfferToJobSummary);
    } catch (error) {
      const message = getMessage(error);

      if (message.toLowerCase().includes("autentic") || message.toLowerCase().includes("unauthorized")) {
        return [];
      }

      throw error;
    }
  },

  async getPublicStats() {
    return publicStats;
  },

  async getJobById(id: string) {
    try {
      const response = await untypedTrpcClient.query("ofertas.getById", { id });

      if (!response) {
        return null;
      }

      return mapBackendOfferToJobSummary(response as BackendPublicOffer);
    } catch (error) {
      const message = getMessage(error);

      if (message.toLowerCase().includes("autentic") || message.toLowerCase().includes("unauthorized")) {
        return null;
      }

      throw error;
    }
  },
};
