import type { UserRole, UserSummary } from "@/types/user";

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterGraduateInput = {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono?: string;
  carreraId?: string;
  anioEgreso?: number;
  habilidadIds?: string[];
};

export type RegisterCompanyInput = {
  email: string;
  password: string;
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
};

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  nombres?: string;
  apellidos?: string;
  validationStatus?: string;
};

export type AuthSession = {
  user: AuthUser;
};

export type AuthResponse = {
  user: AuthUser;
  message?: string;
};

export type AuthUserMap = {
  graduate: UserSummary & { validationStatus?: string };
  company: UserSummary & { validationStatus?: string };
  admin: UserSummary & { validationStatus?: string };
};
