import { AdminDashboardPage } from "@/components/admin/admin-dashboard-page";
import { AdminStatusNotice } from "@/components/admin/admin-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { adminService } from "@/services";
import type { AdminCompany, AdminOffer, AdminSkill, AdminStats } from "@/types";

export default async function Page() {
  let stats: AdminStats | null = null;
  let companies: AdminCompany[] = [];
  let offers: AdminOffer[] = [];
  let skills: AdminSkill[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    [stats, companies, offers, skills] = await Promise.all([
      adminService.getStats(),
      adminService.getCompanies(),
      adminService.getOffers(),
      adminService.getSkills(),
    ]);
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como administrador para ver esta sección."
      : getErrorMessage(error);
  }

  if (!stats) {
    return (
      <AdminStatusNotice
        message={errorMessage ?? "No se pudo cargar el dashboard administrativo."}
        showLoginAction={showLoginAction}
      />
    );
  }

  return <AdminDashboardPage stats={stats} companies={companies} offers={offers} skills={skills} />;
}
