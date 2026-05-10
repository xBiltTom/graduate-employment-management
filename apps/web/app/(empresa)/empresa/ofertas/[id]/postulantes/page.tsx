import { notFound } from "next/navigation";
import { CompanyOfferApplicantsPage } from "@/components/company/company-offer-applicants-page";
import { CompanyStatusNotice } from "@/components/company/company-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { companyService } from "@/services";
import type { CompanyApplicant } from "@/types";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let offer = null;
  let applicants: CompanyApplicant[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    [offer, applicants] = await Promise.all([
      companyService.getOfferById(id),
      companyService.getApplicantsByOfferId(id),
    ]);
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como empresa para ver esta sección."
      : getErrorMessage(error);
  }

  if (offer && !offer.job) {
    notFound();
  }

  if (!offer?.job) {
    return <CompanyStatusNotice message={errorMessage ?? "No se pudo cargar el pipeline de postulantes."} showLoginAction={showLoginAction} />;
  }

  return <CompanyOfferApplicantsPage offerTitle={offer.job.title} applicants={applicants} />;
}
