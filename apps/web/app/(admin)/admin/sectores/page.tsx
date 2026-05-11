import { AdminCatalogPage } from "@/components/admin/admin-catalog-page";
import { AdminStatusNotice } from "@/components/admin/admin-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { adminService } from "@/services";
import type { AdminSector } from "@/types";

export default async function Page() {
  let sectors: AdminSector[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    sectors = await adminService.getSectors();
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como administrador para ver esta sección."
      : getErrorMessage(error);
  }

  if (!sectors.length && errorMessage) {
    return <AdminStatusNotice message={errorMessage} showLoginAction={showLoginAction} />;
  }

  return (
    <AdminCatalogPage
      kind="sector"
      title="Catálogo de sectores"
      description="Gestiona los sectores que luego podrán seleccionar las empresas durante su registro y actualización de perfil."
      items={sectors}
    />
  );
}
