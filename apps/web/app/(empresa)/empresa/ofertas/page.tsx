import { CompanyOffersPage } from "@/components/company/company-offers-page";
import { CompanyStatusNotice } from "@/components/company/company-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { companyService } from "@/services";
import type { CompanyOfferSummary } from "@/types";

export default async function Page() {
  let offers: CompanyOfferSummary[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    offers = await companyService.getOffers();
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como empresa para ver esta sección."
      : getErrorMessage(error);
  }

  if (errorMessage) {
    return <CompanyStatusNotice message={errorMessage} showLoginAction={showLoginAction} />;
  }

  return <CompanyOffersPage offers={offers} />;
}
