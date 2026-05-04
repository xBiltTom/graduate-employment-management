import { graduateApiService } from "@/services/api/graduate.api-service";
import { shouldUseMockData } from "@/services/data-source";
import { graduateMockService } from "@/services/mock/graduate.mock-service";

export const graduateService = shouldUseMockData() ? graduateMockService : graduateApiService;
