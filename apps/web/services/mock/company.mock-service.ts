import { mockCompanyApplicants, mockCompanyOffers, mockCompanyProfile } from "@/lib/mocks";

export const companyMockService = {
  getProfile() {
    return mockCompanyProfile;
  },
  getOffers() {
    return mockCompanyOffers;
  },
  getOfferById(id: string) {
    return mockCompanyOffers.find((offer) => offer.id === id) ?? null;
  },
  getApplicantsByOfferId(offerId: string) {
    return mockCompanyApplicants.filter((applicant) => applicant.offerId === offerId);
  },
  getApplicantById(id: string) {
    return mockCompanyApplicants.find((applicant) => applicant.id === id) ?? null;
  },
};
