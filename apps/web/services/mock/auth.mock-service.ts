import { mockUsers } from "@/lib/mocks";
import { userRoles } from "@/lib/constants";
import type {
  AuthResponse,
  AuthSession,
  AuthUser,
  LoginInput,
  RegisterCompanyInput,
  RegisterGraduateInput,
} from "@/types";

let currentUser: AuthUser | null = {
  id: mockUsers.graduate.id,
  email: mockUsers.graduate.email,
  role: mockUsers.graduate.role,
  name: mockUsers.graduate.name,
};

export const authMockService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    if (!input.email || !input.password) {
      throw new Error("Credenciales incompletas");
    }

    if (input.email === mockUsers.company.email) {
      currentUser = {
        id: mockUsers.company.id,
        email: mockUsers.company.email,
        role: mockUsers.company.role,
        name: mockUsers.company.name,
      };
    } else if (input.email === mockUsers.admin.email) {
      currentUser = {
        id: mockUsers.admin.id,
        email: mockUsers.admin.email,
        role: mockUsers.admin.role,
        name: mockUsers.admin.name,
      };
    } else {
      currentUser = {
        id: mockUsers.graduate.id,
        email: mockUsers.graduate.email,
        role: mockUsers.graduate.role,
        name: mockUsers.graduate.name,
      };
    }

    return {
      user: currentUser,
      message: "Sesión mock iniciada",
    };
  },

  async registerGraduate(input: RegisterGraduateInput): Promise<AuthResponse> {
    currentUser = {
      id: "mock-graduate-new",
      email: input.email,
      role: userRoles.graduate,
      nombres: input.nombres,
      apellidos: input.apellidos,
    };

    return {
      user: currentUser,
      message: "Registro mock de egresado completado",
    };
  },

  async registerCompany(input: RegisterCompanyInput): Promise<AuthResponse> {
    currentUser = {
      id: "mock-company-new",
      email: input.email,
      role: userRoles.company,
      name: input.nombreComercial,
    };

    return {
      user: currentUser,
      message: "Registro mock de empresa completado",
    };
  },

  async logout(): Promise<void> {
    currentUser = null;
    return;
  },

  async me(): Promise<AuthSession | null> {
    if (!currentUser) {
      return null;
    }

    return {
      user: currentUser,
    };
  },
};
