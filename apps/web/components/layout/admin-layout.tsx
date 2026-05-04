import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { BarChart3, Briefcase, Building2, GraduationCap, LayoutDashboard, Settings, UserCog } from 'lucide-react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/10">
      <aside className="w-64 bg-slate-900 text-slate-50 flex-shrink-0 hidden lg:block">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link href={ROUTES.ADMIN.DASHBOARD} className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight text-white">Admin<span className="text-primary">Panel</span></span>
          </Link>
        </div>
        <div className="p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-4 px-2">Principal</div>
          <Link href={ROUTES.ADMIN.DASHBOARD}>
            <span className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-slate-800 text-white">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </span>
          </Link>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-6 px-2">Gestión</div>
          <Link href={ROUTES.ADMIN.EGRESADOS}>
            <span className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 text-slate-300">
              <GraduationCap className="h-4 w-4" /> Egresados
            </span>
          </Link>
          <Link href={ROUTES.ADMIN.EMPRESAS}>
            <span className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 text-slate-300">
              <Building2 className="h-4 w-4" /> Empresas
            </span>
          </Link>
          <Link href={ROUTES.ADMIN.OFERTAS}>
            <span className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 text-slate-300">
              <Briefcase className="h-4 w-4" /> Ofertas Laborales
            </span>
          </Link>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-6 px-2">Sistema</div>
          <Link href={ROUTES.ADMIN.REPORTES}>
            <span className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 text-slate-300">
              <BarChart3 className="h-4 w-4" /> Reportes
            </span>
          </Link>
          <Link href={ROUTES.ADMIN.CONFIGURACION}>
            <span className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 text-slate-300">
              <Settings className="h-4 w-4" /> Configuración
            </span>
          </Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-background flex items-center px-6 sticky top-0 z-10 shadow-sm">
          <div className="lg:hidden">
            <Link href={ROUTES.ADMIN.DASHBOARD} className="font-bold">AdminPanel</Link>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="text-sm font-medium">Administrador</div>
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
              <UserCog className="h-4 w-4 text-slate-600" />
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
