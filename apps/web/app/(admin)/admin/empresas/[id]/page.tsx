import { notFound } from "next/navigation";
import { AdminCompanyDetailPage } from "@/components/admin/admin-company-detail-page";
import { AdminStatusNotice } from "@/components/admin/admin-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { adminService } from "@/services";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let company = null;
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    company = await adminService.getCompanyById(id);
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como administrador para ver esta sección."
      : getErrorMessage(error);
  }

  if (!company) {
    if (errorMessage) {
      return <AdminStatusNotice message={errorMessage} showLoginAction={showLoginAction} />;
    }

    notFound();
  }

  return <AdminCompanyDetailPage company={company} />;
}
