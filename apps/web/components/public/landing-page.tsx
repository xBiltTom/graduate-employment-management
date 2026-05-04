import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import type { JobSummary, PublicStat } from "@/types";

function HeroSection({ publicStats }: { publicStats: PublicStat[] }) {
  return (
    <section className="relative overflow-hidden hero-gradient-subtle">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[var(--color-brand)]/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[var(--color-teal)]/5 blur-3xl" />

      <div className="relative mx-auto max-w-[1280px] px-6 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-light)] px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--color-brand)] animate-pulse" />
              <span className="text-xs font-semibold text-[var(--color-brand)] uppercase tracking-wider">
                Plataforma Institucional
              </span>
            </div>

            <h1 className="font-[var(--font-heading)] text-4xl font-bold leading-[1.15] text-[var(--color-text-heading)] lg:text-5xl xl:text-[3.25rem]">
              Encuentra oportunidades laborales{" "}
              <span className="gradient-text">alineadas a tu perfil</span>{" "}
              profesional
            </h1>

            <p className="text-lg text-[var(--color-text-body)] leading-relaxed max-w-xl">
              Conecta directamente con las mejores empresas que buscan tu
              talento. Gestiona tus postulaciones, destaca tus habilidades y da
              el siguiente paso en tu carrera.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href={ROUTES.PUBLIC.OFERTAS}>
                <Button
                  size="lg"
                  className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-lg shadow-[var(--color-brand)]/20 px-8"
                >
                  Explorar ofertas
                </Button>
              </Link>
              <Link href={ROUTES.AUTH.REGISTER_GRADUATE}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[var(--color-border-subtle)] text-[var(--color-text-heading)] hover:bg-[var(--color-brand-light)] hover:border-[var(--color-brand)]/30"
                >
                  Registrarme como egresado
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats cluster */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-up delay-300">
            {publicStats.map((stat, idx) => (
              <Card
                key={stat.label}
                className={`card-hover border-[var(--color-border-subtle)] bg-[var(--color-surface-card)]/80 backdrop-blur-sm ${
                  idx === 0 ? "lg:translate-y-4" : ""
                } ${idx === 3 ? "lg:-translate-y-4" : ""}`}
              >
                <CardContent className="p-6 text-center space-y-2">
                  <p className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-brand)]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const graduateBenefits = [
    "Acceso exclusivo a ofertas laborales publicadas directamente por empresas verificadas.",
    "Seguimiento en tiempo real del estado de todas tus postulaciones activas.",
    "Perfil profesional digital destacado para que los reclutadores te encuentren fácilmente.",
  ];

  const companyBenefits = [
    "Publicación ilimitada de ofertas laborales dirigida a talento joven y especializado.",
    "Gestión de procesos de selección mediante herramientas integradas (Kanban de postulantes).",
    "Acceso directo a perfiles validados por la institución académica.",
  ];

  return (
    <section className="py-20 bg-[var(--color-surface-card)]">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="text-center space-y-4 mb-16 animate-fade-up">
          <h2 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">
            ¿Por qué usar EgresadosConnect?
          </h2>
          <p className="text-[var(--color-text-body)] max-w-2xl mx-auto">
            Una plataforma integral diseñada para potenciar la inserción laboral
            y fortalecer el vínculo entre la institución, sus egresados y el
            sector empresarial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Graduate benefits */}
          <Card className="border-[var(--color-border-subtle)] card-hover animate-fade-up delay-200">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-light)]">
                  <svg
                    className="h-5 w-5 text-[var(--color-brand)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <h3 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-text-heading)]">
                  Para Egresados
                </h3>
              </div>
              <ul className="space-y-4">
                {graduateBenefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3">
                    <svg
                      className="h-5 w-5 mt-0.5 flex-shrink-0 text-[var(--color-success)]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-[var(--color-text-body)] leading-relaxed">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href={ROUTES.AUTH.REGISTER_GRADUATE}>
                <Button
                  variant="outline"
                  className="w-full border-[var(--color-brand)]/30 text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]"
                >
                  Registrarme como egresado
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Company benefits */}
          <Card className="border-[var(--color-border-subtle)] card-hover animate-fade-up delay-400">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-teal-light)]">
                  <svg
                    className="h-5 w-5 text-[var(--color-teal)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-text-heading)]">
                  Para Empresas
                </h3>
              </div>
              <ul className="space-y-4">
                {companyBenefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3">
                    <svg
                      className="h-5 w-5 mt-0.5 flex-shrink-0 text-[var(--color-teal)]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-[var(--color-text-body)] leading-relaxed">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href={ROUTES.AUTH.REGISTER_COMPANY}>
                <Button
                  variant="outline"
                  className="w-full border-[var(--color-teal)]/30 text-[var(--color-teal)] hover:bg-[var(--color-teal-light)]"
                >
                  Publicar ofertas como empresa
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function FeaturedOffersSection({ featuredJobs }: { featuredJobs: JobSummary[] }) {
  return (
    <section className="py-20 bg-[var(--color-surface-page)]">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex items-end justify-between mb-10 animate-fade-up">
          <div className="space-y-2">
            <h2 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">
              Ofertas Destacadas
            </h2>
            <p className="text-[var(--color-text-muted)]">
              Oportunidades recientes de empresas verificadas
            </p>
          </div>
          <Link href={ROUTES.PUBLIC.OFERTAS}>
            <Button
              variant="ghost"
              className="text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]"
            >
              Ver todas →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredJobs.slice(0, 4).map((job, idx) => (
            <Link key={job.id} href={ROUTES.PUBLIC.OFERTA_DETAIL(job.id)}>
              <Card
                className={`border-[var(--color-border-subtle)] card-hover cursor-pointer animate-fade-up delay-${(idx + 1) * 100}`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-[var(--color-text-heading)] group-hover:text-[var(--color-brand)]">
                        {job.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {job.company}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-[var(--color-brand-light)] text-[var(--color-brand)] border-0 text-xs"
                    >
                      {job.match}% match
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs border-[var(--color-border-subtle)] text-[var(--color-text-muted)]"
                    >
                      📍 {job.location}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-[var(--color-border-subtle)] text-[var(--color-text-muted)]"
                    >
                      {job.modality}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-[var(--color-border-subtle)] text-[var(--color-text-muted)]"
                    >
                      {job.salaryRange}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-full bg-[var(--color-surface-page)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-body)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection({ publicStats }: { publicStats: PublicStat[] }) {
  return (
    <section className="py-16 hero-gradient">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-up">
          {publicStats.map((stat) => (
            <div key={stat.label} className="text-center space-y-2">
              <p className="font-[var(--font-heading)] text-3xl font-bold text-white lg:text-4xl">
                {stat.value}
              </p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-20 bg-[var(--color-surface-card)]">
      <div className="mx-auto max-w-[1280px] px-6 text-center space-y-6 animate-fade-up">
        <h2 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">
          ¿Listo para dar el siguiente paso?
        </h2>
        <p className="text-[var(--color-text-body)] max-w-lg mx-auto">
          Regístrate hoy y empieza a conectar con las mejores oportunidades
          laborales del mercado.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href={ROUTES.AUTH.REGISTER_GRADUATE}>
            <Button
              size="lg"
              className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-lg shadow-[var(--color-brand)]/20 px-8"
            >
              Soy Egresado
            </Button>
          </Link>
          <Link href={ROUTES.AUTH.REGISTER_COMPANY}>
            <Button
              size="lg"
              variant="outline"
              className="border-[var(--color-border-subtle)] text-[var(--color-text-heading)]"
            >
              Soy Empresa
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandingPage({
  featuredJobs,
  publicStats,
  errorMessage,
}: {
  featuredJobs: JobSummary[];
  publicStats: PublicStat[];
  errorMessage?: string;
}) {
  return (
    <>
      {errorMessage ? (
        <section className="border-b border-[var(--color-border-subtle)] bg-amber-50/80">
          <div className="mx-auto max-w-[1280px] px-6 py-3 text-sm text-amber-800">
            {errorMessage}
          </div>
        </section>
      ) : null}
      <HeroSection publicStats={publicStats} />
      <BenefitsSection />
      <FeaturedOffersSection featuredJobs={featuredJobs} />
      <StatsSection publicStats={publicStats} />
      <CtaSection />
    </>
  );
}
