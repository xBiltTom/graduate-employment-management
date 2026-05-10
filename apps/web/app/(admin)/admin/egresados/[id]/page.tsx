import { notFound } from "next/navigation";
import { AdminGraduateDetailPage } from "@/components/admin/admin-graduate-detail-page";
import { AdminStatusNotice } from "@/components/admin/admin-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { adminService } from "@/services";
import type { AdminApplicationSummary } from "@/types";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let graduate = null;
  let applications: AdminApplicationSummary[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    [graduate, applications] = await Promise.all([
      adminService.getGraduateById(id),
      adminService.getApplications({ graduateId: id }),
    ]);
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como administrador para ver esta sección."
      : getErrorMessage(error);
  }

  if (!graduate) {
    if (errorMessage) {
      return <AdminStatusNotice message={errorMessage} showLoginAction={showLoginAction} />;
    }

    notFound();
  }

  return <AdminGraduateDetailPage graduate={graduate} applications={applications} />;
}
