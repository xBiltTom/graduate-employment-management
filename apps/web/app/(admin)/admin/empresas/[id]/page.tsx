import { notFound } from "next/navigation";
import { AdminCompanyDetailPage } from "@/components/admin/admin-company-detail-page";
import { mockAdminCompanies } from "@/lib/mock-data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = mockAdminCompanies.find((item) => item.id === id);

  if (!company) {
    notFound();
  }

  return <AdminCompanyDetailPage company={company} />;
}
