import { userRoles, userStatuses } from "@/lib/constants";

export type UserRole = (typeof userRoles)[keyof typeof userRoles];
export type UserStatus = (typeof userStatuses)[keyof typeof userStatuses];

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
};
