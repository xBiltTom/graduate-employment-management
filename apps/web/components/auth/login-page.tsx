"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/routes";
import { useAuthActions } from "@/hooks/use-auth-actions";
import type { LoginInput } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export function LoginPage() {
  const { login } = useAuthActions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    setIsSubmitting(true);

    try {
      await login(values);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-2">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-text-heading)]">
          Iniciar Sesión
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Ingresa tus credenciales para acceder a tu plataforma.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="login-email"
            className="text-sm font-medium text-[var(--color-text-heading)]"
          >
            Correo electrónico
          </Label>
          <Input
            id="login-email"
            type="email"
            placeholder="tu@correo.com"
            {...register("email")}
            className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
          />
          {errors.email ? <p className="text-xs text-[var(--color-error)]">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="login-password"
              className="text-sm font-medium text-[var(--color-text-heading)]"
            >
              Contraseña
            </Label>
            <span className="text-xs text-[var(--color-brand)] cursor-pointer hover:underline">
              ¿Olvidaste tu contraseña?
            </span>
          </div>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
          />
          {errors.password ? <p className="text-xs text-[var(--color-error)]">{errors.password.message}</p> : null}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white"
        >
          {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        ¿Aún no tienes una cuenta?{" "}
        <Link
          href={ROUTES.AUTH.REGISTER}
          className="text-[var(--color-brand)] font-medium hover:underline"
        >
          Registrarse
        </Link>
      </p>
    </div>
  );
}
