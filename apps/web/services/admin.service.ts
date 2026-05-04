import { adminApiService } from "@/services/api/admin.api-service";
import { shouldUseMockData } from "@/services/data-source";
import { adminMockService } from "@/services/mock/admin.mock-service";

export const adminService = shouldUseMockData() ? adminMockService : adminApiService;
