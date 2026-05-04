import type { UserSummary } from "@/types/user";

export type AuthUserMap = {
  graduate: UserSummary & { validationStatus?: string };
  company: UserSummary & { validationStatus?: string };
  admin: UserSummary & { validationStatus?: string };
};
