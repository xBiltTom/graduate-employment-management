"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

const STEPS = [
  { key: "cuenta", label: "Cuenta", description: "Credenciales de acceso" },
  { key: "fiscal", label: "Datos fiscales", description: "Información legal" },
  { key: "contacto", label: "Contacto", description: "Datos de contacto" },
  { key: "descripcion", label: "Descripción", description: "Sobre su empresa" },
] as const;

export function RegisterCompanyPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [form, setForm] = useState({
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
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.info("Funcionalidad pendiente de conexión con backend.", {
      description:
        "El registro de empresa se habilitará en una fase posterior. Su cuenta quedará pendiente de validación administrativa.",
    });
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

      <form onSubmit={handleSubmit}>
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
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-comp-pass" className="text-sm">Contraseña</Label>
                  <Input
                    id="reg-comp-pass"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-comp-confirm" className="text-sm">Confirmar contraseña</Label>
                  <Input
                    id="reg-comp-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                  />
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
                    value={form.ruc}
                    onChange={(e) => updateField("ruc", e.target.value)}
                    className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-comp-razon" className="text-sm">Razón social</Label>
                  <Input
                    id="reg-comp-razon"
                    placeholder="Tech Solutions S.A.C."
                    value={form.razonSocial}
                    onChange={(e) => updateField("razonSocial", e.target.value)}
                    className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-comp-nombre" className="text-sm">Nombre comercial</Label>
                    <Input
                      id="reg-comp-nombre"
                      placeholder="Tech Solutions"
                      value={form.nombreComercial}
                      onChange={(e) => updateField("nombreComercial", e.target.value)}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-comp-sector" className="text-sm">Sector</Label>
                    <Input
                      id="reg-comp-sector"
                      placeholder="Tecnología"
                      value={form.sector}
                      onChange={(e) => updateField("sector", e.target.value)}
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
                      value={form.telefono}
                      onChange={(e) => updateField("telefono", e.target.value)}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-comp-web" className="text-sm">Sitio web</Label>
                    <Input
                      id="reg-comp-web"
                      placeholder="https://empresa.com"
                      value={form.sitioWeb}
                      onChange={(e) => updateField("sitioWeb", e.target.value)}
                      className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-teal)]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-comp-ubic" className="text-sm">Ubicación</Label>
                  <Input
                    id="reg-comp-ubic"
                    placeholder="Trujillo, La Libertad"
                    value={form.ubicacion}
                    onChange={(e) => updateField("ubicacion", e.target.value)}
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
                    value={form.descripcion}
                    onChange={(e) => updateField("descripcion", e.target.value)}
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
                  onClick={handleNext}
                  className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white"
                >
                  Siguiente →
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white"
                >
                  Registrar empresa
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
