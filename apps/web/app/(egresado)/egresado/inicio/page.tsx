import { GraduateHomePage } from "@/components/graduate/graduate-home-page";
import { GraduateStatusNotice } from "@/components/graduate/graduate-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { graduateService } from "@/services";
import type { GraduateApplication, GraduateProfile, JobSummary, NotificationItem } from "@/types";

export default async function Page() {
  let profile: GraduateProfile | null = null;
  let featuredJobs: JobSummary[] = [];
  let applications: GraduateApplication[] = [];
  let notifications: NotificationItem[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    [profile, featuredJobs, applications, notifications] = await Promise.all([
      graduateService.getProfile(),
      graduateService.getRecommendedJobs(),
      graduateService.getApplications(),
      graduateService.getNotifications(),
    ]);
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión para ver esta sección."
      : getErrorMessage(error);
  }

  if (!profile) {
    return (
      <GraduateStatusNotice
        message={errorMessage ?? "No se pudo cargar la información del egresado."}
        showLoginAction={showLoginAction}
      />
    );
  }

  return (
    <GraduateHomePage
      profile={profile}
      featuredJobs={featuredJobs}
      applications={applications}
      notifications={notifications}
    />
  );
}
