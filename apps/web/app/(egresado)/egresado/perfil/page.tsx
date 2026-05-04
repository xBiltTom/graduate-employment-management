import { GraduateProfilePage } from "@/components/graduate/graduate-profile-page";
import { GraduateStatusNotice } from "@/components/graduate/graduate-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { graduateService } from "@/services";
import type { GraduateProfile } from "@/types";

export default async function Page() {
  let profile: GraduateProfile | null = null;
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    profile = await graduateService.getProfile();
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión para ver esta sección."
      : getErrorMessage(error);
  }

  if (!profile) {
    return (
      <GraduateStatusNotice
        message={errorMessage ?? "No se pudo cargar el perfil del egresado."}
        showLoginAction={showLoginAction}
      />
    );
  }

  return <GraduateProfilePage initialProfile={profile} />;
}
