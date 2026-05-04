import { GraduateOfferDetailPage } from "@/components/graduate/graduate-offer-detail-page";
import { GraduateStatusNotice } from "@/components/graduate/graduate-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { graduateService } from "@/services";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let job = null;
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    job = await graduateService.getJobById(id);
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión para ver esta sección."
      : getErrorMessage(error);
  }

  if (errorMessage) {
    return (
      <GraduateStatusNotice
        message={errorMessage}
        showLoginAction={showLoginAction}
      />
    );
  }

  if (!job) {
    return <GraduateStatusNotice message="No se encontró la oferta solicitada." />;
  }

  return <GraduateOfferDetailPage job={job} />;
}
