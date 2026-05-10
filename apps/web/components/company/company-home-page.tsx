import Link from "next/link";
import { ArrowRight, Briefcase, CalendarDays, CircleHelp, Plus, UserRoundSearch, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompanyKpiCard } from "@/components/company/company-kpi-card";
import { ApplicantStatusBadge } from "@/components/company/applicant-status-badge";
import { offerStatuses } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import type { CompanyApplicant, CompanyOfferSummary, CompanyProfile } from "@/types";

type CompanyHomePageProps = {
  profile: CompanyProfile;
  offers: CompanyOfferSummary[];
  applicants: CompanyApplicant[];
};

export function CompanyHomePage({
  profile,
  offers,
  applicants,
}: CompanyHomePageProps) {
  const activeOffers = offers.filter((offer) => offer.status === offerStatuses.active).length;
  const totalApplications = offers.reduce((acc, offer) => acc + offer.applicationsCount, 0);
  const interviews = offers.reduce((acc, offer) => acc + offer.interviewCount, 0);
  const hired = offers.reduce((acc, offer) => acc + offer.hiredCount, 0);
  const conversion = totalApplications > 0 ? Math.round((hired / totalApplications) * 100) : 0;
  const recentOffers = offers.filter((offer) => offer.job).slice(0, 2);
  const recentApplicants = applicants.slice(0, 3);
  const pipelineOfferId = recentOffers[0]?.id ?? applicants[0]?.offerId;

  return (
    <div className="space-y-8 animate-fade-up">
      <section className="overflow-hidden rounded-[28px] border border-[var(--color-border-subtle)] bg-white shadow-sm">
        <div className="grid gap-6 bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(20,184,166,0.03))] px-6 py-8 md:grid-cols-[1.6fr_0.8fr] md:px-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)] shadow-sm">
              Centro de reclutamiento
            </div>
            <div className="space-y-2">
              <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)] md:text-4xl">
                {profile.nombreComercial}
              </h1>
              <p className="max-w-2xl text-[15px] leading-7 text-[var(--color-text-body)]">
                Gestiona tus procesos de selección de manera ágil. Hoy tienes {recentApplicants.length} perfiles recientes y {interviews} entrevistas en curso.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={ROUTES.EMPRESA.NUEVA_OFERTA}>
                <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Publicar vacante
                </Button>
              </Link>
              <Link href={ROUTES.EMPRESA.OFERTAS}>
                <Button variant="outline" className="border-[var(--color-border-subtle)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]">
                  Ver mis ofertas
                </Button>
              </Link>
            </div>
          </div>

          <Card className="border-white/70 bg-white/80 shadow-sm backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-muted)]">Agenda inmediata</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--color-text-heading)]">Entrevistas y revisiones</p>
                </div>
                <CalendarDays className="h-5 w-5 text-[var(--color-brand)]" />
              </div>
              <div className="space-y-3 text-sm">
                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-4">
                  <p className="font-medium text-[var(--color-text-heading)]">10:00 AM · Entrevista técnica</p>
                  <p className="mt-1 text-[var(--color-text-muted)]">Carla Vega · Diseñadora UI / job-1</p>
                </div>
                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-4">
                  <p className="font-medium text-[var(--color-text-heading)]">2:30 PM · Revisión de perfil</p>
                  <p className="mt-1 text-[var(--color-text-muted)]">Luis Ramírez · Backend / job-1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <CompanyKpiCard label="Ofertas activas" value={String(activeOffers)} description="Vacantes visibles actualmente" icon={<Briefcase className="h-5 w-5" />} />
        <CompanyKpiCard label="Postulaciones" value={String(totalApplications)} description="Total acumulado en tus ofertas" icon={<Users className="h-5 w-5" />} />
        <CompanyKpiCard label="Entrevistas" value={String(interviews)} description="Candidatos en etapa final" icon={<CalendarDays className="h-5 w-5" />} />
        <CompanyKpiCard label="Contratados" value={String(hired)} description="Talento incorporado" icon={<UserRoundSearch className="h-5 w-5" />} />
        <CompanyKpiCard label="Conversión" value={`${conversion}%`} description="Contratados sobre postulaciones" icon={<CircleHelp className="h-5 w-5" />} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-[var(--color-border-subtle)] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-[var(--font-heading)] text-xl text-[var(--color-text-heading)]">Ofertas recientes</CardTitle>
            <Link href={ROUTES.EMPRESA.OFERTAS} className="text-sm font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]">
              Ver todas
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOffers.map((offer) => (
              <div key={offer.id} className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-5 transition-colors hover:border-[var(--color-brand)]/30">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <Link href={ROUTES.EMPRESA.OFERTA_DETAIL(offer.id)} className="font-semibold text-[var(--color-text-heading)] transition-colors hover:text-[var(--color-brand)]">
                      {offer.job?.title}
                    </Link>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {offer.job?.location} · cierre {offer.job?.closingDate}
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {offer.applicationsCount} postulaciones
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-[var(--color-surface-page)] p-3 text-sm">
                    <p className="text-[var(--color-text-muted)]">En revisión</p>
                    <p className="mt-1 font-semibold text-[var(--color-text-heading)]">{offer.reviewingCount}</p>
                  </div>
                  <div className="rounded-xl bg-[var(--color-surface-page)] p-3 text-sm">
                    <p className="text-[var(--color-text-muted)]">Entrevistas</p>
                    <p className="mt-1 font-semibold text-[var(--color-text-heading)]">{offer.interviewCount}</p>
                  </div>
                  <div className="rounded-xl bg-[var(--color-surface-page)] p-3 text-sm">
                    <p className="text-[var(--color-text-muted)]">Contratados</p>
                    <p className="mt-1 font-semibold text-[var(--color-text-heading)]">{offer.hiredCount}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border-subtle)] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-[var(--font-heading)] text-xl text-[var(--color-text-heading)]">Postulantes recientes</CardTitle>
            <Link href={pipelineOfferId ? ROUTES.EMPRESA.OFERTA_POSTULANTES(pipelineOfferId) : ROUTES.EMPRESA.OFERTAS} className="text-sm font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]">
              Ver pipeline
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplicants.map((applicant) => (
              <Link
                key={applicant.id}
                href={ROUTES.EMPRESA.POSTULANTE_DETAIL(applicant.id)}
                className="block rounded-2xl border border-[var(--color-border-subtle)] bg-white p-4 transition-colors hover:border-[var(--color-brand)]/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--color-text-heading)]">
                      {applicant.nombres} {applicant.apellidos}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      {applicant.carrera} · {applicant.ciudad}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--color-brand-light)] px-3 py-1 text-xs font-semibold text-[var(--color-brand)]">
                    {applicant.match}% match
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <ApplicantStatusBadge status={applicant.status} />
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand)]">
                    Ver perfil <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
