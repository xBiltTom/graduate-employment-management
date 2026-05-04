import Link from "next/link";
import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Sparkles,
  UserCog,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { ROUTES } from "@/lib/routes";

const mainItems = [
  { href: ROUTES.ADMIN.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.ADMIN.EGRESADOS, label: "Egresados", icon: GraduationCap },
  { href: ROUTES.ADMIN.EMPRESAS, label: "Empresas", icon: Building2 },
  { href: ROUTES.ADMIN.OFERTAS, label: "Ofertas", icon: Briefcase },
  { href: ROUTES.ADMIN.REPORTES, label: "Reportes", icon: BarChart3 },
  { href: ROUTES.ADMIN.HABILIDADES, label: "Habilidades", icon: Sparkles },
  { href: ROUTES.ADMIN.CONFIGURACION, label: "Configuración", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-surface-page)]">
      <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[var(--color-neutral-dark)] text-white lg:block">
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <Link href={ROUTES.ADMIN.DASHBOARD} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-brand)] text-white shadow-sm">
              <span className="text-sm font-bold">A</span>
            </div>
            <div>
              <p className="font-[var(--font-heading)] text-lg font-bold">EgresadosConnect</p>
              <p className="text-xs uppercase tracking-[0.2em] text-white/55">Admin</p>
            </div>
          </Link>
        </div>

        <div className="space-y-6 p-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Gestión principal</p>
            <div className="mt-4 space-y-1.5">
              {mainItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/72 transition-colors hover:bg-white/8 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(37,99,235,0.2),rgba(255,255,255,0.02))] p-4">
            <p className="text-sm font-semibold">Admin Principal</p>
            <p className="mt-1 text-sm text-white/65">admin@sistema.com</p>
            <p className="mt-4 text-xs leading-6 text-white/70">
              Supervisa validaciones, moderación y métricas globales desde un solo centro operativo.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center border-b border-[var(--color-border-subtle)] bg-white/85 px-6 backdrop-blur-md">
          <div className="lg:hidden">
            <Link href={ROUTES.ADMIN.DASHBOARD} className="font-[var(--font-heading)] text-lg font-bold text-[var(--color-text-heading)]">
              Admin
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-white text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand)]">
              <Bell className="h-4 w-4" />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-[var(--color-text-heading)]">Administrador</p>
              <p className="text-xs text-[var(--color-text-muted)]">Control global del sistema</p>
            </div>
            <LogoutButton variant="ghost" size="sm" showLabel={false} className="text-[var(--color-text-muted)] hover:text-[var(--color-brand)]" />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand)]">
              <UserCog className="h-4 w-4" />
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
