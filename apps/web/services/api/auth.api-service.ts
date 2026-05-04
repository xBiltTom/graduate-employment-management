import { userRoles } from "@/lib/constants";
import { httpClient } from "@/lib/api/http-client";
import type {
  AuthResponse,
  AuthSession,
  AuthUser,
  LoginInput,
  RegisterCompanyInput,
  RegisterGraduateInput,
} from "@/types";

const AUTH_BASE = "/api/v1/auth";

type BackendAuthUser = {
  id: string;
  email: string;
  rol: AuthUser["role"];
};

type BackendAuthResponse = {
  user: BackendAuthUser;
  message?: string;
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

function mapAuthResponse(response: BackendAuthResponse): AuthResponse {
  return {
    user: mapAuthUser(response.user),
    message: response.message,
  };
}

export const authApiService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await httpClient.post<BackendAuthResponse>(`${AUTH_BASE}/login`, input);
    return mapAuthResponse(response);
  },

  async registerGraduate(input: RegisterGraduateInput): Promise<AuthResponse> {
    const response = await httpClient.post<BackendAuthResponse>(`${AUTH_BASE}/register`, {
      email: input.email,
      password: input.password,
      rol: userRoles.graduate,
      nombres: input.nombres,
      apellidos: input.apellidos,
      dni: input.dni,
    });

    return mapAuthResponse(response);
  },

  async registerCompany(input: RegisterCompanyInput): Promise<AuthResponse> {
    const response = await httpClient.post<BackendAuthResponse>(`${AUTH_BASE}/register`, {
      email: input.email,
      password: input.password,
      rol: userRoles.company,
      ruc: input.ruc,
      razonSocial: input.razonSocial,
      nombreComercial: input.nombreComercial,
    });

    return mapAuthResponse(response);
  },

  async logout(): Promise<void> {
    await httpClient.post<void>(`${AUTH_BASE}/logout`);
  },

  async me(): Promise<AuthSession | null> {
    const user = await httpClient.get<BackendAuthUser>(`${AUTH_BASE}/me`);
    return { user: mapAuthUser(user) };
  },
};
