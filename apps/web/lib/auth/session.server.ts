import { cookies } from "next/headers";
import { userRoles } from "@/lib/constants";
import { env } from "@/lib/env";
import type { AuthSession, AuthUser } from "@/types";

type BackendAuthUser = {
  id: string;
  email: string;
  rol: AuthUser["role"];
};

function mapAuthUser(user: BackendAuthUser): AuthUser {
  if (user.rol === userRoles.graduate) {
    return {
      id: user.id,
      email: user.email,
      role: user.rol,
    };
  }

  if (user.rol === userRoles.company) {
    return {
      id: user.id,
      email: user.email,
      role: user.rol,
    };
  }

  return {
    id: user.id,
    email: user.email,
    role: user.rol,
  };
}

export async function getServerSession(): Promise<AuthSession | null> {
  if (env.isMockMode) {
    return null;
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  if (!cookieHeader) {
    return null;
  }

  try {
    const response = await fetch(`${env.apiBaseUrl}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const user = (await response.json()) as BackendAuthUser;

    return {
      user: mapAuthUser(user),
    };
  } catch {
    return null;
  }
}
