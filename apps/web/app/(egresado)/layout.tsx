import { GraduateLayout } from "@/components/layout/graduate-layout";
import { requireRole } from "@/lib/auth/guards.server";
import { userRoles } from "@/lib/constants";

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireRole([userRoles.graduate]);

  return <GraduateLayout>{children}</GraduateLayout>;
}
