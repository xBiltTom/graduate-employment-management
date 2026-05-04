import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { appConfig } from "@/lib/constants";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface-page)]">
      {/* ── Header (glassmorphic) ── */}
      <header className="sticky top-0 z-50 w-full glass border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
          <Link
            href={ROUTES.PUBLIC.HOME}
            className="flex items-center gap-2 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand)] transition-transform group-hover:scale-105">
              <span className="text-sm font-bold text-white">E</span>
            </div>
            <span className="font-[var(--font-heading)] text-lg font-bold tracking-tight text-[var(--color-text-heading)]">
              Egresados
              <span className="text-[var(--color-brand)]">Connect</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href={ROUTES.PUBLIC.HOME}
              className="text-sm font-medium text-[var(--color-text-heading)] transition-colors hover:text-[var(--color-brand)]"
            >
              Inicio
            </Link>
            <Link
              href={ROUTES.PUBLIC.OFERTAS}
              className="text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand)]"
            >
              Ofertas Laborales
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href={ROUTES.AUTH.LOGIN}>
              <Button
                variant="ghost"
                className="text-[var(--color-text-body)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link href={ROUTES.AUTH.REGISTER}>
              <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-sm">
                Regístrate
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-card)]">
        <div className="mx-auto max-w-[1280px] px-6 py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-brand)]">
                  <span className="text-xs font-bold text-white">E</span>
                </div>
                <span className="font-[var(--font-heading)] font-bold text-[var(--color-text-heading)]">
                  EgresadosConnect
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {appConfig.description}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[var(--color-text-heading)] uppercase tracking-wider">
                Plataforma
              </h4>
              <nav className="flex flex-col gap-2">
                <Link
                  href={ROUTES.PUBLIC.HOME}
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors"
                >
                  Inicio
                </Link>
                <Link
                  href={ROUTES.PUBLIC.OFERTAS}
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors"
                >
                  Ofertas Laborales
                </Link>
              </nav>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[var(--color-text-heading)] uppercase tracking-wider">
                Acceso
              </h4>
              <nav className="flex flex-col gap-2">
                <Link
                  href={ROUTES.AUTH.LOGIN}
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href={ROUTES.AUTH.REGISTER}
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors"
                >
                  Registrarse
                </Link>
              </nav>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[var(--color-text-heading)] uppercase tracking-wider">
                Legal
              </h4>
              <nav className="flex flex-col gap-2">
                <span className="text-sm text-[var(--color-text-muted)]">
                  Privacidad
                </span>
                <span className="text-sm text-[var(--color-text-muted)]">
                  Términos de Uso
                </span>
                <span className="text-sm text-[var(--color-text-muted)]">
                  Soporte Técnico
                </span>
              </nav>
            </div>
          </div>
          <div className="mt-8 border-t border-[var(--color-border-subtle)] pt-6 text-center">
            <p className="text-xs text-[var(--color-text-muted)]">
              © 2024 {appConfig.name}. Plataforma Profesional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
