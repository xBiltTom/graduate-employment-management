"use client";

import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicantStatusBadge } from "@/components/company/applicant-status-badge";

type ApplicantDetail = {
  nombres: string;
  apellidos: string;
  carrera: string;
  anioEgreso: number;
  ciudad: string;
  region: string;
  email: string;
  telefono: string;
  match: number;
  status: string;
  presentacion: string;
  skills: string[];
  archivos: { id: string; nombreArchivo: string; mimeType: string; tamanio: number }[];
  formaciones: { institucion: string; grado: string; campo: string; fechaInicio: string; fechaFin: string; descripcion: string }[];
  experiencias: { empresa: string; cargo: string; fechaInicio: string; fechaFin: string; descripcion: string }[];
  historial: { id: string; estadoAnterior: string | null; estadoNuevo: string; creadoEn: string }[];
};

export function CompanyApplicantDetailPage({ applicant }: { applicant: ApplicantDetail }) {
  const action = (message: string) => toast.success(message, { description: "Acción temporal. La integración real llegará después." });

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-[var(--color-border-subtle)] shadow-sm">
          <CardContent className="p-8 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">
                    {applicant.nombres} {applicant.apellidos}
                  </h1>
                  <ApplicantStatusBadge status={applicant.status} />
                </div>
                <p className="text-[var(--color-text-muted)]">
                  {applicant.carrera} · {applicant.ciudad}, {applicant.region} · egreso {applicant.anioEgreso}
                </p>
              </div>
              <div className="rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-page)] px-5 py-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">Match</p>
                <p className="mt-2 font-[var(--font-heading)] text-4xl font-bold text-[var(--color-text-heading)]">{applicant.match}%</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-[var(--color-surface-page)] p-4 text-sm">
                <p className="font-medium text-[var(--color-text-heading)]">Contacto</p>
                <p className="mt-2 text-[var(--color-text-body)]">{applicant.email}</p>
                <p className="mt-1 text-[var(--color-text-body)]">{applicant.telefono}</p>
              </div>
              <div className="rounded-2xl bg-[var(--color-surface-page)] p-4 text-sm">
                <p className="font-medium text-[var(--color-text-heading)]">Resumen profesional</p>
                <p className="mt-2 leading-6 text-[var(--color-text-body)]">{applicant.presentacion}</p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--color-text-heading)]">Habilidades</p>
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill) => (
                  <Badge key={skill} className="bg-[var(--color-brand-light)] text-[var(--color-brand)] border-0 hover:bg-[var(--color-brand-light)]">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border-subtle)] shadow-sm">
          <CardHeader>
            <CardTitle className="font-[var(--font-heading)] text-xl text-[var(--color-text-heading)]">Acciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white" onClick={() => action("Candidato movido a revisión")}>Mover a revisión</Button>
            <Button variant="outline" className="w-full" onClick={() => action("Entrevista agendada visualmente")}>Agendar entrevista</Button>
            <Button variant="outline" className="w-full" onClick={() => action("Candidato marcado como contratado")}>Contratar</Button>
            <Button variant="outline" className="w-full" onClick={() => action("Candidato marcado como rechazado")}>Rechazar</Button>
            <Button variant="outline" className="w-full" onClick={() => action("Canal de contacto preparado")}>Contactar</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-[var(--color-border-subtle)] shadow-sm lg:col-span-2">
          <CardHeader><CardTitle className="font-[var(--font-heading)] text-xl text-[var(--color-text-heading)]">Experiencia y formación</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--color-text-heading)]">Experiencia</p>
              <div className="space-y-4">
                {applicant.experiencias.map((experience) => (
                  <div key={`${experience.empresa}-${experience.cargo}`} className="rounded-2xl bg-[var(--color-surface-page)] p-4">
                    <p className="font-semibold text-[var(--color-text-heading)]">{experience.cargo}</p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">{experience.empresa} · {experience.fechaInicio} - {experience.fechaFin}</p>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-text-body)]">{experience.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--color-text-heading)]">Formación</p>
              <div className="space-y-4">
                {applicant.formaciones.map((education) => (
                  <div key={`${education.institucion}-${education.grado}`} className="rounded-2xl bg-[var(--color-surface-page)] p-4">
                    <p className="font-semibold text-[var(--color-text-heading)]">{education.grado}</p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">{education.institucion} · {education.fechaInicio} - {education.fechaFin}</p>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-text-body)]">{education.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-[var(--color-border-subtle)] shadow-sm">
            <CardHeader><CardTitle className="font-[var(--font-heading)] text-xl text-[var(--color-text-heading)]">Archivos</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {applicant.archivos.length ? (
                applicant.archivos.map((file) => (
                  <div key={file.id} className="rounded-2xl border border-[var(--color-border-subtle)] p-4 text-sm">
                    <p className="font-medium text-[var(--color-text-heading)]">{file.nombreArchivo}</p>
                    <p className="mt-1 text-[var(--color-text-muted)]">{file.mimeType} · {(file.tamanio / 1000000).toFixed(1)} MB</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--color-border-subtle)] p-4 text-sm text-[var(--color-text-muted)]">
                  Este perfil aún no tiene CV cargado.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-[var(--color-border-subtle)] shadow-sm">
            <CardHeader><CardTitle className="font-[var(--font-heading)] text-xl text-[var(--color-text-heading)]">Historial de postulación</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {applicant.historial.map((entry) => (
                <div key={entry.id} className="rounded-2xl bg-[var(--color-surface-page)] p-4 text-sm">
                  <p className="font-medium text-[var(--color-text-heading)]">{entry.estadoNuevo}</p>
                  <p className="mt-1 text-[var(--color-text-muted)]">{entry.creadoEn}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
