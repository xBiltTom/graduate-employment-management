import { GraduateOffersPage } from "@/components/graduate/graduate-offers-page";
import { GraduateStatusNotice } from "@/components/graduate/graduate-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { graduateService } from "@/services";
import type { JobSummary } from "@/types";

export default async function Page() {
  let jobs: JobSummary[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    jobs = await graduateService.getRecommendedJobs();
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

  return <GraduateOffersPage jobs={jobs} />;
}
