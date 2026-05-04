import { mockAdminCompanies, mockAdminGraduates, mockAdminOffers, mockAdminReports, mockAdminSkills, mockAdminStats } from "@/lib/mocks";

export const adminMockService = {
  getStats() {
    return mockAdminStats;
  },
  getGraduates() {
    return mockAdminGraduates;
  },
  getGraduateById(id: string) {
    return mockAdminGraduates.find((graduate) => graduate.id === id) ?? null;
  },
  getCompanies() {
    return mockAdminCompanies;
  },
  getCompanyById(id: string) {
    return mockAdminCompanies.find((company) => company.id === id) ?? null;
  },
  getOffers() {
    return mockAdminOffers;
  },
  getOfferById(id: string) {
    return mockAdminOffers.find((offer) => offer.id === id) ?? null;
  },
  getReports() {
    return mockAdminReports;
  },
  getSkills() {
    return mockAdminSkills;
  },
};
