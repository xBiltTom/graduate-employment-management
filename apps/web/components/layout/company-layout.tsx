import Link from "next/link";
import { Bell, Briefcase, Building2, LayoutDashboard, Plus, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

const navigationItems = [
  {
    href: ROUTES.EMPRESA.INICIO,
    label: "Inicio",
    icon: LayoutDashboard,
  },
  {
    href: ROUTES.EMPRESA.OFERTAS,
    label: "Ofertas",
    icon: Briefcase,
  },
  {
    href: ROUTES.EMPRESA.PERFIL,
    label: "Perfil",
    icon: Building2,
  },
];

export function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface-page)]">
      <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border-subtle)] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href={ROUTES.EMPRESA.INICIO} className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand)] text-white shadow-sm transition-transform group-hover:scale-105">
                <span className="text-sm font-bold">E</span>
              </div>
              <span className="font-[var(--font-heading)] text-lg font-bold tracking-tight text-[var(--color-text-heading)]">
                Egresados<span className="text-[var(--color-brand)]">Connect</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand)]"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link href={ROUTES.EMPRESA.NUEVA_OFERTA} className="hidden sm:block">
              <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Publicar oferta
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]/60">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-9 w-9 border border-[var(--color-border-subtle)] bg-white">
              <AvatarFallback className="bg-[var(--color-brand-light)] text-[var(--color-brand)]">
                <Users className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-8 pb-24 md:pb-8">{children}</main>

      <footer className="border-t border-[var(--color-border-subtle)] bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-[var(--color-text-muted)] md:flex-row">
          <p>© 2024 Sistema de Gestión de Egresados. Plataforma Profesional.</p>
          <div className="flex gap-4">
            <span>Privacidad</span>
            <span>Términos de Uso</span>
            <span>Soporte Técnico</span>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-[var(--color-border-subtle)] bg-white md:hidden">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-full w-full flex-col items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
            >
              <Icon className="h-5 w-5" />
              <span className="mt-1 text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
