import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/routes";
import type { JobSummary } from "@/types";

function PublicOfferCard({
  job,
}: {
  job: JobSummary;
}) {
  return (
    <Link href={ROUTES.PUBLIC.OFERTA_DETAIL(job.id)}>
      <Card className="border-[var(--color-border-subtle)] card-hover cursor-pointer group">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-brand-light)] shrink-0">
                <span className="text-sm font-bold text-[var(--color-brand)]">
                  {job.company.charAt(0)}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-[var(--color-text-heading)] group-hover:text-[var(--color-brand)] transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {job.company}
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-[var(--color-brand-light)] text-[var(--color-brand)] border-0 text-xs shrink-0"
            >
              {job.match}% match
            </Badge>
          </div>

          <p className="text-sm text-[var(--color-text-body)] line-clamp-2 leading-relaxed">
            {job.description}
          </p>

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
              {job.contractType === "TIEMPO_COMPLETO"
                ? "Tiempo completo"
                : job.contractType}
            </Badge>
            {job.salaryRange && (
              <Badge
                variant="outline"
                className="text-xs border-[var(--color-border-subtle)] text-[var(--color-text-muted)]"
              >
                💰 {job.salaryRange}
              </Badge>
            )}
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

          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)]">
            <span className="text-xs text-[var(--color-text-muted)]">
              Cierra: {job.closingDate}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--color-brand)] hover:bg-[var(--color-brand-light)] text-xs"
            >
              Ver detalle →
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function PublicOffersPage({
  jobs,
  errorMessage,
}: {
  jobs: JobSummary[];
  errorMessage?: string;
}) {
  const hasJobs = jobs.length > 0;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[1280px] px-6 space-y-8">
        {/* Header */}
        <div className="space-y-4 animate-fade-up">
          <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">
            Ofertas Laborales
          </h1>
          <p className="text-[var(--color-text-body)] max-w-2xl">
            Explora oportunidades laborales diseñadas para tu perfil
            profesional. Filtra por ubicación, modalidad o área de interés.
          </p>
          {errorMessage ? (
            <p className="text-sm text-amber-700">{errorMessage}</p>
          ) : null}
        </div>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-up delay-100">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              placeholder="Buscar por título, empresa o habilidad..."
              className="pl-10 border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] focus-visible:ring-[var(--color-brand)]"
            />
          </div>
          <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shrink-0">
            Buscar
          </Button>
        </div>

        {/* Results */}
        {hasJobs ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job, idx) => (
              <div
                key={job.id}
                className={`animate-fade-up delay-${(idx + 2) * 100}`}
              >
                <PublicOfferCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <Card className="border-[var(--color-border-subtle)] border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-brand-light)]">
                <svg
                  className="h-8 w-8 text-[var(--color-brand)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="font-semibold text-[var(--color-text-heading)]">
                No hay ofertas disponibles
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] text-center max-w-md">
                Aún no se han publicado ofertas laborales. Vuelve pronto para
                descubrir nuevas oportunidades.
              </p>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Card className="border-[var(--color-brand)]/20 bg-[var(--color-brand-light)]/50 animate-fade-up">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
            <div className="space-y-1">
              <h3 className="font-semibold text-[var(--color-text-heading)]">
                ¿Quieres postular a estas ofertas?
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Crea tu cuenta para acceder a todas las funcionalidades.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href={ROUTES.AUTH.LOGIN}>
                <Button
                  variant="outline"
                  className="border-[var(--color-brand)]/30 text-[var(--color-brand)]"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href={ROUTES.AUTH.REGISTER}>
                <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white">
                  Regístrate
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
