import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF5]">
      {/* Header premium — glassmorphism sobre crema */}
      <header className="sticky top-0 z-50 w-full border-b border-[#DDD9D0]/60 bg-[#FAFAF5]/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
          {/* Logo editorial */}
          <Link href={ROUTES.PUBLIC.HOME} className="flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-sm bg-[#1E40AF] transition-transform group-hover:scale-105">
              <span className="text-xs font-bold text-white tracking-tight">EC</span>
            </div>
            <span
              className="text-lg font-semibold text-[#0C1A2E] tracking-tight"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Egresados<span className="text-[#1E40AF]">Connect</span>
            </span>
          </Link>

          {/* Nav central */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href={ROUTES.PUBLIC.HOME}
              className="text-sm font-medium text-[#0C1A2E] transition-colors hover:text-[#1E40AF] relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#C9A227] after:transition-all hover:after:w-full"
            >
              Inicio
            </Link>
            <Link
              href={ROUTES.PUBLIC.OFERTAS}
              className="text-sm font-medium text-[#6B7280] transition-colors hover:text-[#1E40AF] relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#C9A227] after:transition-all hover:after:w-full"
            >
              Ofertas Laborales
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href={ROUTES.AUTH.LOGIN}>
              <Button
                variant="ghost"
                className="text-sm font-medium text-[#6B7280] hover:text-[#0C1A2E] hover:bg-[#EBE8E0]"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link href={ROUTES.AUTH.REGISTER}>
              <Button className="btn-shine bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-sm font-medium shadow-sm">
                Crear cuenta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer editorial */}
      <footer className="border-t border-[#DDD9D0] bg-[#0C1A2E] text-[#F0EDE6]">
        <div className="container mx-auto max-w-[1280px] px-6 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#1E40AF]">
                  <span className="text-xs font-bold text-white">EC</span>
                </div>
                <span className="text-sm font-semibold text-[#F0EDE6]">EgresadosConnect</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Plataforma institucional que conecta egresados universitarios con oportunidades profesionales verificadas.
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-[#F0EDE6] text-xs uppercase tracking-widest mb-3 text-[#C9A227]">Plataforma</p>
                <Link href={ROUTES.PUBLIC.HOME} className="block text-[#94A3B8] hover:text-[#F0EDE6] transition-colors">Inicio</Link>
                <Link href={ROUTES.PUBLIC.OFERTAS} className="block text-[#94A3B8] hover:text-[#F0EDE6] transition-colors">Ofertas Laborales</Link>
                <Link href={ROUTES.AUTH.REGISTER_GRADUATE} className="block text-[#94A3B8] hover:text-[#F0EDE6] transition-colors">Soy Egresado</Link>
                <Link href={ROUTES.AUTH.REGISTER_COMPANY} className="block text-[#94A3B8] hover:text-[#F0EDE6] transition-colors">Soy Empresa</Link>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-xs uppercase tracking-widest mb-3 text-[#C9A227]">Legal</p>
                <span className="block text-[#94A3B8] hover:text-[#F0EDE6] transition-colors cursor-pointer">Privacidad</span>
                <span className="block text-[#94A3B8] hover:text-[#F0EDE6] transition-colors cursor-pointer">Términos de Uso</span>
                <span className="block text-[#94A3B8] hover:text-[#F0EDE6] transition-colors cursor-pointer">Soporte</span>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-[#1E2D4E] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#475569]">
              © {new Date().getFullYear()} Sistema de Gestión de Egresados. Plataforma Profesional.
            </p>
            <div className="h-px w-8 bg-[#C9A227]" />
          </div>
        </div>
      </footer>
    </div>
  );
}
