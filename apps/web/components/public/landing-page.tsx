import Link from "next/link";
import { ArrowRight, GraduationCap, Building2, CheckCircle, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/routes";
import { featuredJobs, publicStats } from "@/lib/mock-data";

const graduateBenefits = [
  "Ofertas exclusivas publicadas por empresas verificadas institucionalmente.",
  "Seguimiento en tiempo real del estado de tus postulaciones.",
  "Perfil profesional digital que los reclutadores encuentran fácilmente.",
];

const companyBenefits = [
  "Publicación de vacantes dirigidas a talento reciente y especializado.",
  "Gestión de procesos de selección con herramientas integradas.",
  "Acceso a perfiles validados por la institución académica.",
];

const statsConfig = [
  { icon: "👥", suffix: "+", label: "Egresados registrados" },
  { icon: "🏢", suffix: "+", label: "Empresas activas" },
  { icon: "💼", suffix: "+", label: "Ofertas publicadas" },
  { icon: "📋", suffix: "+", label: "Postulaciones realizadas" },
];

export function LandingPage() {
  return (
    <div className="flex flex-col">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0C1A2E] text-white min-h-[88vh] flex items-center">
        {/* Orbes de fondo animados */}
        <div className="absolute top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-[#1E40AF]/30 blur-[120px]"
          style={{ animation: "floatOrb 12s ease-in-out infinite" }} />
        <div className="absolute bottom-[-15%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#2563EB]/20 blur-[100px]"
          style={{ animation: "floatOrb 16s ease-in-out infinite reverse" }} />

        {/* Patrón de puntos sutil */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Línea dorada decorativa diagonal */}
        <div className="absolute top-0 right-1/3 h-full w-px bg-gradient-to-b from-transparent via-[#C9A227]/30 to-transparent" />

        <div className="container relative z-10 mx-auto max-w-[1280px] px-6 py-24 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

            {/* Columna izquierda — Texto editorial */}
            <div className="space-y-8 animate-fade-up">
              {/* Badge editorial */}
              <div className="inline-flex items-center gap-2 rounded-none border border-[#C9A227]/40 bg-[#C9A227]/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227]" style={{ animation: "pulseGold 2s ease-in-out infinite" }} />
                <span className="badge-editorial text-[#C9A227]">Plataforma Institucional</span>
              </div>

              {/* Titular serif — el diferenciador */}
              <div>
                <h1
                  className="text-5xl font-normal leading-[1.1] tracking-[-0.02em] lg:text-6xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Tu carrera profesional,{" "}
                  <em className="not-italic text-transparent"
                    style={{
                      background: "linear-gradient(135deg, #60A5FA, #93C5FD, #BFDBFE)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>
                    sin límites.
                  </em>
                </h1>
                <div className="gold-rule mt-5" />
              </div>

              <p className="max-w-lg text-base text-[#94A3B8] leading-relaxed stagger-2 animate-fade-up">
                Conectamos egresados universitarios con las mejores empresas del mercado. 
                Gestiona postulaciones, construye tu perfil y avanza en tu carrera desde 
                una plataforma institucional exclusiva.
              </p>

              {/* CTAs */}
              <div className="flex flex-col gap-3 sm:flex-row stagger-3 animate-fade-up">
                <Link href={ROUTES.AUTH.REGISTER_GRADUATE}>
                  <Button
                    size="lg"
                    className="btn-shine bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-semibold px-8 py-6 text-base shadow-lg shadow-[#1E40AF]/25"
                  >
                    Soy egresado
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={ROUTES.AUTH.REGISTER_COMPANY}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#DDD9D0]/30 text-[#D1D5DB] hover:bg-white/5 hover:text-white bg-transparent font-medium px-8 py-6 text-base"
                  >
                    <Building2 className="mr-2 h-5 w-5" />
                    Soy empresa
                  </Button>
                </Link>
              </div>

              {/* Confianza — avatares + número */}
              <div className="flex items-center gap-4 stagger-4 animate-fade-up">
                <div className="flex -space-x-2">
                  {["AT", "MR", "JC", "SL"].map((initials, i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-[#0C1A2E] bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] flex items-center justify-center text-[10px] font-bold text-white">
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">+1,200 egresados</p>
                  <p className="text-xs text-[#64748B]">ya encontraron empleo aquí</p>
                </div>
              </div>
            </div>

            {/* Columna derecha — Tarjetas flotantes con mock de ofertas */}
            <div className="relative hidden lg:block stagger-2 animate-fade-up">
              {/* Tarjeta principal */}
              <div className="relative z-10 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <span className="badge-editorial text-[#94A3B8]">Ofertas recientes</span>
                  <span className="badge-editorial rounded-full bg-[#16A34A]/20 px-2 py-0.5 text-[#4ADE80]">● Activas</span>
                </div>
                {featuredJobs.map((job, i) => (
                  <div key={job.id} className={`mb-3 last:mb-0 rounded-lg border border-white/5 bg-white/5 p-4 ${i === 0 ? "ring-1 ring-[#C9A227]/40" : ""}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{job.title}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">{job.company}</p>
                      </div>
                      <span className="rounded-full bg-[#1E40AF]/30 px-2 py-0.5 text-xs font-bold text-[#60A5FA]">{job.match}%</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {job.skills.slice(0, 2).map((s) => (
                        <span key={s} className="rounded-none border border-[#1E40AF]/40 px-2 py-0.5 text-[10px] text-[#93C5FD]">{s}</span>
                      ))}
                      <span className="text-xs text-[#4ADE80] ml-auto font-medium">{job.salaryRange}</span>
                    </div>
                  </div>
                ))}
                <Link href={ROUTES.PUBLIC.OFERTAS} className="mt-4 block">
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-white/10 py-3 text-xs text-[#64748B] hover:border-white/20 hover:text-white transition-all cursor-pointer">
                    Ver todas las ofertas <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </div>

              {/* Tarjeta flotante pequeña — match score */}
              <div className="absolute -bottom-6 -left-8 rounded-xl border border-white/10 bg-[#1E3A8A] p-4 shadow-xl">
                <p className="text-xs text-[#93C5FD] font-medium">Match promedio</p>
                <p className="text-2xl font-bold text-white mt-1"
                  style={{ fontFamily: "var(--font-display)" }}>82%</p>
                <p className="text-[10px] text-[#475569] mt-0.5">de compatibilidad</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gradiente de fade hacia la sección siguiente */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF5] to-transparent" />
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="bg-[#FAFAF5] border-b border-[#DDD9D0]">
        <div className="container mx-auto max-w-[1280px] px-6">
          <div className="grid grid-cols-2 gap-0 md:grid-cols-4 divide-x divide-[#DDD9D0]">
            {publicStats.map((stat, i) => (
              <div key={stat.label} className="flex flex-col items-center justify-center py-10 px-6 text-center">
                <span className="text-2xl mb-2">{statsConfig[i].icon}</span>
                <p
                  className="text-3xl font-normal text-[#0C1A2E]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-[#6B7280] mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ───────────────────────────────────────── */}
      <section className="bg-[#FAFAF5] py-24">
        <div className="container mx-auto max-w-[1280px] px-6">
          <div className="mb-16 max-w-xl">
            <span className="badge-editorial text-[#6B7280]">¿Por qué elegirnos?</span>
            <h2
              className="mt-3 text-4xl font-normal text-[#0C1A2E]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Una plataforma diseñada para dos mundos.
            </h2>
            <div className="gold-rule mt-4" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Para Egresados */}
            <div className="group relative overflow-hidden rounded-2xl border border-[#DDD9D0] bg-white p-10 card-hover">
              {/* Acento esquina */}
              <div className="absolute top-0 right-0 h-24 w-24 bg-[#EFF4FF] rounded-bl-[80px]" />
              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF4FF]">
                  <GraduationCap className="h-6 w-6 text-[#1E40AF]" />
                </div>
                <h3 className="text-2xl font-normal text-[#0C1A2E]" style={{ fontFamily: "var(--font-display)" }}>
                  Para Egresados
                </h3>
                <p className="mt-2 text-sm text-[#6B7280]">Tu ventaja profesional empieza aquí</p>
                <ul className="mt-6 space-y-4">
                  {graduateBenefits.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#1E40AF]" />
                      <span className="text-sm text-[#374151] leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
                <Link href={ROUTES.AUTH.REGISTER_GRADUATE} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#1E40AF] hover:gap-3 transition-all">
                  Registrarme como egresado <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Para Empresas */}
            <div className="group relative overflow-hidden rounded-2xl border border-[#DDD9D0] bg-[#0C1A2E] p-10 card-hover text-white">
              <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-[80px] bg-[#C9A227]/15" />
              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A227]/20">
                  <Building2 className="h-6 w-6 text-[#C9A227]" />
                </div>
                <h3 className="text-2xl font-normal text-white" style={{ fontFamily: "var(--font-display)" }}>
                  Para Empresas
                </h3>
                <p className="mt-2 text-sm text-[#64748B]">Talento verificado y listo para crecer</p>
                <ul className="mt-6 space-y-4">
                  {companyBenefits.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A227]" />
                      <span className="text-sm text-[#CBD5E1] leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
                <Link href={ROUTES.AUTH.REGISTER_COMPANY} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#C9A227] hover:gap-3 transition-all">
                  Registrar mi empresa <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OFERTAS DESTACADAS ───────────────────────────────── */}
      <section className="bg-[#F0EDE6] py-24">
        <div className="container mx-auto max-w-[1280px] px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="badge-editorial text-[#6B7280]">Oportunidades recientes</span>
              <h2 className="mt-3 text-4xl font-normal text-[#0C1A2E]"
                style={{ fontFamily: "var(--font-display)" }}>
                Ofertas destacadas
              </h2>
              <div className="gold-rule mt-4" />
            </div>
            <Link href={ROUTES.PUBLIC.OFERTAS} className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#1E40AF] hover:gap-3 transition-all">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {featuredJobs.map((job, index) => (
              <Link key={job.id} href={ROUTES.PUBLIC.OFERTA_DETAIL(job.id)}>
                <div className="group relative overflow-hidden rounded-2xl border border-[#DDD9D0] bg-white p-7 card-hover cursor-pointer">
                  {/* Match badge flotante */}
                  <div className="absolute top-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF4FF] border border-[#1E40AF]/10">
                    <span className="text-xs font-bold text-[#1E40AF] leading-none text-center">
                      {job.match}<br/><span className="font-normal opacity-70">%</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#EFF4FF] to-[#DBEAFE] text-[#1E40AF] font-bold text-sm">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0C1A2E] group-hover:text-[#1E40AF] transition-colors text-base">
                        {job.title}
                      </h3>
                      <p className="text-sm text-[#6B7280]">{job.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280] mb-5">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                    <span className="rounded-sm border border-[#DDD9D0] px-2 py-0.5">{job.modality}</span>
                    <span className="rounded-sm border border-[#DDD9D0] px-2 py-0.5">{job.contractType}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {job.skills.map((s) => (
                      <span key={s} className="rounded-none border border-[#1E40AF]/20 bg-[#EFF4FF] px-2 py-0.5 text-xs text-[#1E40AF]">{s}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#EBE8E0]">
                    <span className="text-sm font-semibold text-[#059669]">{job.salaryRange}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] group-hover:gap-2 transition-all">
                      Ver detalle <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0C1A2E] py-24 text-white">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] rounded-full bg-[#1E40AF]/20 blur-[80px]" />

        <div className="container relative z-10 mx-auto max-w-[1280px] px-6 text-center">
          <div className="gold-rule mx-auto" />
          <h2 className="mt-6 text-4xl font-normal leading-tight lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            El siguiente paso en tu carrera<br />
            <em className="not-italic text-[#60A5FA]">empieza hoy.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-[#64748B] leading-relaxed">
            Únete a más de 1,200 egresados que ya usan la plataforma para conectar con las mejores empresas del mercado peruano.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href={ROUTES.AUTH.REGISTER_GRADUATE}>
              <Button size="lg" className="btn-shine bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-semibold px-10 py-6 text-base shadow-lg shadow-[#1E40AF]/30">
                Crear cuenta gratis
              </Button>
            </Link>
            <Link href={ROUTES.AUTH.LOGIN}>
              <Button size="lg" variant="ghost" className="text-[#94A3B8] hover:text-white hover:bg-white/5 px-10 py-6 text-base">
                Ya tengo cuenta →
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
