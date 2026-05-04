"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAdminReports } from "@/lib/mock-data";
import { reportTypes } from "@/lib/constants";

const reportTypeLabel: Record<string, string> = {
  [reportTypes.graduatesByCareer]: "Egresados por carrera",
  [reportTypes.activeOffers]: "Ofertas activas",
  [reportTypes.applicationsByOffer]: "Postulaciones por oferta",
  [reportTypes.employability]: "Empleabilidad",
  [reportTypes.laborDemand]: "Demanda laboral",
  [reportTypes.cohortComparison]: "Comparativo de cohortes",
};

const reportOptions = Object.values(reportTypes);

export function AdminReportsPage() {
  const [reportType, setReportType] = useState(reportTypes.employability);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">Centro de reportes</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">Genera resúmenes operativos y métricas institucionales con una configuración guiada.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminSectionCard title="Configurar reporte" description="Selecciona tipo, filtros visuales y nivel de detalle.">
          <div className="grid gap-4 md:grid-cols-2">
            <Select value={reportType} onValueChange={(value) => setReportType(value ?? reportTypes.employability)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {reportOptions.map((option) => <SelectItem key={option} value={option}>{reportTypeLabel[option]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select defaultValue="2026">
              <SelectTrigger><SelectValue placeholder="Periodo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">Último año</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-careers">
              <SelectTrigger><SelectValue placeholder="Carrera" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all-careers">Todas las carreras</SelectItem>
                <SelectItem value="sis">Ingeniería de Sistemas</SelectItem>
                <SelectItem value="soft">Ingeniería de Software</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="summary">
              <SelectTrigger><SelectValue placeholder="Detalle" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Resumen ejecutivo</SelectItem>
                <SelectItem value="detail">Detallado</SelectItem>
                <SelectItem value="stats">Estadístico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 rounded-2xl bg-[var(--color-surface-page)] p-4 text-sm text-[var(--color-text-body)]">
            <p>Reporte seleccionado: <span className="font-semibold text-[var(--color-text-heading)]">{reportTypeLabel[reportType]}</span></p>
            <p className="mt-2 text-[var(--color-text-muted)]">La previsualización y la descarga son temporales en esta fase.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.info("La previsualización real será generada en una fase posterior.")}>Previsualizar</Button>
            <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white" onClick={() => toast.success("Generación de reporte simulada.")}>Generar reporte</Button>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Exportación rápida" description="Atajos visuales para reportes frecuentes.">
          <div className="space-y-3">
            <Card className="border-[var(--color-border-subtle)]"><CardContent className="flex items-center justify-between gap-4 p-4"><div><p className="font-medium text-[var(--color-text-heading)]">Reporte mensual estándar</p><p className="mt-1 text-sm text-[var(--color-text-muted)]">Último corte institucional</p></div><Button onClick={() => toast.success("Descarga simulada de reporte mensual.")}>Descargar</Button></CardContent></Card>
            <Card className="border-[var(--color-border-subtle)]"><CardContent className="flex items-center justify-between gap-4 p-4"><div><p className="font-medium text-[var(--color-text-heading)]">Empleabilidad por cohorte</p><p className="mt-1 text-sm text-[var(--color-text-muted)]">Resumen ejecutivo</p></div><Button variant="outline" onClick={() => toast.info("Acción visual sin PDF real.")}>Generar</Button></CardContent></Card>
          </div>
        </AdminSectionCard>
      </div>

      <AdminSectionCard title="Historial de reportes" description="Ejecuciones recientes y estado actual.">
        <div className="space-y-3">
          {mockAdminReports.map((report) => (
            <div key={report.id} className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border-subtle)] p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-[var(--color-text-heading)]">{reportTypeLabel[report.type]}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{report.createdAt} {report.fileName ? `· ${report.fileName}` : "· sin archivo aún"}</p>
              </div>
              <div className="flex items-center gap-2">
                <AdminStatusBadge status={report.status} />
                <Button variant="outline" size="sm" onClick={() => toast.info("La descarga real no está habilitada en esta fase.")}>Descargar</Button>
              </div>
            </div>
          ))}
        </div>
      </AdminSectionCard>
    </div>
  );
}
