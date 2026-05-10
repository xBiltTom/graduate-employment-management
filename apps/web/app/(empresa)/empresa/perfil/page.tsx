import { CompanyProfilePage } from "@/components/company/company-profile-page";
import { CompanyStatusNotice } from "@/components/company/company-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { companyService } from "@/services";
import type { CompanyProfile, CompanyValidationState } from "@/types";

export default async function Page() {
  let profile: CompanyProfile | null = null;
  let validationState: CompanyValidationState | undefined;
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    [profile, validationState] = await Promise.all([
      companyService.getProfile(),
      companyService.getValidationStatus(),
    ]);
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como empresa para ver esta sección."
      : getErrorMessage(error);
  }

  if (!profile) {
    return (
      <CompanyStatusNotice
        message={errorMessage ?? "No se pudo cargar el perfil de empresa."}
        showLoginAction={showLoginAction}
      />
    );
  }

  return <CompanyProfilePage initialProfile={profile} validationState={validationState} />;
}
