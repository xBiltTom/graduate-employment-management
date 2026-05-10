import { CompanyNewOfferPage } from "@/components/company/company-new-offer-page";
import { CompanyStatusNotice } from "@/components/company/company-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { companyService } from "@/services";
import type { CompanyValidationState } from "@/types";

export default async function Page() {
  let validationState: CompanyValidationState | null = null;
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    validationState = await companyService.getValidationStatus();
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como empresa para ver esta sección."
      : getErrorMessage(error);
  }

  if (!validationState) {
    return (
      <CompanyStatusNotice
        message={errorMessage ?? "No se pudo cargar el estado de validación de la empresa."}
        showLoginAction={showLoginAction}
      />
    );
  }

  return (
    <CompanyNewOfferPage
      canPublishOffers={validationState.canPublishOffers}
      validationMessage={validationState.message}
    />
  );
}
