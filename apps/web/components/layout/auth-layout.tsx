import React from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left panel – institutional branding ── */}
      <div className="relative hidden lg:flex lg:w-[45%] flex-col justify-between hero-gradient p-10 text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 animate-float" />
        <div className="absolute bottom-32 -left-16 h-48 w-48 rounded-full bg-white/5 animate-float delay-300" />
        <div className="absolute bottom-10 right-24 h-32 w-32 rounded-full bg-white/[0.03]" />

        <div className="relative z-10">
          <Link
            href={ROUTES.PUBLIC.HOME}
            className="inline-flex items-center gap-2 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-105">
              <span className="text-sm font-bold text-white">E</span>
            </div>
            <span className="font-[var(--font-heading)] text-lg font-bold tracking-tight">
              EgresadosConnect
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="font-[var(--font-heading)] text-3xl font-bold leading-tight xl:text-4xl">
            Conecta con tu futuro profesional.
          </h1>
          <p className="text-base text-white/80 leading-relaxed max-w-md">
            Únete a la red institucional más grande. Descubre oportunidades
            exclusivas, expande tu red de contactos y lleva tu carrera al
            siguiente nivel.
          </p>
        </div>

        <div className="relative z-10">
          <blockquote className="space-y-2 border-l-2 border-white/30 pl-4">
            <p className="text-sm text-white/90 italic leading-relaxed">
              &ldquo;Esta plataforma me permitió conectar con las mejores
              empresas del país a los pocos meses de graduarme.&rdquo;
            </p>
            <footer className="text-xs text-white/60">
              Sofía R. – Egresada en Ingeniería
            </footer>
          </blockquote>
        </div>
      </div>

      {/* ── Right panel – form area ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[var(--color-surface-page)] p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">{children}</div>
      </div>
    </div>
  );
}
