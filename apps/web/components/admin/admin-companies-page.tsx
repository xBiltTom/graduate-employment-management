"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAdminCompanies } from "@/lib/mock-data";
import { ROUTES } from "@/lib/routes";

export function AdminCompaniesPage() {
  const [status, setStatus] = useState("all");

  const companies = useMemo(() => {
    return mockAdminCompanies.filter((company) => status === "all" || company.estadoValidacion === status);
  }, [status]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">Validación de empresas</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">Revisa solicitudes, valida perfiles institucionales y deja trazabilidad del proceso.</p>
      </div>

      <Tabs value={status} onValueChange={setStatus} className="w-full">
        <TabsList className="h-auto w-full flex-wrap justify-start border border-[var(--color-border-subtle)] bg-white p-1">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="PENDIENTE">Pendientes</TabsTrigger>
          <TabsTrigger value="APROBADA">Aprobadas</TabsTrigger>
          <TabsTrigger value="RECHAZADA">Rechazadas</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {companies.map((company) => (
          <Card key={company.id} className="border-[var(--color-border-subtle)] shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-text-heading)]">{company.nombreComercial}</h2>
                    <AdminStatusBadge status={company.estadoValidacion} />
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">{company.sector} · {company.email} · registrado {company.fechaRegistro}</p>
                  <p className="text-sm text-[var(--color-text-body)]">RUC: {company.ruc}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={ROUTES.ADMIN.EMPRESA_DETAIL(company.id)}>
                    <Button variant="outline">Ver detalle</Button>
                  </Link>
                  <Button variant="outline" onClick={() => toast.info("Solicitud de corrección marcada solo visualmente.")}>Solicitar corrección</Button>
                  <Button variant="outline" onClick={() => toast.info("Rechazo temporal, sin persistencia.")}>Rechazar</Button>
                  <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white" onClick={() => toast.success("Aprobación simulada localmente.")}>Aprobar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
