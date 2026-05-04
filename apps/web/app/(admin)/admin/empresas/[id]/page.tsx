import { notFound } from "next/navigation";
import { AdminCompanyDetailPage } from "@/components/admin/admin-company-detail-page";
import { adminService } from "@/services";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = adminService.getCompanyById(id);

  if (!company) {
    notFound();
  }

  return <AdminCompanyDetailPage company={company} />;
}
