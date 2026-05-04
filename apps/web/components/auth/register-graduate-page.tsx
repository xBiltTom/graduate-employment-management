"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { useAuthActions } from "@/hooks/use-auth-actions";
import type { RegisterGraduateInput } from "@/types";

const STEPS = [
  { key: "cuenta", label: "Cuenta", description: "Tus credenciales de acceso" },
  { key: "personal", label: "Datos personales", description: "Información básica" },
  { key: "academico", label: "Datos académicos", description: "Tus estudios" },
  { key: "habilidades", label: "Habilidades", description: "Tus áreas de expertise" },
] as const;

const graduateSchema = z
  .object({
    email: z.string().email("Ingresa un correo válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirma tu contraseña"),
    nombres: z.string().min(1, "Ingresa tus nombres"),
    apellidos: z.string().min(1, "Ingresa tus apellidos"),
    dni: z.string().min(1, "Ingresa tu DNI"),
    telefono: z.string().optional(),
    carrera: z.string().optional(),
    anioEgreso: z.string().optional(),
    habilidades: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

type GraduateRegisterForm = z.infer<typeof graduateSchema>;

export function RegisterGraduatePage() {
  const { registerGraduate } = useAuthActions();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<GraduateRegisterForm>({
    resolver: zodResolver(graduateSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      nombres: "",
      apellidos: "",
      dni: "",
      telefono: "",
      carrera: "",
      anioEgreso: "",
      habilidades: "",
    },
  });

  async function handleNext() {
    const stepFields: Array<Array<keyof GraduateRegisterForm>> = [
      ["email", "password", "confirmPassword"],
      ["nombres", "apellidos", "dni"],
      [],
      [],
    ];

    const fields = stepFields[currentStep];
    const isValid = fields.length ? await trigger(fields) : true;

    if (!isValid) {
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }

  async function onSubmit(values: GraduateRegisterForm) {
    setIsSubmitting(true);

    const payload: RegisterGraduateInput = {
      email: values.email,
      password: values.password,
      nombres: values.nombres,
      apellidos: values.apellidos,
      dni: values.dni,
    };

    try {
      await registerGraduate(payload);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-up max-w-lg mx-auto w-full">
      <div className="space-y-2">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-text-heading)]">
          Registro de Egresado
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Completa tu información para conectar con las mejores oportunidades profesionales.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1">
        {STEPS.map((step, idx) => (
          <div key={step.key} className="flex-1 space-y-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                idx <= currentStep
                  ? "bg-[var(--color-brand)]"
                  : "bg-[var(--color-border-subtle)]"
              }`}
            />
            <p
              className={`text-[10px] font-medium transition-colors ${
                idx <= currentStep
                  ? "text-[var(--color-brand)]"
                  : "text-[var(--color-text-muted)]"
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-[var(--color-border-subtle)]">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="font-semibold text-[var(--color-text-heading)]">
                {STEPS[currentStep].label}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                {STEPS[currentStep].description}
              </p>
            </div>

            {/* Step: Cuenta */}
            {currentStep === 0 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-grad-email" className="text-sm">Correo electrónico</Label>
                    <Input
                      id="reg-grad-email"
                      type="email"
                      placeholder="tu@correo.com"
                      {...register("email")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
                    />
                    {errors.email ? <p className="text-xs text-[var(--color-error)]">{errors.email.message}</p> : null}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-grad-pass" className="text-sm">Contraseña</Label>
                  <Input
                      id="reg-grad-pass"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
                    />
                    {errors.password ? <p className="text-xs text-[var(--color-error)]">{errors.password.message}</p> : null}
                    <p className="text-[10px] text-[var(--color-text-muted)]">
                      Debe contener al menos 8 caracteres, una mayúscula y un número.
                    </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-grad-confirm" className="text-sm">Confirmar contraseña</Label>
                  <Input
                      id="reg-grad-confirm"
                      type="password"
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
                    />
                    {errors.confirmPassword ? <p className="text-xs text-[var(--color-error)]">{errors.confirmPassword.message}</p> : null}
                  </div>
                </div>
              )}

            {/* Step: Datos Personales */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-grad-nombres" className="text-sm">Nombres</Label>
                    <Input
                      id="reg-grad-nombres"
                      placeholder="Ana María"
                      {...register("nombres")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
                    />
                    {errors.nombres ? <p className="text-xs text-[var(--color-error)]">{errors.nombres.message}</p> : null}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-grad-apellidos" className="text-sm">Apellidos</Label>
                    <Input
                      id="reg-grad-apellidos"
                      placeholder="Torres García"
                      {...register("apellidos")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
                    />
                    {errors.apellidos ? <p className="text-xs text-[var(--color-error)]">{errors.apellidos.message}</p> : null}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-grad-dni" className="text-sm">DNI</Label>
                    <Input
                      id="reg-grad-dni"
                      placeholder="12345678"
                      {...register("dni")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
                    />
                    {errors.dni ? <p className="text-xs text-[var(--color-error)]">{errors.dni.message}</p> : null}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-grad-tel" className="text-sm">Teléfono</Label>
                    <Input
                      id="reg-grad-tel"
                      placeholder="987654321"
                      {...register("telefono")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step: Datos Académicos */}
            {currentStep === 2 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-grad-carrera" className="text-sm">Carrera</Label>
                    <Input
                      id="reg-grad-carrera"
                      placeholder="Ingeniería de Sistemas"
                      {...register("carrera")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
                    />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-grad-anio" className="text-sm">Año de egreso</Label>
                    <Input
                      id="reg-grad-anio"
                      placeholder="2024"
                      {...register("anioEgreso")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
                    />
                </div>
              </div>
            )}

            {/* Step: Habilidades */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-grad-skills" className="text-sm">Habilidades</Label>
                    <Input
                      id="reg-grad-skills"
                      placeholder="React, TypeScript, Node.js..."
                      {...register("habilidades")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
                    />
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    Separa las habilidades con comas.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-2">
              {currentStep > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  className="text-[var(--color-text-muted)]"
                >
                  ← Atrás
                </Button>
              ) : (
                <div />
              )}

              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => void handleNext()}
                  className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white"
                >
                  Siguiente →
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white"
                >
                  {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        ¿Ya tienes cuenta?{" "}
        <Link
          href={ROUTES.AUTH.LOGIN}
          className="text-[var(--color-brand)] font-medium hover:underline"
        >
          Iniciar Sesión
        </Link>
      </p>
    </div>
  );
}
