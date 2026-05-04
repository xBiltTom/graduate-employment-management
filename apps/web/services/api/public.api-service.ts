import { publicStats } from "@/lib/mocks";
import { getUntypedClient } from "@trpc/client";
import { trpcClient } from "@/lib/api/trpc-client";
import { mapBackendOfferToJobSummary, type BackendPublicOffer } from "@/services/mappers/public-offers.mapper";

type BackendFeedResponse = {
  data?: BackendPublicOffer[];
  meta?: unknown;
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
