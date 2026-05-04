import { authApiService } from "@/services/api/auth.api-service";
import { shouldUseMockData } from "@/services/data-source";
import { authMockService } from "@/services/mock/auth.mock-service";

export const authService = shouldUseMockData() ? authMockService : authApiService;
