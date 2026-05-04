"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getDefaultRouteByRole } from "@/lib/auth/redirects";
import { getErrorMessage } from "@/lib/errors";
import { ROUTES } from "@/lib/routes";
import { authService } from "@/services";
import type {
  LoginInput,
  RegisterCompanyInput,
  RegisterGraduateInput,
} from "@/types";

export function useAuthActions() {
  const router = useRouter();

  async function login(input: LoginInput) {
    try {
      const response = await authService.login(input);
      toast.success(response.message ?? "Sesión iniciada correctamente");
      router.push(getDefaultRouteByRole(response.user.role));
      router.refresh();
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async function registerGraduate(input: RegisterGraduateInput) {
    try {
      const response = await authService.registerGraduate(input);
      toast.success(response.message ?? "Registro de egresado completado");
      router.push(getDefaultRouteByRole(response.user.role));
      router.refresh();
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async function registerCompany(input: RegisterCompanyInput) {
    try {
      const response = await authService.registerCompany(input);
      toast.success(
        response.message ?? "Registro completado. La empresa quedó pendiente de validación.",
      );
      router.push(getDefaultRouteByRole(response.user.role));
      router.refresh();
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async function logout() {
    try {
      await authService.logout();
      toast.success("Sesión cerrada");
      router.push(ROUTES.AUTH.LOGIN);
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  }

  return {
    login,
    registerGraduate,
    registerCompany,
    logout,
  };
}
