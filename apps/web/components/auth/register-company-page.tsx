"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { useAuthActions } from "@/hooks/use-auth-actions";
import type { RegisterCompanyInput } from "@/types";

const STEPS = [
  { key: "cuenta", label: "Cuenta", description: "Credenciales de acceso" },
  { key: "fiscal", label: "Datos fiscales", description: "Información legal" },
  { key: "contacto", label: "Contacto", description: "Datos de contacto" },
  { key: "descripcion", label: "Descripción", description: "Sobre su empresa" },
] as const;

const companySchema = z
  .object({
    email: z.string().email("Ingresa un correo válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirma tu contraseña"),
    ruc: z.string().min(1, "Ingresa el RUC"),
    razonSocial: z.string().min(1, "Ingresa la razón social"),
    nombreComercial: z.string().min(1, "Ingresa el nombre comercial"),
    sector: z.string().optional(),
    telefono: z.string().optional(),
    sitioWeb: z.string().optional(),
    ubicacion: z.string().optional(),
    descripcion: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

type CompanyRegisterForm = z.infer<typeof companySchema>;

export function RegisterCompanyPage() {
  const { registerCompany } = useAuthActions();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<CompanyRegisterForm>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      ruc: "",
      razonSocial: "",
      nombreComercial: "",
      sector: "",
      telefono: "",
      sitioWeb: "",
      ubicacion: "",
      descripcion: "",
    },
  });

  async function handleNext() {
    const stepFields: Array<Array<keyof CompanyRegisterForm>> = [
      ["email", "password", "confirmPassword"],
      ["ruc", "razonSocial", "nombreComercial"],
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

  async function onSubmit(values: CompanyRegisterForm) {
    setIsSubmitting(true);

    const payload: RegisterCompanyInput = {
      email: values.email,
      password: values.password,
      ruc: values.ruc,
      razonSocial: values.razonSocial,
      nombreComercial: values.nombreComercial,
    };

    try {
      await registerCompany(payload);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-up max-w-lg mx-auto w-full">
      <div className="space-y-2">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-text-heading)]">
          Registro Corporativo
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Únase a nuestra red para acceder al talento más destacado. El proceso de verificación garantiza un ecosistema confiable.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1">
        {STEPS.map((step, idx) => (
          <div key={step.key} className="flex-1 space-y-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                idx <= currentStep
                  ? "bg-[var(--color-teal)]"
                  : "bg-[var(--color-border-subtle)]"
              }`}
            />
            <p
              className={`text-[10px] font-medium transition-colors ${
                idx <= currentStep
                  ? "text-[var(--color-teal)]"
                  : "text-[var(--color-text-muted)]"
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>

      {/* Validation notice */}
      <div className="flex items-start gap-3 rounded-lg bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 p-3">
        <svg
          className="h-5 w-5 text-[var(--color-warning)] shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-[var(--color-text-heading)]">
            Validación Requerida
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            Todos los registros corporativos son verificados por la administración antes de habilitar la publicación de ofertas.
          </p>
        </div>
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
                  <Label htmlFor="reg-comp-email" className="text-sm">Correo electrónico</Label>
                    <Input
                      id="reg-comp-email"
                      type="email"
                      placeholder="contacto@empresa.com"
                      {...register("email")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                    />
                    {errors.email ? <p className="text-xs text-[var(--color-error)]">{errors.email.message}</p> : null}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-comp-pass" className="text-sm">Contraseña</Label>
                  <Input
                      id="reg-comp-pass"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                    />
                    {errors.password ? <p className="text-xs text-[var(--color-error)]">{errors.password.message}</p> : null}
                  </div>
                  <div className="space-y-1.5">
                  <Label htmlFor="reg-comp-confirm" className="text-sm">Confirmar contraseña</Label>
                  <Input
                      id="reg-comp-confirm"
                      type="password"
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                    />
                    {errors.confirmPassword ? <p className="text-xs text-[var(--color-error)]">{errors.confirmPassword.message}</p> : null}
                  </div>
                </div>
              )}

            {/* Step: Datos Fiscales */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-comp-ruc" className="text-sm">RUC</Label>
                    <Input
                      id="reg-comp-ruc"
                      placeholder="20123456789"
                      {...register("ruc")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                    />
                    {errors.ruc ? <p className="text-xs text-[var(--color-error)]">{errors.ruc.message}</p> : null}
                  </div>
                  <div className="space-y-1.5">
                  <Label htmlFor="reg-comp-razon" className="text-sm">Razón social</Label>
                    <Input
                      id="reg-comp-razon"
                      placeholder="Tech Solutions S.A.C."
                      {...register("razonSocial")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                    />
                    {errors.razonSocial ? <p className="text-xs text-[var(--color-error)]">{errors.razonSocial.message}</p> : null}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-comp-nombre" className="text-sm">Nombre comercial</Label>
                      <Input
                        id="reg-comp-nombre"
                        placeholder="Tech Solutions"
                        {...register("nombreComercial")}
                        className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                      />
                      {errors.nombreComercial ? <p className="text-xs text-[var(--color-error)]">{errors.nombreComercial.message}</p> : null}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-comp-sector" className="text-sm">Sector</Label>
                      <Input
                        id="reg-comp-sector"
                        placeholder="Tecnología"
                        {...register("sector")}
                        className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                      />
                  </div>
                </div>
              </div>
            )}

            {/* Step: Contacto */}
            {currentStep === 2 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-comp-tel" className="text-sm">Teléfono</Label>
                      <Input
                        id="reg-comp-tel"
                        placeholder="044-123456"
                        {...register("telefono")}
                        className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                      />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-comp-web" className="text-sm">Sitio web</Label>
                      <Input
                        id="reg-comp-web"
                        placeholder="https://empresa.com"
                        {...register("sitioWeb")}
                        className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                      />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-comp-ubic" className="text-sm">Ubicación</Label>
                    <Input
                      id="reg-comp-ubic"
                      placeholder="Trujillo, La Libertad"
                      {...register("ubicacion")}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                    />
                </div>
              </div>
            )}

            {/* Step: Descripción */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-comp-desc" className="text-sm">Descripción de la empresa</Label>
                    <Textarea
                      id="reg-comp-desc"
                      placeholder="Cuéntenos sobre su empresa, su misión y qué tipo de talento busca..."
                      {...register("descripcion")}
                      rows={4}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)] resize-none"
                    />
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
                  className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white"
                >
                  Siguiente →
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white"
                >
                  {isSubmitting ? "Registrando empresa..." : "Registrar empresa"}
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
          className="text-[var(--color-teal)] font-medium hover:underline"
        >
          Iniciar Sesión
        </Link>
      </p>
    </div>
  );
}
