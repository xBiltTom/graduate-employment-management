import { userRoles } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import type { UserRole } from "@/types";

export function getDefaultRouteByRole(role: UserRole) {
  switch (role) {
    case userRoles.graduate:
      return ROUTES.EGRESADO.INICIO;
    case userRoles.company:
      return ROUTES.EMPRESA.INICIO;
    case userRoles.admin:
      return ROUTES.ADMIN.DASHBOARD;
    default:
      return ROUTES.PUBLIC.HOME;
  }
}
