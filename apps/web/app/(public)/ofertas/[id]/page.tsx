import { PublicOfferDetailPage } from "@/components/public/public-offer-detail-page";
import { publicService } from "@/services";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let errorMessage: string | undefined;
  let job = null;

  try {
    job = await publicService.getJobById(id);
  } catch {
    errorMessage = "No se pudo cargar el detalle de la oferta desde el backend.";
  }

  return <PublicOfferDetailPage job={job} errorMessage={errorMessage} />;
}
