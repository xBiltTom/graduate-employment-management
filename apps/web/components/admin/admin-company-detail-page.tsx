"use client";

import { toast } from "sonner";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Button } from "@/components/ui/button";

export function AdminCompanyDetailPage({
  company,
}: {
  company: {
    nombreComercial: string;
    razonSocial: string;
    ruc: string;
    sector: string;
    email: string;
    telefono: string;
    sitioWeb: string;
    ciudad: string;
    region: string;
    descripcion: string;
    estadoValidacion: string;
    ofertasPublicadas: number;
    fechaRegistro: string;
  };
}) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">{company.nombreComercial}</h1>
            <AdminStatusBadge status={company.estadoValidacion} />
          </div>
          <p className="mt-2 text-[var(--color-text-muted)]">{company.razonSocial} · registro {company.fechaRegistro}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.info("Corrección solicitada solo en UI.")}>Solicitar corrección</Button>
          <Button variant="outline" onClick={() => toast.info("Rechazo temporal sin backend.")}>Rechazar</Button>
          <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white" onClick={() => toast.success("Aprobación simulada.")}>Aprobar empresa</Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminSectionCard title="Información legal e institucional">
          <div className="grid gap-5 md:grid-cols-2">
            <div><p className="text-sm font-semibold text-[var(--color-text-heading)]">RUC</p><p className="mt-2 text-[var(--color-text-body)]">{company.ruc}</p></div>
            <div><p className="text-sm font-semibold text-[var(--color-text-heading)]">Sector</p><p className="mt-2 text-[var(--color-text-body)]">{company.sector}</p></div>
            <div><p className="text-sm font-semibold text-[var(--color-text-heading)]">Correo</p><p className="mt-2 text-[var(--color-text-body)]">{company.email}</p></div>
            <div><p className="text-sm font-semibold text-[var(--color-text-heading)]">Teléfono</p><p className="mt-2 text-[var(--color-text-body)]">{company.telefono}</p></div>
            <div><p className="text-sm font-semibold text-[var(--color-text-heading)]">Sitio web</p><p className="mt-2 text-[var(--color-text-body)]">{company.sitioWeb}</p></div>
            <div><p className="text-sm font-semibold text-[var(--color-text-heading)]">Ubicación</p><p className="mt-2 text-[var(--color-text-body)]">{company.ciudad}, {company.region}</p></div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Resumen operativo">
          <div className="space-y-4">
            <div className="rounded-2xl bg-[var(--color-surface-page)] p-4">
              <p className="text-sm font-semibold text-[var(--color-text-heading)]">Descripción</p>
              <p className="mt-2 leading-7 text-[var(--color-text-body)]">{company.descripcion}</p>
            </div>
            <div className="rounded-2xl bg-[var(--color-surface-page)] p-4">
              <p className="text-sm font-semibold text-[var(--color-text-heading)]">Ofertas publicadas</p>
              <p className="mt-2 font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">{company.ofertasPublicadas}</p>
            </div>
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
