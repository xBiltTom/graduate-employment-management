import { GraduateApplicationsPage } from "@/components/graduate/graduate-applications-page";
import { GraduateStatusNotice } from "@/components/graduate/graduate-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { graduateService } from "@/services";
import type { GraduateApplication } from "@/types";

export default async function Page() {
  let applications: GraduateApplication[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    applications = await graduateService.getApplications();
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión para ver esta sección."
      : getErrorMessage(error);
  }

  if (errorMessage) {
    return (
      <GraduateStatusNotice
        message={errorMessage}
        showLoginAction={showLoginAction}
      />
    );
  }

  return <GraduateApplicationsPage applications={applications} />;
}
