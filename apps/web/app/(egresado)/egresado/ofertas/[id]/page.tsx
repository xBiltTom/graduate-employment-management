import { GraduateOfferDetailPage } from "@/components/graduate/graduate-offer-detail-page";
import { publicService } from "@/services";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await publicService.getJobById(id).catch(() => null);
  return <GraduateOfferDetailPage job={job} />;
}
