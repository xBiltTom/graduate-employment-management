import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

export function RegisterPage() {
  return (
    <div className="space-y-8 animate-fade-up">
      <div className="space-y-2 text-center">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-text-heading)]">
          Crea tu cuenta
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto">
          Selecciona tu perfil para acceder a la plataforma. Diseñamos
          herramientas específicas para cada tipo de usuario.
        </p>
      </div>

      <div className="grid gap-4">
        {/* Graduate card */}
        <Link href={ROUTES.AUTH.REGISTER_GRADUATE}>
          <Card className="border-[var(--color-border-subtle)] card-hover cursor-pointer group">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-light)] group-hover:bg-[var(--color-brand)] transition-colors">
                  <svg
                    className="h-5 w-5 text-[var(--color-brand)] group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-[var(--color-text-heading)]">
                    Soy egresado
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Accede a ofertas laborales exclusivas
                  </p>
                </div>
                <svg
                  className="h-5 w-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)] transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
                Conecta directamente con empresas líderes del sector y gestiona
                tu portafolio y desarrollo profesional en un solo lugar.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Company card */}
        <Link href={ROUTES.AUTH.REGISTER_COMPANY}>
          <Card className="border-[var(--color-border-subtle)] card-hover cursor-pointer group">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-teal-light)] group-hover:bg-[var(--color-teal)] transition-colors">
                  <svg
                    className="h-5 w-5 text-[var(--color-teal)] group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-[var(--color-text-heading)]">
                    Soy empresa
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Publica vacantes y recluta talento
                  </p>
                </div>
                <svg
                  className="h-5 w-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-teal)] transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
                Acceda a una base curada de talento profesional verificado y
                agilice sus procesos de reclutamiento.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
        <svg
          className="h-4 w-4 text-[var(--color-success)]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span>Plataforma segura y datos protegidos</span>
      </div>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        ¿Ya tienes cuenta?{" "}
        <Link
          href={ROUTES.AUTH.LOGIN}
          className="text-[var(--color-brand)] font-medium hover:underline"
        >
          Iniciar Sesión
        </Link>
      </p>
    </div>
  );
}
