import { CompanyHomePage } from "@/components/company/company-home-page";
import { CompanyStatusNotice } from "@/components/company/company-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { companyService } from "@/services";
import type { CompanyApplicant, CompanyOfferSummary, CompanyProfile } from "@/types";

export default async function Page() {
  let profile: CompanyProfile | null = null;
  let offers: CompanyOfferSummary[] = [];
  let applicants: CompanyApplicant[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    profile = await companyService.getProfile();
    offers = await companyService.getOffers();

    const primaryOfferId = offers.find((offer) => Boolean(offer.job))?.id;

    if (primaryOfferId) {
      applicants = await companyService.getApplicantsByOfferId(primaryOfferId);
    }
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como empresa para ver esta sección."
      : getErrorMessage(error);
  }

  if (!profile) {
    return (
      <CompanyStatusNotice
        message={errorMessage ?? "No se pudo cargar la información de empresa."}
        showLoginAction={showLoginAction}
      />
    );
  }

  return <CompanyHomePage profile={profile} offers={offers} applicants={applicants} />;
}
