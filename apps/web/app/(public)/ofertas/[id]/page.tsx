import { PublicOfferDetailPage } from '@/components/public/public-offer-detail-page';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <PublicOfferDetailPage id={resolvedParams.id} />;
}
