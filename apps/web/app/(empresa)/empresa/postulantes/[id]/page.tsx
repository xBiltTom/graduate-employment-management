import { notFound } from "next/navigation";
import { CompanyApplicantDetailPage } from "@/components/company/company-applicant-detail-page";
import { mockCompanyApplicants } from "@/lib/mock-data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const applicant = mockCompanyApplicants.find((item) => item.id === id);

  if (!applicant) {
    notFound();
  }

  return <CompanyApplicantDetailPage applicant={applicant} />;
}
