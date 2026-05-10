import { AdminCompaniesPage } from "@/components/admin/admin-companies-page";
import { AdminStatusNotice } from "@/components/admin/admin-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { adminService } from "@/services";
import type { AdminCompany } from "@/types";

export default async function Page() {
  let companies: AdminCompany[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    companies = await adminService.getCompanies();
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como administrador para ver esta sección."
      : getErrorMessage(error);
  }

  if (!companies.length && errorMessage) {
    return <AdminStatusNotice message={errorMessage} showLoginAction={showLoginAction} />;
  }

  return <AdminCompaniesPage companies={companies} />;
}
