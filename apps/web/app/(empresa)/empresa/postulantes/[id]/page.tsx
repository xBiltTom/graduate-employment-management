import { notFound } from "next/navigation";
import { CompanyApplicantDetailPage } from "@/components/company/company-applicant-detail-page";
import { companyService } from "@/services";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const applicant = companyService.getApplicantById(id);

  if (!applicant) {
    notFound();
  }

  return <CompanyApplicantDetailPage applicant={applicant} />;
}
