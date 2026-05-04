"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Shield, AlertTriangle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/lib/routes";
import { toast } from "sonner";

const steps = [
  { id: 1, label: "Cuenta", desc: "Credenciales de acceso" },
  { id: 2, label: "Información fiscal", desc: "RUC y datos legales" },
  { id: 3, label: "Contacto", desc: "Datos de contacto" },
  { id: 4, label: "Empresa", desc: "Descripción corporativa" },
];

function FormField({ id, label, type = "text", placeholder, hint }: { id: string; label: string; type?: string; placeholder?: string; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#E2E8F0" }}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder}
        className="bg-[#1E2D4E]/60 border-[#2D4A6E] text-white placeholder:text-[#475569] h-11 focus:border-[#3B82F6] transition-colors"
      />
      {hint && <p className="text-xs text-[#475569]">{hint}</p>}
    </div>
  );
}

export function RegisterCompanyPage() {
  const [step, setStep] = useState(1);

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (step < 4) { setStep(step + 1); return; }
    toast.success("Solicitud enviada", { description: "La verificará la administración en un plazo de 24h." });
  }

  return (
    <div className="flex min-h-screen">

      {/* ── Panel izquierdo oscuro (como el login pero con acento dorado) ── */}
      <div className="hidden w-[380px] shrink-0 flex-col justify-between bg-[#0C1A2E] p-10 lg:flex relative overflow-hidden">
        {/* Orbe dorado */}
        <div className="absolute top-[-10%] right-[-20%] h-[400px] w-[400px] rounded-full bg-[#C9A227]/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-15%] h-[300px] w-[300px] rounded-full bg-[#1E40AF]/20 blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Logo */}
        <Link href={ROUTES.PUBLIC.HOME} className="relative z-10 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#1E40AF]">
            <span className="text-xs font-bold text-white">EC</span>
          </div>
          <span className="text-sm font-semibold text-white">EgresadosConnect</span>
        </Link>

        {/* Contenido central */}
        <div className="relative z-10 space-y-6">
          <div>
            <div className="gold-rule" />
            <h2 className="mt-4 text-3xl font-normal text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Registro<br />
              <em className="not-italic text-[#C9A227]">Corporativo</em>
            </h2>
            <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
              Únase a nuestra red para acceder al talento más destacado. La verificación garantiza un ecosistema de confianza.
            </p>
          </div>

          {/* Badge proceso seguro */}
          <div className="flex items-center gap-3 rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/10 p-3">
            <Shield className="h-5 w-5 text-[#C9A227] shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[#C9A227]">Proceso seguro</p>
              <p className="text-[10px] text-[#64748B]">Validación manual en 24 horas</p>
            </div>
          </div>

          {/* Stepper vertical */}
          <nav className="space-y-1">
            {steps.map((s, idx) => (
              <div key={s.id}>
                <div className={`flex items-center gap-3 rounded-lg px-2 py-2 transition-colors ${step === s.id ? "bg-white/5" : ""}`}>
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                    step > s.id ? "bg-[#C9A227] text-[#0C1A2E]" :
                    step === s.id ? "bg-[#3B82F6] text-white" :
                    "border border-[#2D4A6E] text-[#475569]"
                  }`}>
                    {step > s.id ? <Check className="h-3 w-3" /> : s.id}
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${step === s.id ? "text-white" : step > s.id ? "text-[#94A3B8]" : "text-[#475569]"}`}>{s.label}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && <div className={`ml-5 h-4 w-px ${step > s.id ? "bg-[#C9A227]/30" : "bg-[#1E2D4E]"}`} />}
              </div>
            ))}
          </nav>
        </div>

        <p className="relative z-10 text-xs text-[#475569]">
          ¿Ya tiene cuenta?{" "}
          <Link href={ROUTES.AUTH.LOGIN} className="text-[#60A5FA] hover:underline">Iniciar Sesión</Link>
        </p>
      </div>

      {/* ── Contenido principal — Fondo oscuro también para empresas ── */}
      <div className="flex flex-1 items-center justify-center bg-[#132038] px-6 py-12">
        <div className="w-full max-w-lg">

          {/* Mobile progress */}
          <div className="mb-6 flex gap-1.5 lg:hidden">
            {steps.map((s) => (
              <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-all ${step >= s.id ? "bg-[#C9A227]" : "bg-[#1E2D4E]"}`} />
            ))}
          </div>

          {/* Paso header */}
          <div className="mb-8">
            <span className="badge-editorial text-[#475569]">Paso {step} de {steps.length}</span>
            <h3 className="mt-1 text-3xl font-normal text-white" style={{ fontFamily: "var(--font-display)" }}>
              {steps[step - 1].label}
            </h3>
            <div className="h-px w-12 bg-[#C9A227] mt-3" />
            <p className="mt-2 text-sm text-[#64748B]">{steps[step - 1].desc}</p>
          </div>

          {/* Formulario oscuro */}
          <div className="rounded-2xl border border-[#1E2D4E] bg-[#0C1A2E] p-8">
            <form onSubmit={handleNext} className="space-y-4">
              {step === 1 && (
                <>
                  <FormField id="co-email" label="Correo electrónico corporativo" type="email" placeholder="contacto@empresa.com" />
                  <FormField id="co-pass" label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" />
                  <FormField id="co-pass2" label="Confirmar contraseña" type="password" placeholder="Repite la contraseña" />
                </>
              )}
              {step === 2 && (
                <>
                  <FormField id="co-ruc" label="RUC" placeholder="20123456789" hint="RUC de 11 dígitos de la empresa" />
                  <FormField id="co-razon" label="Razón social" placeholder="Nombre legal de la empresa" />
                  <FormField id="co-comercial" label="Nombre comercial" placeholder="Marca o nombre comercial" />
                  <FormField id="co-sector" label="Sector" placeholder="Tecnología, Minería, Salud..." />
                </>
              )}
              {step === 3 && (
                <>
                  <FormField id="co-phone" label="Teléfono" placeholder="(01) 234-5678" />
                  <FormField id="co-web" label="Sitio web" placeholder="https://www.empresa.com" />
                  <FormField id="co-location" label="Ubicación" placeholder="Lima, Perú" />
                  <FormField id="co-contact" label="Nombre del contacto" placeholder="Ej: María García (RRHH)" />
                </>
              )}
              {step === 4 && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="co-desc" className="text-xs font-semibold uppercase tracking-wide text-[#E2E8F0]">Descripción de la empresa</Label>
                    <Textarea id="co-desc" placeholder="Describa brevemente su empresa, valores y misión..."
                      className="min-h-[110px] bg-[#1E2D4E]/60 border-[#2D4A6E] text-white placeholder:text-[#475569] focus:border-[#3B82F6] transition-colors resize-none" />
                  </div>
                  {/* Warning */}
                  <div className="rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/10 p-4 flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-[#C9A227] mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#C9A227]">Validación requerida</p>
                      <p className="text-xs text-[#64748B] mt-1">Todos los registros corporativos son verificados por la administración antes de habilitar la publicación de ofertas. El proceso tarda hasta 24 horas.</p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between pt-2">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}
                    className="border-[#2D4A6E] text-[#94A3B8] hover:bg-[#1E2D4E] hover:text-white bg-transparent">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                  </Button>
                ) : (
                  <Link href={ROUTES.AUTH.REGISTER}>
                    <Button type="button" variant="outline"
                      className="border-[#2D4A6E] text-[#94A3B8] hover:bg-[#1E2D4E] hover:text-white bg-transparent">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                    </Button>
                  </Link>
                )}
                <Button type="submit" className="btn-shine bg-[#C9A227] hover:bg-[#B8911F] text-[#0C1A2E] font-semibold px-6">
                  {step < 4 ? (<>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></>) : (
                    <><Building2 className="mr-2 h-4 w-4" /> Enviar solicitud</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
