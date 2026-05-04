function notImplemented(moduleName: string): never {
  throw new Error(`${moduleName} API service is not implemented yet. Use NEXT_PUBLIC_API_MODE=mock.`);
}

export const adminApiService = {
  getStats() {
    return notImplemented("admin");
  },
  getGraduates() {
    return notImplemented("admin");
  },
  getGraduateById() {
    return notImplemented("admin");
  },
  getCompanies() {
    return notImplemented("admin");
  },
  getCompanyById() {
    return notImplemented("admin");
  },
  getOffers() {
    return notImplemented("admin");
  },
  getOfferById() {
    return notImplemented("admin");
  },
  getReports() {
    return notImplemented("admin");
  },
  getSkills() {
    return notImplemented("admin");
  },
};
