import { notFound } from "next/navigation";
import { AdminGraduateDetailPage } from "@/components/admin/admin-graduate-detail-page";
import { mockAdminGraduates, mockAdminOffers, mockCompanyApplicants } from "@/lib/mock-data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const graduate = mockAdminGraduates.find((item) => item.id === id);

  if (!graduate) {
    notFound();
  }

  const applications = mockCompanyApplicants
    .filter((application) => application.graduateId === id)
    .map((application) => {
      const offer = mockAdminOffers.find((item) => item.id === application.offerId);

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
