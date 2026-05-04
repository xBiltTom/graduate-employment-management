import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { Briefcase, Building2, LayoutDashboard, Settings, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';

export function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="w-64 border-r bg-background hidden md:block">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href={ROUTES.EMPRESA.INICIO} className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight">Empresa<span className="text-primary">Connect</span></span>
          </Link>
        </div>
        <div className="p-4 space-y-2">
          <Link href={ROUTES.EMPRESA.INICIO}>
            <span className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground">
              <LayoutDashboard className="h-4 w-4" /> Inicio
            </span>
          </Link>
          <Link href={ROUTES.EMPRESA.OFERTAS}>
            <span className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground">
              <Briefcase className="h-4 w-4" /> Ofertas
            </span>
          </Link>
          <Link href={ROUTES.EMPRESA.PERFIL}>
            <span className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground">
              <Building2 className="h-4 w-4" /> Perfil de Empresa
            </span>
          </Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="md:hidden">
            <Link href={ROUTES.EMPRESA.INICIO} className="font-bold">EmpresaConnect</Link>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link
              href={ROUTES.EMPRESA.NUEVA_OFERTA}
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              Publicar Oferta
            </Link>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback><Users className="h-4 w-4" /></AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
