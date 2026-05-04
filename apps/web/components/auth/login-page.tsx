"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ROUTES } from "@/lib/routes";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor completa todos los campos.");
      return;
    }

    toast.info("Funcionalidad pendiente de conexión con backend.", {
      description: "El inicio de sesión se habilitará en una fase posterior.",
    });
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

      <form onSubmit={handleSubmit} className="space-y-4">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
          />
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white"
        >
          Iniciar Sesión
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
