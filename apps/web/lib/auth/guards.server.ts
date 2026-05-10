import { redirect } from "next/navigation";
import { getDefaultRouteByRole } from "@/lib/auth/redirects";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/routes";
import { getServerSession } from "@/lib/auth/session.server";
import type { AuthSession, UserRole } from "@/types";

export async function requireServerSession(): Promise<AuthSession | null> {
  if (env.isMockMode) {
    return null;
  }

  const session = await getServerSession();

  if (!session?.user) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  return session;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<AuthSession | null> {
  if (env.isMockMode) {
    return null;
  }

  const session = await requireServerSession();

  if (session && !allowedRoles.includes(session.user.role)) {
    redirect(getDefaultRouteByRole(session.user.role));
  }

  return session;
}

export async function redirectAuthenticatedUser(): Promise<void> {
  if (env.isMockMode) {
    return;
  }

  const session = await getServerSession();

  if (session?.user) {
    redirect(getDefaultRouteByRole(session.user.role));
  }
}
