import { AdminReportsPage } from "@/components/admin/admin-reports-page";
import { AdminStatusNotice } from "@/components/admin/admin-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { adminService } from "@/services";
import type { AdminReport } from "@/types";

export default async function Page() {
  let reports: AdminReport[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    reports = await adminService.getReports();
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como administrador para ver esta sección."
      : getErrorMessage(error);
  }

  if (!reports.length && errorMessage) {
    return <AdminStatusNotice message={errorMessage} showLoginAction={showLoginAction} />;
  }

  return <AdminReportsPage reports={reports} />;
}
