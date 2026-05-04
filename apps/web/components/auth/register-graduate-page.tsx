"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/routes";
import { toast } from "sonner";

const steps = [
  { id: 1, label: "Cuenta", desc: "Credenciales de acceso" },
  { id: 2, label: "Datos personales", desc: "Información básica" },
  { id: 3, label: "Datos académicos", desc: "Estudios y logros" },
  { id: 4, label: "Habilidades", desc: "Áreas de expertise" },
];

function FormField({ id, label, type = "text", placeholder }: { id: string; label: string; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-[#374151] uppercase tracking-wide">{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} className="bg-white border-[#DDD9D0] h-11 focus:border-[#1E40AF] transition-colors" />
    </div>
  );
}

export function RegisterGraduatePage() {
  const [step, setStep] = useState(1);

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (step < 4) { setStep(step + 1); return; }
    toast.success("¡Cuenta creada!", { description: "Funcionalidad pendiente de conexión con backend." });
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAF5]">

      {/* ── Sidebar izquierdo — Stepper visual ── */}
      <div className="hidden w-72 shrink-0 flex-col justify-between border-r border-[#DDD9D0] bg-white p-10 lg:flex">
        <div>
          <Link href={ROUTES.PUBLIC.HOME} className="flex items-center gap-2 mb-10">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#1E40AF]">
              <span className="text-xs font-bold text-white">EC</span>
            </div>
            <span className="font-semibold text-[#0C1A2E] text-sm">EgresadosConnect</span>
          </Link>

          <div>
            <span className="badge-editorial text-[#6B7280]">Registro de Egresado</span>
            <h2 className="mt-2 text-2xl font-normal text-[#0C1A2E]" style={{ fontFamily: "var(--font-display)" }}>
              Crea tu perfil
            </h2>
            <p className="mt-1 text-xs text-[#6B7280] leading-relaxed">
              Completa tu información para conectar con las mejores oportunidades.
            </p>
          </div>

          {/* Stepper */}
          <nav className="mt-10 space-y-1">
            {steps.map((s, idx) => (
              <div key={s.id}>
                <div className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${step === s.id ? "bg-[#EFF4FF]" : ""}`}>
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                    step > s.id ? "bg-[#059669] text-white" :
                    step === s.id ? "bg-[#1E40AF] text-white shadow-md shadow-[#1E40AF]/30" :
                    "border-2 border-[#DDD9D0] text-[#94A3B8]"
                  }`}>
                    {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${step === s.id ? "text-[#1E40AF]" : step > s.id ? "text-[#0C1A2E]" : "text-[#94A3B8]"}`}>{s.label}</p>
                    <p className="text-[10px] text-[#94A3B8]">{s.desc}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`ml-6 my-1 h-4 w-px ${step > s.id ? "bg-[#059669]/40" : "bg-[#DDD9D0]"}`} />
                )}
              </div>
            ))}
          </nav>
        </div>

        <p className="text-xs text-[#94A3B8]">
          ¿Ya tienes cuenta?{" "}
          <Link href={ROUTES.AUTH.LOGIN} className="text-[#1E40AF] hover:underline">Iniciar Sesión</Link>
        </p>
      </div>

      {/* ── Contenido principal ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">

          {/* Progress bar mobile */}
          <div className="mb-6 flex gap-1.5 lg:hidden">
            {steps.map((s) => (
              <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-all ${step >= s.id ? "bg-[#1E40AF]" : "bg-[#DDD9D0]"}`} />
            ))}
          </div>

          {/* Paso header */}
          <div className="mb-8">
            <span className="badge-editorial text-[#6B7280]">Paso {step} de {steps.length}</span>
            <h3 className="mt-1 text-3xl font-normal text-[#0C1A2E]" style={{ fontFamily: "var(--font-display)" }}>
              {steps[step - 1].label}
            </h3>
            <div className="gold-rule mt-3" />
            <p className="mt-2 text-sm text-[#6B7280]">{steps[step - 1].desc}</p>
          </div>

          {/* Formulario */}
          <div className="rounded-2xl border border-[#DDD9D0] bg-white p-8 shadow-sm">
            <form onSubmit={handleNext} className="space-y-4">
              {step === 1 && (
                <>
                  <FormField id="g-email" label="Correo electrónico" type="email" placeholder="tu@correo.com" />
                  <FormField id="g-pass" label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" />
                  <FormField id="g-pass2" label="Confirmar contraseña" type="password" placeholder="Repite tu contraseña" />
                  <p className="text-xs text-[#94A3B8] mt-1">Debe contener al menos 8 caracteres, una mayúscula y un número.</p>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField id="g-names" label="Nombres" placeholder="Tus nombres" />
                    <FormField id="g-surnames" label="Apellidos" placeholder="Tus apellidos" />
                  </div>
                  <FormField id="g-dni" label="DNI" placeholder="12345678" />
                  <FormField id="g-phone" label="Teléfono" placeholder="987 654 321" />
                </>
              )}
              {step === 3 && (
                <>
                  <FormField id="g-career" label="Carrera profesional" placeholder="Ingeniería de Sistemas" />
                  <FormField id="g-year" label="Año de egreso" placeholder="2024" />
                  <FormField id="g-institution" label="Institución" placeholder="Universidad Nacional..." />
                </>
              )}
              {step === 4 && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="g-skills-tech" className="text-xs font-semibold text-[#374151] uppercase tracking-wide">Habilidades técnicas</Label>
                    <Input id="g-skills-tech" placeholder="React, TypeScript, SQL, Python..." className="bg-white border-[#DDD9D0] h-11" />
                    <p className="text-xs text-[#94A3B8]">Separa las habilidades con comas.</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="g-skills-soft" className="text-xs font-semibold text-[#374151] uppercase tracking-wide">Habilidades blandas</Label>
                    <Input id="g-skills-soft" placeholder="Trabajo en equipo, Liderazgo..." className="bg-white border-[#DDD9D0] h-11" />
                  </div>
                  {/* Terms */}
                  <p className="text-xs text-[#6B7280] pt-2">
                    Al crear tu cuenta aceptas los{" "}
                    <span className="text-[#1E40AF] hover:underline cursor-pointer">Términos de Uso</span>
                    {" "}y la{" "}
                    <span className="text-[#1E40AF] hover:underline cursor-pointer">Política de Privacidad</span>.
                  </p>
                </>
              )}

              <div className="flex items-center justify-between pt-2">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}
                    className="border-[#DDD9D0] text-[#374151] hover:bg-[#F0EDE6]">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                  </Button>
                ) : (
                  <Link href={ROUTES.AUTH.REGISTER}>
                    <Button type="button" variant="outline" className="border-[#DDD9D0] text-[#374151] hover:bg-[#F0EDE6]">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                    </Button>
                  </Link>
                )}
                <Button type="submit" className="btn-shine bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-semibold px-6">
                  {step < 4 ? (<>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></>) : "Crear cuenta"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
