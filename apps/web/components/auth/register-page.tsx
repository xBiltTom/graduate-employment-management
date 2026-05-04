import Link from "next/link";
import { GraduationCap, Building2, ArrowRight, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF5]">

      {/* Top nav mínima */}
      <nav className="border-b border-[#DDD9D0] bg-white px-6 py-4">
        <div className="container mx-auto max-w-[1280px] flex items-center justify-between">
          <Link href={ROUTES.PUBLIC.HOME} className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#1E40AF]">
              <span className="text-xs font-bold text-white">EC</span>
            </div>
            <span className="font-semibold text-[#0C1A2E] text-sm">EgresadosConnect</span>
          </Link>
          <Link href={ROUTES.AUTH.LOGIN} className="text-sm text-[#6B7280] hover:text-[#1E40AF] transition-colors">
            Ya tengo cuenta → Iniciar sesión
          </Link>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">

        {/* Header editorial */}
        <div className="text-center max-w-xl mb-12 animate-fade-up">
          <span className="badge-editorial text-[#6B7280]">Crea tu cuenta</span>
          <h1 className="mt-3 text-4xl font-normal text-[#0C1A2E]" style={{ fontFamily: "var(--font-display)" }}>
            Selecciona tu perfil
          </h1>
          <div className="gold-rule mt-4 mx-auto" />
          <p className="mt-4 text-sm text-[#6B7280] leading-relaxed">
            Diseñamos herramientas específicas para impulsar carreras profesionales y optimizar el reclutamiento empresarial.
          </p>
        </div>

        {/* Cards de selección */}
        <div className="grid w-full max-w-2xl gap-5 sm:grid-cols-2 stagger-2 animate-fade-up">

          {/* Egresado */}
          <Link href={ROUTES.AUTH.REGISTER_GRADUATE}>
            <div className="group h-full rounded-2xl border border-[#DDD9D0] bg-white p-8 card-hover cursor-pointer relative overflow-hidden">
              {/* Acento esquina */}
              <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-[60px] bg-[#EFF4FF] transition-all group-hover:bg-[#DBEAFE]" />

              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF4FF] transition-colors group-hover:bg-[#DBEAFE]">
                  <GraduationCap className="h-7 w-7 text-[#1E40AF]" />
                </div>

                <h2 className="text-2xl font-normal text-[#0C1A2E]" style={{ fontFamily: "var(--font-display)" }}>
                  Soy egresado
                </h2>
                <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                  Accede a ofertas exclusivas, conecta con empresas y gestiona tu portafolio profesional.
                </p>

                <ul className="mt-5 space-y-2">
                  {["Ofertas laborales exclusivas", "Gestión de postulaciones", "Perfil profesional digital"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#374151]">
                      <CheckCircle className="h-3.5 w-3.5 text-[#1E40AF] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#1E40AF]">Comenzar</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFF4FF] group-hover:bg-[#1E40AF] transition-colors">
                    <ArrowRight className="h-4 w-4 text-[#1E40AF] group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Empresa */}
          <Link href={ROUTES.AUTH.REGISTER_COMPANY}>
            <div className="group h-full rounded-2xl border border-[#DDD9D0] bg-[#0C1A2E] p-8 card-hover cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-[60px] bg-[#C9A227]/15 transition-all group-hover:bg-[#C9A227]/25" />

              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A227]/20">
                  <Building2 className="h-7 w-7 text-[#C9A227]" />
                </div>

                <h2 className="text-2xl font-normal text-white" style={{ fontFamily: "var(--font-display)" }}>
                  Soy empresa
                </h2>
                <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
                  Publica vacantes, accede a talento verificado y agiliza tus procesos de reclutamiento.
                </p>

                <ul className="mt-5 space-y-2">
                  {["Publicar vacantes estratégicas", "Pipeline de postulantes", "Talento verificado"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#CBD5E1]">
                      <CheckCircle className="h-3.5 w-3.5 text-[#C9A227] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#C9A227]">Registrar empresa</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A227]/20 group-hover:bg-[#C9A227] transition-colors">
                    <ArrowRight className="h-4 w-4 text-[#C9A227] group-hover:text-[#0C1A2E] transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer de confianza */}
        <div className="mt-10 flex items-center gap-3 text-xs text-[#94A3B8] stagger-4 animate-fade-up">
          <Shield className="h-4 w-4 text-[#DDD9D0]" />
          <span>Plataforma segura y datos protegidos · © {new Date().getFullYear()} EgresadosConnect</span>
        </div>
      </div>
    </div>
  );
}
