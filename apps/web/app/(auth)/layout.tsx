import { AuthLayout } from "@/components/layout/auth-layout";
import { redirectAuthenticatedUser } from "@/lib/auth/guards.server";

export default async function Layout({ children }: { children: React.ReactNode }) {
  await redirectAuthenticatedUser();

  return <AuthLayout>{children}</AuthLayout>;
}
