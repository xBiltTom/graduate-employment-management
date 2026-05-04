import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href={ROUTES.PUBLIC.HOME} className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight">Egresados<span className="text-primary">Pro</span></span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href={ROUTES.PUBLIC.HOME} className="text-sm font-medium transition-colors hover:text-primary">Inicio</Link>
            <Link href={ROUTES.PUBLIC.OFERTAS} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Ofertas Laborales</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href={ROUTES.AUTH.LOGIN}>
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href={ROUTES.AUTH.REGISTER}>
              <Button>Regístrate</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with modern web standards.
          </p>
        </div>
      </footer>
    </div>
  );
}
