import { notFound } from "next/navigation";
import { CompanyOfferDetailPage } from "@/components/company/company-offer-detail-page";
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

  const applicants = mockCompanyApplicants
    .filter((item) => item.offerId === id)
    .map((item) => ({
      id: item.id,
      nombres: item.nombres,
      apellidos: item.apellidos,
      carrera: item.carrera,
      ciudad: item.ciudad,
      status: item.status,
      match: item.match,
    }));

  return <CompanyOfferDetailPage offer={{ ...offer, job: offer.job }} applicants={applicants} />;
}
