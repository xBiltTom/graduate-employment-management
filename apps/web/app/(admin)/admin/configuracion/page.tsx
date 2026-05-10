import { AdminSettingsPage } from "@/components/admin/admin-settings-page";
import { AdminStatusNotice } from "@/components/admin/admin-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { adminService } from "@/services";

export default async function Page() {
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    await adminService.getStats();
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como administrador para ver esta sección."
      : getErrorMessage(error);
  }

  if (errorMessage) {
    return <AdminStatusNotice message={errorMessage} showLoginAction={showLoginAction} />;
  }

  return <AdminSettingsPage />;
}
