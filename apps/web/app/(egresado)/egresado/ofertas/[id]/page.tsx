import { GraduateOfferDetailPage } from "@/components/graduate/graduate-offer-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GraduateOfferDetailPage id={id} />;
}
