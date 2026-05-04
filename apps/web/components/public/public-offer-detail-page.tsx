import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Briefcase, Clock, CheckCircle, Building2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/lib/routes";
import { featuredJobs } from "@/lib/mock-data";

export function PublicOfferDetailPage({ id }: { id: string }) {
  const job = featuredJobs.find((j) => j.id === id);
  if (!job) notFound();

  return (
    <div className="flex-1 bg-[#FAFAF5]">
      {/* Breadcrumb */}
      <div className="border-b border-[#DDD9D0] bg-white">
        <div className="container mx-auto max-w-[1280px] px-6 py-4">
          <Link href={ROUTES.PUBLIC.OFERTAS}
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1E40AF] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver a ofertas
          </Link>
        </div>
      </div>

      {/* Hero de la oferta */}
      <div className="border-b border-[#DDD9D0] bg-white">
        <div className="container mx-auto max-w-[1280px] px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF4FF] to-[#DBEAFE] text-[#1E40AF] font-bold text-xl">
                {job.company.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-normal text-[#0C1A2E]" style={{ fontFamily: "var(--font-display)" }}>
                  {job.title}
                </h1>
                <p className="mt-1 text-base text-[#6B7280]">{job.company}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-[#6B7280]"><MapPin className="h-3 w-3" />{job.location}</span>
                  <span className="rounded-sm border border-[#DDD9D0] px-2 py-0.5 text-xs text-[#6B7280]">{job.modality}</span>
                  <span className="rounded-sm border border-[#DDD9D0] px-2 py-0.5 text-xs text-[#6B7280]">{job.contractType}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-[#1E40AF]/20 bg-[#EFF4FF]">
                <span className="text-lg font-bold text-[#1E40AF]" style={{ fontFamily: "var(--font-display)" }}>{job.match}</span>
                <span className="text-[9px] font-medium text-[#6B7280] uppercase tracking-wider">match</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto max-w-[1280px] px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* Main */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-[#DDD9D0] bg-white p-8">
              <h2 className="text-xl font-normal text-[#0C1A2E] mb-1" style={{ fontFamily: "var(--font-display)" }}>Descripción del puesto</h2>
              <div className="gold-rule mb-5" />
              <p className="text-sm text-[#374151] leading-loose">
                Buscamos un profesional talentoso y con ganas de crecer para unirse a nuestro equipo. Esta es una excelente oportunidad para egresados recientes que buscan un ambiente de trabajo dinámico, innovador y con proyección internacional. Trabajarás en proyectos de alto impacto con un equipo comprometido con la excelencia.
              </p>
            </div>

            <div className="rounded-2xl border border-[#DDD9D0] bg-white p-8">
              <h2 className="text-xl font-normal text-[#0C1A2E] mb-1" style={{ fontFamily: "var(--font-display)" }}>Requisitos</h2>
              <div className="gold-rule mb-5" />
              <ul className="space-y-3">
                {[
                  "Egresado de carreras de Ingeniería de Sistemas, Computación o afines.",
                  "Conocimiento sólido en las tecnologías listadas en las habilidades requeridas.",
                  "Capacidad de trabajo en equipo y comunicación asertiva.",
                  "Disponibilidad inmediata o máximo 2 semanas.",
                  "Inglés técnico nivel intermedio (deseable).",
                ].map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#1E40AF]" />
                    <span className="text-sm text-[#374151]">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#DDD9D0] bg-white p-8">
              <h2 className="text-xl font-normal text-[#0C1A2E] mb-1" style={{ fontFamily: "var(--font-display)" }}>Habilidades requeridas</h2>
              <div className="gold-rule mb-5" />
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span key={s} className="rounded-sm border border-[#1E40AF]/20 bg-[#EFF4FF] px-3 py-1.5 text-sm font-medium text-[#1E40AF]">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Salary & apply */}
            <div className="rounded-2xl border border-[#DDD9D0] bg-white overflow-hidden">
              <div className="bg-[#0C1A2E] p-6 text-center">
                <p className="text-xs text-[#64748B] uppercase tracking-wider mb-1">Rango salarial</p>
                <p className="text-2xl font-normal text-white" style={{ fontFamily: "var(--font-display)" }}>{job.salaryRange}</p>
              </div>
              <div className="p-6 space-y-3">
                <Link href={ROUTES.AUTH.LOGIN}>
                  <Button className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white btn-shine font-semibold">
                    Postular ahora
                  </Button>
                </Link>
                <p className="text-center text-xs text-[#94A3B8]">Debes iniciar sesión para postularte</p>
                <Separator className="bg-[#EBE8E0]" />
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-[#6B7280]">
                    <Briefcase className="h-3.5 w-3.5 text-[#94A3B8]" /> {job.contractType}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#6B7280]">
                    <MapPin className="h-3.5 w-3.5 text-[#94A3B8]" /> {job.location}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#6B7280]">
                    <Clock className="h-3.5 w-3.5 text-[#94A3B8]" /> Cierra próximamente
                  </div>
                </div>
              </div>
            </div>

            {/* Empresa */}
            <div className="rounded-2xl border border-[#DDD9D0] bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0FDF4]">
                  <Building2 className="h-5 w-5 text-[#059669]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0C1A2E]">{job.company}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Shield className="h-3 w-3 text-[#059669]" />
                    <span className="text-xs text-[#059669] font-medium">Empresa verificada</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Empresa líder del sector comprometida con el desarrollo de jóvenes talentos egresados de instituciones reconocidas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
