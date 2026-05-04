import Link from "next/link";
import { ArrowRight, BarChart3, Briefcase, Building2, CheckCircle2, GraduationCap, Users } from "lucide-react";
import { AdminKpiCard } from "@/components/admin/admin-kpi-card";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Button } from "@/components/ui/button";
import { mockAdminCompanies, mockAdminOffers, mockAdminSkills, mockAdminStats } from "@/lib/mock-data";
import { companyValidationStatuses, offerStatuses } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";

const growthSeries = [42, 58, 66, 71, 84, 92];

export function AdminDashboardPage() {
  const pendingCompanies = mockAdminCompanies.filter((company) => company.estadoValidacion === companyValidationStatuses.pending);
  const pendingOffers = mockAdminOffers.filter((offer) => offer.estado === offerStatuses.pendingReview);
  const topSkills = mockAdminSkills.slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-up">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">Visión general</p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)] md:text-4xl">Dashboard administrativo</h1>
            <p className="mt-2 max-w-3xl text-[var(--color-text-muted)]">
              Supervisa crecimiento, validaciones pendientes y el estado operativo de la plataforma desde un mismo panel.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={ROUTES.ADMIN.EMPRESAS}>
              <Button variant="outline">Validar empresas</Button>
            </Link>
            <Link href={ROUTES.ADMIN.REPORTES}>
              <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white">Centro de reportes</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AdminKpiCard title="Egresados registrados" value={String(mockAdminStats.totalGraduates)} description="+12% este mes" icon={<GraduationCap className="h-5 w-5" />} />
        <AdminKpiCard title="Empresas activas" value={String(mockAdminStats.activeCompanies)} description="Ecosistema validado" icon={<Building2 className="h-5 w-5" />} />
        <AdminKpiCard title="Empresas pendientes" value={String(mockAdminStats.pendingCompanies)} description="Requieren revisión" icon={<Users className="h-5 w-5" />} />
        <AdminKpiCard title="Ofertas activas" value={String(mockAdminStats.activeOffers)} description="Publicaciones vigentes" icon={<Briefcase className="h-5 w-5" />} />
        <AdminKpiCard title="Postulaciones del mes" value={String(mockAdminStats.monthlyApplications)} description="Actividad reciente" icon={<BarChart3 className="h-5 w-5" />} />
        <AdminKpiCard title="Empleabilidad" value={`${mockAdminStats.employabilityRate}%`} description="Indicador institucional" icon={<CheckCircle2 className="h-5 w-5" />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminSectionCard title="Crecimiento de la red" description="Nuevos registros en los últimos meses.">
          <div className="flex items-end gap-4 rounded-3xl bg-[var(--color-surface-page)] px-5 py-8">
            {growthSeries.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex w-full items-end justify-center rounded-t-2xl bg-[linear-gradient(180deg,var(--color-brand),var(--color-teal))]" style={{ height: `${value * 2}px` }} />
                <span className="text-xs font-medium text-[var(--color-text-muted)]">{["Ene", "Feb", "Mar", "Abr", "May", "Jun"][index]}</span>
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Habilidades más demandadas" description="Basado en las ofertas publicadas recientemente.">
          <div className="space-y-4">
            {topSkills.map((skill) => (
              <div key={skill.id} className="rounded-2xl bg-[var(--color-surface-page)] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-[var(--color-text-heading)]">{skill.name}</p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">{skill.category}</p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-brand)]">{skill.usageInOffers} ofertas</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-brand),var(--color-teal))]" style={{ width: `${Math.min(100, skill.usageInOffers * 2)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </AdminSectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <AdminSectionCard title="Empresas pendientes de validación" description="Solicitudes que requieren revisión para habilitar publicaciones.">
          <div className="space-y-4">
            {pendingCompanies.map((company) => (
              <div key={company.id} className="rounded-2xl border border-[var(--color-border-subtle)] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-[var(--color-text-heading)]">{company.nombreComercial}</p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">RUC: {company.ruc} · {company.sector}</p>
                  </div>
                  <AdminStatusBadge status={company.estadoValidacion} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={ROUTES.ADMIN.EMPRESA_DETAIL(company.id)}>
                    <Button variant="outline">Ver detalle</Button>
                  </Link>
                  <Button variant="outline">Solicitar corrección</Button>
                  <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white">Aprobar</Button>
                </div>
              </div>
            ))}
            <Link href={ROUTES.ADMIN.EMPRESAS} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)]">
              Ver todas las solicitudes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Ofertas por moderar" description="Publicaciones que necesitan aprobación antes de ser visibles.">
          <div className="space-y-4">
            {pendingOffers.map((offer) => (
              <div key={offer.id} className="rounded-2xl border border-[var(--color-border-subtle)] p-4">
                <div className="flex flex-col gap-2">
                  <p className="font-semibold text-[var(--color-text-heading)]">{offer.titulo}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{offer.empresa} · {offer.ubicacion}</p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <AdminStatusBadge status={offer.estado} />
                  <Link href={ROUTES.ADMIN.OFERTAS} className="text-sm font-medium text-[var(--color-brand)]">
                    Revisar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </AdminSectionCard>
      </section>
    </div>
  );
}
