import { companyApiService } from "@/services/api/company.api-service";
import { shouldUseMockData } from "@/services/data-source";
import { companyMockService } from "@/services/mock/company.mock-service";

export const companyService = shouldUseMockData() ? companyMockService : companyApiService;
