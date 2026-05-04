import Link from "next/link";
import { Search, MapPin, ArrowRight, SlidersHorizontal, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/routes";
import { featuredJobs } from "@/lib/mock-data";

const MODALIDAD_LABELS = ["Todos", "Remoto", "Híbrido", "Presencial"];

export function PublicOffersPage() {
  return (
    <div className="flex-1 bg-[#FAFAF5]">

      {/* Sub-header de página */}
      <div className="border-b border-[#DDD9D0] bg-white">
        <div className="container mx-auto max-w-[1280px] px-6 py-8">
          <span className="badge-editorial text-[#6B7280]">Portal laboral</span>
          <h1 className="mt-2 text-3xl font-normal text-[#0C1A2E]" style={{ fontFamily: "var(--font-display)" }}>
            Ofertas Laborales
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            {featuredJobs.length} oportunidades disponibles para egresados
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-[1280px] px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">

          {/* ── Sidebar de filtros ── */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-[#DDD9D0] bg-white p-5">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal className="h-4 w-4 text-[#1E40AF]" />
                <span className="text-sm font-semibold text-[#0C1A2E]">Filtros</span>
              </div>

              {/* Búsqueda */}
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  placeholder="Título, empresa, habilidad..."
                  className="pl-10 bg-[#FAFAF5] border-[#DDD9D0] text-sm"
                  readOnly
                />
              </div>

              {/* Modalidad */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Modalidad</p>
                <div className="space-y-2">
                  {MODALIDAD_LABELS.map((m, i) => (
                    <label key={m} className="flex items-center gap-2.5 cursor-pointer group">
                      <div className={`h-4 w-4 rounded border ${i === 0 ? "border-[#1E40AF] bg-[#1E40AF]" : "border-[#DDD9D0] bg-white"} transition-colors group-hover:border-[#1E40AF]`}>
                        {i === 0 && <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      </div>
                      <span className={`text-sm ${i === 0 ? "text-[#0C1A2E] font-medium" : "text-[#6B7280]"}`}>{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tipo contrato */}
              <div>
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Tipo de contrato</p>
                <div className="space-y-2">
                  {["Tiempo completo", "Medio tiempo", "Prácticas"].map((c) => (
                    <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="h-4 w-4 rounded border border-[#DDD9D0] bg-white transition-colors group-hover:border-[#1E40AF]" />
                      <span className="text-sm text-[#6B7280]">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA login sidebar */}
            <div className="rounded-xl border border-[#1E40AF]/20 bg-[#EFF4FF] p-5 text-center">
              <p className="text-sm font-semibold text-[#0C1A2E]">¿Quieres postularte?</p>
              <p className="text-xs text-[#6B7280] mt-1 mb-4">Crea tu cuenta o inicia sesión para acceder a todas las ofertas.</p>
              <Link href={ROUTES.AUTH.LOGIN}>
                <Button className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-sm">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href={ROUTES.AUTH.REGISTER} className="mt-2 block text-xs text-[#1E40AF] hover:underline">
                Crear cuenta gratis
              </Link>
            </div>
          </aside>

          {/* ── Lista de ofertas ── */}
          <div className="space-y-4">
            {featuredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#DDD9D0] border-dashed bg-white py-20 text-center">
                <Briefcase className="h-10 w-10 text-[#DDD9D0] mb-4" />
                <p className="text-sm font-medium text-[#6B7280]">No hay ofertas disponibles en este momento</p>
              </div>
            ) : (
              featuredJobs.map((job) => (
                <Link key={job.id} href={ROUTES.PUBLIC.OFERTA_DETAIL(job.id)}>
                  <div className="group rounded-2xl border border-[#DDD9D0] bg-white p-6 card-hover cursor-pointer">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      {/* Logo empresa */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EFF4FF] to-[#DBEAFE] text-[#1E40AF] font-bold text-base">
                        {job.company.charAt(0)}
                      </div>

                      {/* Info central */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-[#0C1A2E] group-hover:text-[#1E40AF] transition-colors text-base leading-tight">
                              {job.title}
                            </h3>
                            <p className="text-sm text-[#6B7280] mt-0.5">{job.company}</p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1.5">
                            <span className="rounded-full border border-[#1E40AF]/20 bg-[#EFF4FF] px-2.5 py-0.5 text-xs font-bold text-[#1E40AF]">
                              {job.match}% match
                            </span>
                            <span className="text-xs font-semibold text-[#059669]">{job.salaryRange}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1 text-xs text-[#6B7280]"><MapPin className="h-3 w-3" />{job.location}</span>
                          <span className="rounded-sm border border-[#DDD9D0] px-2 py-0.5 text-xs text-[#6B7280]">{job.modality}</span>
                          <span className="rounded-sm border border-[#DDD9D0] px-2 py-0.5 text-xs text-[#6B7280]">{job.contractType}</span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {job.skills.map((s) => (
                            <span key={s} className="border border-[#1E40AF]/20 bg-[#EFF4FF] px-2 py-0.5 text-[11px] text-[#1E40AF] rounded-sm">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] group-hover:gap-2 transition-all">
                        Ver detalle <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
