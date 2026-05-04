import { notFound } from "next/navigation";
import { CompanyOfferApplicantsPage } from "@/components/company/company-offer-applicants-page";
import { companyService } from "@/services";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = companyService.getOfferById(id);

  if (!offer?.job) {
    notFound();
  }

  const applicants = companyService.getApplicantsByOfferId(id);

  return <CompanyOfferApplicantsPage offerTitle={offer.job.title} applicants={applicants} />;
}
