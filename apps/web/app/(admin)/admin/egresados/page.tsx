import { AdminGraduatesPage } from "@/components/admin/admin-graduates-page";
import { AdminStatusNotice } from "@/components/admin/admin-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { adminService } from "@/services";
import type { AdminGraduate } from "@/types";

export default async function Page() {
  let graduates: AdminGraduate[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    graduates = await adminService.getGraduates();
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como administrador para ver esta sección."
      : getErrorMessage(error);
  }

  if (!graduates.length && errorMessage) {
    return <AdminStatusNotice message={errorMessage} showLoginAction={showLoginAction} />;
  }

  return <AdminGraduatesPage graduates={graduates} />;
}
