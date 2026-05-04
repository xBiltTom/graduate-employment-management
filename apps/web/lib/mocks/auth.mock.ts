import { companyValidationStatuses, userRoles } from "@/lib/constants";
import type { AuthUserMap } from "@/types";

export const mockUsers: AuthUserMap = {
  graduate: {
    id: "user-graduate-1",
    name: "Ana Torres",
    email: "ana.torres@example.com",
    role: userRoles.graduate,
  },
  company: {
    id: "user-company-1",
    name: "Tech Solutions Perú",
    email: "rrhh@techsolutions.pe",
    role: userRoles.company,
    validationStatus: companyValidationStatuses.approved,
  },
  admin: {
    id: "user-admin-1",
    name: "Administrador",
    email: "admin@sistema.com",
    role: userRoles.admin,
  },
};
