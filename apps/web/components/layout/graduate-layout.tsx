import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Bell, Search, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function GraduateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={ROUTES.EGRESADO.INICIO} className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight">Portal<span className="text-primary">Egresado</span></span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href={ROUTES.EGRESADO.INICIO} className="text-sm font-medium transition-colors hover:text-primary">Inicio</Link>
              <Link href={ROUTES.EGRESADO.OFERTAS} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Empleos</Link>
              <Link href={ROUTES.EGRESADO.POSTULACIONES} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Mis Postulaciones</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link href={ROUTES.EGRESADO.NOTIFICACIONES}>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={ROUTES.EGRESADO.PERFIL}>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}
