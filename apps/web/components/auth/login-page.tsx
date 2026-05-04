"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/routes";
import { toast } from "sonner";

const testimonials = [
  { text: "Esta plataforma me permitió conectar con las mejores empresas a los pocos meses de graduarme.", author: "Sofía R.", role: "Egresada en Ingeniería de Sistemas" },
  { text: "Encontré mi primer empleo en menos de tres semanas. El proceso fue increíblemente sencillo.", author: "Marco A.", role: "Egresado en Administración" },
];

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error("Completa todos los campos."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.info("Funcionalidad pendiente de conexión con backend.");
    }, 800);
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Panel izquierdo — Editorial oscuro ── */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-[#0C1A2E] p-12 text-white lg:flex">
        {/* Orbe fondo */}
        <div className="absolute top-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#1E40AF]/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[300px] w-[300px] rounded-full bg-[#C9A227]/10 blur-[80px]" />

        {/* Patrón de puntos */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Logo */}
        <Link href={ROUTES.PUBLIC.HOME} className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#1E40AF]">
            <span className="text-xs font-bold text-white">EC</span>
          </div>
          <span className="text-base font-semibold" style={{ fontFamily: "var(--font-body)" }}>EgresadosConnect</span>
        </Link>

        {/* Texto central */}
        <div className="relative z-10 space-y-4">
          <div className="gold-rule" />
          <h2 className="text-4xl font-normal leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Conecta con tu<br />
            <em className="not-italic text-[#60A5FA]">futuro profesional.</em>
          </h2>
          <p className="text-sm text-[#64748B] max-w-sm leading-relaxed">
            Únete a la red institucional más grande. Descubre oportunidades exclusivas y lleva tu carrera al siguiente nivel.
          </p>
        </div>

        {/* Testimonio */}
        <div className="relative z-10 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-3 w-3 text-[#C9A227]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-[#CBD5E1] leading-relaxed italic">
            &ldquo;{testimonials[0].text}&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] flex items-center justify-center text-[10px] font-bold">
              {testimonials[0].author.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{testimonials[0].author}</p>
              <p className="text-[10px] text-[#475569]">{testimonials[0].role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Panel derecho — Formulario ── */}
      <div className="flex flex-1 items-center justify-center bg-[#FAFAF5] px-6 py-12">
        <div className="w-full max-w-[380px] animate-fade-up">

          {/* Mobile logo */}
          <Link href={ROUTES.PUBLIC.HOME} className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#1E40AF]">
              <span className="text-xs font-bold text-white">EC</span>
            </div>
            <span className="font-semibold text-[#0C1A2E]">EgresadosConnect</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-normal text-[#0C1A2E]" style={{ fontFamily: "var(--font-display)" }}>
              Iniciar Sesión
            </h1>
            <div className="gold-rule mt-3" />
            <p className="mt-3 text-sm text-[#6B7280]">Ingresa tus credenciales para acceder a tu plataforma.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-semibold text-[#374151] uppercase tracking-wide">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  id="login-email" type="email" placeholder="tu@correo.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white border-[#DDD9D0] h-11 focus:border-[#1E40AF] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-xs font-semibold text-[#374151] uppercase tracking-wide">
                  Contraseña
                </Label>
                <span className="text-xs text-[#1E40AF] hover:underline cursor-pointer">¿Olvidaste tu contraseña?</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white border-[#DDD9D0] h-11 focus:border-[#1E40AF] transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#374151] transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit" disabled={loading}
              className="w-full btn-shine bg-[#1E40AF] hover:bg-[#1E3A8A] text-white h-11 font-semibold mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando...
                </span>
              ) : (
                <span className="flex items-center gap-2">Acceder <ArrowRight className="h-4 w-4" /></span>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[#6B7280]">
            ¿No tienes cuenta?{" "}
            <Link href={ROUTES.AUTH.REGISTER} className="font-semibold text-[#1E40AF] hover:underline">
              Registrarse gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
