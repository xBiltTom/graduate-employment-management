import { notFound } from "next/navigation";
import { CompanyOfferApplicantsPage } from "@/components/company/company-offer-applicants-page";
import { mockCompanyApplicants, mockCompanyOffers } from "@/lib/mock-data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = mockCompanyOffers.find((item) => item.id === id && item.job);

  if (!offer?.job) {
    notFound();
  }

  const applicants = mockCompanyApplicants.filter((item) => item.offerId === id);

  return <CompanyOfferApplicantsPage offerTitle={offer.job.title} applicants={applicants} />;
}
