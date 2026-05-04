import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Bell, User, Search, Briefcase } from 'lucide-react';
import { LogoutButton } from '@/components/auth/logout-button';

export function GraduateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface)]">
      {/* Navbar Glassmorphic - Aligned with Public Layout */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border-subtle)] bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 max-w-[1280px]">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link href={ROUTES.EGRESADO.INICIO} className="flex items-center gap-2 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand)] text-white shadow-sm transition-transform group-hover:scale-105">
                  <span className="font-bold text-lg">E</span>
                </div>
                <span className="font-[var(--font-heading)] font-bold text-xl tracking-tight text-[var(--color-text-heading)]">
                  Egresados<span className="text-[var(--color-brand)]">Connect</span>
                </span>
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href={ROUTES.EGRESADO.INICIO} 
                  className="text-sm font-medium text-[var(--color-text-heading)] hover:text-[var(--color-brand)] transition-colors"
                >
                  Inicio
                </Link>
                <Link 
                  href={ROUTES.EGRESADO.OFERTAS} 
                  className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors"
                >
                  Ofertas
                </Link>
                <Link 
                  href={ROUTES.EGRESADO.POSTULACIONES} 
                  className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors"
                >
                  Mis Postulaciones
                </Link>
              </nav>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center gap-2">
              <Link href={ROUTES.EGRESADO.OFERTAS} className="hidden sm:block">
                <Button variant="ghost" size="icon" className="text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]/50">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={ROUTES.EGRESADO.NOTIFICACIONES}>
                <Button variant="ghost" size="icon" className="text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]/50 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-[var(--color-brand)] border-2 border-white"></span>
                </Button>
              </Link>
              <Link href={ROUTES.EGRESADO.PERFIL}>
                <Button variant="ghost" size="icon" className="text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]/50">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <LogoutButton variant="ghost" size="icon" showLabel={false} className="text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]/50" />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-8">
        {children}
      </main>
      
      {/* Minimal Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] bg-white py-6">
        <div className="container mx-auto px-6 max-w-[1280px] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} EgresadosConnect. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-sm text-[var(--color-text-muted)]">
            <Link href="#" className="hover:text-[var(--color-brand)] transition-colors">Soporte</Link>
            <Link href="#" className="hover:text-[var(--color-brand)] transition-colors">Términos</Link>
            <Link href="#" className="hover:text-[var(--color-brand)] transition-colors">Privacidad</Link>
          </div>
        </div>
      </footer>
      
      {/* Mobile Nav Bar - Bottom Fixed */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[var(--color-border-subtle)] flex items-center justify-around z-50 pb-safe">
        <Link href={ROUTES.EGRESADO.INICIO} className="flex flex-col items-center justify-center w-full h-full text-[var(--color-brand)]">
          <div className="p-1.5 rounded-full bg-[var(--color-brand-light)]">
            <User className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-medium mt-1">Inicio</span>
        </Link>
        <Link href={ROUTES.EGRESADO.OFERTAS} className="flex flex-col items-center justify-center w-full h-full text-[var(--color-text-muted)] hover:text-[var(--color-brand)]">
          <Search className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">Ofertas</span>
        </Link>
        <Link href={ROUTES.EGRESADO.POSTULACIONES} className="flex flex-col items-center justify-center w-full h-full text-[var(--color-text-muted)] hover:text-[var(--color-brand)]">
          <Briefcase className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">Trámites</span>
        </Link>
      </div>
    </div>
  );
}
