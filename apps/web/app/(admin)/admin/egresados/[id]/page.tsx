import { notFound } from "next/navigation";
import { AdminGraduateDetailPage } from "@/components/admin/admin-graduate-detail-page";
import { adminService, companyService } from "@/services";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const graduate = adminService.getGraduateById(id);

  if (!graduate) {
    notFound();
  }

  const applications = (await companyService
    .getApplicantsByOfferId("job-1"))
    .filter((application) => application.graduateId === id)
    .map((application) => {
      const offer = adminService.getOfferById(application.offerId);

      return {
        id: application.applicationId,
        title: offer?.titulo ?? "Oferta",
        company: offer?.empresa ?? "Empresa",
        status: application.status,
        appliedAt: application.appliedAt,
      };
    });

  return <AdminGraduateDetailPage graduate={graduate} applications={applications} />;
}
