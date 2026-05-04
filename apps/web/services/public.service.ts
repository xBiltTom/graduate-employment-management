import { publicApiService } from "@/services/api/public.api-service";
import { publicMockService } from "@/services/mock/public.mock-service";
import { shouldUseMockData } from "@/services/data-source";

export const publicService = shouldUseMockData() ? publicMockService : publicApiService;
