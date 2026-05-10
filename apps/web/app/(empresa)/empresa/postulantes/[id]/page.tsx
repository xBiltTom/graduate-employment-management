import { notFound } from "next/navigation";
import { CompanyApplicantDetailPage } from "@/components/company/company-applicant-detail-page";
import { CompanyStatusNotice } from "@/components/company/company-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { companyService } from "@/services";
import type { ApplicationHistoryEntry, CompanyApplicant } from "@/types";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let applicant: CompanyApplicant | null = null;
  let history: ApplicationHistoryEntry[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    applicant = await companyService.getApplicantById(id);

    if (applicant) {
      history = await companyService.getApplicationHistory(applicant.applicationId);
    }
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como empresa para ver esta sección."
      : getErrorMessage(error);
  }

  if (applicant === null && !errorMessage) {
    notFound();
  }

  if (!applicant) {
    return <CompanyStatusNotice message={errorMessage ?? "No se pudo cargar el postulante."} showLoginAction={showLoginAction} />;
  }

  return <CompanyApplicantDetailPage applicant={applicant} history={history} />;
}
