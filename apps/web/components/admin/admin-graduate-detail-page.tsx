"use client";

import { toast } from "sonner";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AdminGraduateDetailPage({
  graduate,
  applications,
}: {
  graduate: {
    id: string;
    nombres: string;
    apellidos: string;
    email: string;
    telefono: string;
    carrera: string;
    anioEgreso: number;
    ciudad: string;
    region: string;
    estado: string;
    postulaciones: number;
    habilidades: string[];
    presentacion: string;
    archivos: { id: string; nombreArchivo: string; mimeType: string; tamanio: number }[];
    historial: { id: string; resumen: string; fecha: string }[];
  };
  applications: { id: string; title: string; company: string; status: string; appliedAt: string }[];
}) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">{graduate.nombres} {graduate.apellidos}</h1>
            <AdminStatusBadge status={graduate.estado} />
          </div>
          <p className="mt-2 text-[var(--color-text-muted)]">{graduate.carrera} · {graduate.ciudad}, {graduate.region} · egreso {graduate.anioEgreso}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.info("La edición administrativa real llegará después.")}>Editar</Button>
          <Button variant="outline" onClick={() => toast.info("La suspensión real no está habilitada en esta fase.")}>Suspender</Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminSectionCard title="Resumen profesional">
          <div className="space-y-5">
            <p className="leading-7 text-[var(--color-text-body)]">{graduate.presentacion}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-[var(--color-surface-page)] p-4">
                <p className="text-sm font-semibold text-[var(--color-text-heading)]">Contacto</p>
                <p className="mt-2 text-sm text-[var(--color-text-body)]">{graduate.email}</p>
                <p className="mt-1 text-sm text-[var(--color-text-body)]">{graduate.telefono}</p>
              </div>
              <div className="rounded-2xl bg-[var(--color-surface-page)] p-4">
                <p className="text-sm font-semibold text-[var(--color-text-heading)]">Actividad</p>
                <p className="mt-2 text-sm text-[var(--color-text-body)]">Postulaciones registradas: {graduate.postulaciones}</p>
              </div>
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Habilidades">
          <div className="flex flex-wrap gap-2">
            {graduate.habilidades.map((skill) => (
              <Badge key={skill} className="bg-[var(--color-brand-light)] text-[var(--color-brand)] border-0 hover:bg-[var(--color-brand-light)]">{skill}</Badge>
            ))}
          </div>
        </AdminSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminSectionCard title="Postulaciones">
          <div className="space-y-3">
            {applications.length ? applications.map((application) => (
              <div key={application.id} className="rounded-2xl border border-[var(--color-border-subtle)] p-4">
                <p className="font-semibold text-[var(--color-text-heading)]">{application.title}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{application.company} · {application.appliedAt}</p>
                <div className="mt-3"><AdminStatusBadge status={application.status} /></div>
              </div>
            )) : <p className="text-sm text-[var(--color-text-muted)]">Sin postulaciones registradas.</p>}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="CV e historial">
          <div className="space-y-4">
            <div className="rounded-2xl bg-[var(--color-surface-page)] p-4">
              <p className="text-sm font-semibold text-[var(--color-text-heading)]">Archivos</p>
              {graduate.archivos.length ? graduate.archivos.map((file) => (
                <p key={file.id} className="mt-2 text-sm text-[var(--color-text-body)]">{file.nombreArchivo} · {(file.tamanio / 1000000).toFixed(1)} MB</p>
              )) : <p className="mt-2 text-sm text-[var(--color-text-muted)]">Sin CV cargado.</p>}
            </div>
            <div className="space-y-3">
              {graduate.historial.map((entry) => (
                <div key={entry.id} className="rounded-2xl bg-[var(--color-surface-page)] p-4 text-sm">
                  <p className="font-medium text-[var(--color-text-heading)]">{entry.resumen}</p>
                  <p className="mt-1 text-[var(--color-text-muted)]">{entry.fecha}</p>
                </div>
              ))}
            </div>
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
