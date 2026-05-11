import { AdminCatalogPage } from "@/components/admin/admin-catalog-page";
import { AdminStatusNotice } from "@/components/admin/admin-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { adminService } from "@/services";
import type { AdminCareer } from "@/types";

export default async function Page() {
  let careers: AdminCareer[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    careers = await adminService.getCareers();
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como administrador para ver esta sección."
      : getErrorMessage(error);
  }

  if (!careers.length && errorMessage) {
    return <AdminStatusNotice message={errorMessage} showLoginAction={showLoginAction} />;
  }

  return (
    <AdminCatalogPage
      kind="career"
      title="Catálogo de carreras"
      description="Administra las carreras activas que los egresados podrán elegir al completar su registro y su perfil académico."
      items={careers}
    />
  );
}
