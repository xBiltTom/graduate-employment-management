import { CompanyLayout } from "@/components/layout/company-layout";
import { requireRole } from "@/lib/auth/guards.server";
import { userRoles } from "@/lib/constants";

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireRole([userRoles.company]);

  return <CompanyLayout>{children}</CompanyLayout>;
}
