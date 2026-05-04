import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/lib/routes";
import { publicService } from "@/services";

export function PublicOfferDetailPage({ id }: { id: string }) {
  const job = publicService.getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-8 animate-fade-up">
          <Link
            href={ROUTES.PUBLIC.HOME}
            className="hover:text-[var(--color-brand)] transition-colors"
          >
            Inicio
          </Link>
          <span>/</span>
          <Link
            href={ROUTES.PUBLIC.OFERTAS}
            className="hover:text-[var(--color-brand)] transition-colors"
          >
            Ofertas
          </Link>
          <span>/</span>
          <span className="text-[var(--color-text-heading)] font-medium truncate">
            {job.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <Card className="border-[var(--color-border-subtle)] animate-fade-up">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-brand-light)] shrink-0">
                    <span className="text-lg font-bold text-[var(--color-brand)]">
                      {job.company.charAt(0)}
                    </span>
                  </div>
                  <div className="space-y-2 flex-1">
                    <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-text-heading)]">
                      {job.title}
                    </h1>
                    <p className="text-[var(--color-text-body)] font-medium">
                      {job.company}
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
                          variant="secondary"
                          className="text-xs bg-[var(--color-success)]/10 text-[var(--color-success)] border-0"
                        >
                          💰 {job.salaryRange}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-[var(--color-border-subtle)] animate-fade-up delay-100">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <h2 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-text-heading)]">
                    Descripción del puesto
                  </h2>
                  <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <Separator className="bg-[var(--color-border-subtle)]" />

                <div className="space-y-3">
                  <h2 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-text-heading)]">
                    Requisitos
                  </h2>
                  <ul className="space-y-2">
                    {job.requirements.map((req) => (
                      <li key={req} className="flex gap-3 text-sm">
                        <svg
                          className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--color-brand)]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-[var(--color-text-body)] leading-relaxed">
                          {req}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator className="bg-[var(--color-border-subtle)]" />

                <div className="space-y-3">
                  <h2 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-text-heading)]">
                    Habilidades requeridas
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-[var(--color-brand-light)] text-[var(--color-brand)] border-0"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply card */}
            <Card className="border-[var(--color-brand)]/20 bg-[var(--color-brand-light)]/30 animate-fade-up delay-200">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-[var(--color-text-heading)]">
                  ¿Te interesa esta oferta?
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Inicia sesión o regístrate para postular a esta y otras
                  ofertas exclusivas.
                </p>
                <div className="space-y-2">
                  <Link href={ROUTES.AUTH.LOGIN} className="block">
                    <Button className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white">
                      Iniciar Sesión para Postular
                    </Button>
                  </Link>
                  <Link href={ROUTES.AUTH.REGISTER} className="block">
                    <Button
                      variant="outline"
                      className="w-full border-[var(--color-brand)]/30 text-[var(--color-brand)]"
                    >
                      Crear Cuenta
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Company info */}
            <Card className="border-[var(--color-border-subtle)] animate-fade-up delay-300">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-[var(--color-text-heading)]">
                  Sobre la empresa
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-light)]">
                    <span className="text-sm font-bold text-[var(--color-brand)]">
                      {job.company.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-heading)] text-sm">
                      {job.company}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Empresa verificada
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card className="border-[var(--color-border-subtle)] animate-fade-up delay-400">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-[var(--color-text-heading)]">
                  Fechas
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">
                      Publicada
                    </span>
                    <span className="text-[var(--color-text-heading)] font-medium">
                      {job.publishedDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">
                      Cierre
                    </span>
                    <span className="text-[var(--color-text-heading)] font-medium">
                      {job.closingDate}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back link */}
            <Link href={ROUTES.PUBLIC.OFERTAS}>
              <Button
                variant="ghost"
                className="w-full text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
              >
                ← Volver al listado
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
