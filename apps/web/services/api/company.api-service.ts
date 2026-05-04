function notImplemented(moduleName: string): never {
  throw new Error(`${moduleName} API service is not implemented yet. Use NEXT_PUBLIC_API_MODE=mock.`);
}

export const companyApiService = {
  getProfile() {
    return notImplemented("company");
  },
  getOffers() {
    return notImplemented("company");
  },
  getOfferById() {
    return notImplemented("company");
  },
  getApplicantsByOfferId() {
    return notImplemented("company");
  },
  getApplicantById() {
    return notImplemented("company");
  },
};
