import { AdminOffersPage } from "@/components/admin/admin-offers-page";
import { AdminStatusNotice } from "@/components/admin/admin-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { adminService } from "@/services";
import type { AdminOffer } from "@/types";

export default async function Page() {
  let offers: AdminOffer[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    offers = await adminService.getOffers();
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como administrador para ver esta sección."
      : getErrorMessage(error);
  }

  if (!offers.length && errorMessage) {
    return <AdminStatusNotice message={errorMessage} showLoginAction={showLoginAction} />;
  }

  return <AdminOffersPage offers={offers} />;
}
