"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { ApplicantStatusBadge } from "@/components/company/applicant-status-badge";

type OfferRecord = {
  id: string;
  job: {
    title: string;
    location: string;
    modality: string;
    contractType: string;
    salaryRange?: string;
    description: string;
    requirements: string[];
    skills: string[];
    closingDate: string;
    publishedDate: string;
  };
  status: string;
  applicationsCount: number;
  reviewingCount: number;
  interviewCount: number;
  hiredCount: number;
};

type ApplicantRecord = {
  id: string;
  nombres: string;
  apellidos: string;
  carrera: string;
  ciudad: string;
  status: string;
  match: number;
};

export function CompanyOfferDetailPage({
  offer,
  applicants,
}: {
  offer: OfferRecord;
  applicants: ApplicantRecord[];
}) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-700 border-0 hover:bg-emerald-100">{offer.status}</Badge>
            <span className="text-sm text-[var(--color-text-muted)]">Publicada {offer.job.publishedDate}</span>
          </div>
          <div>
            <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">{offer.job.title}</h1>
            <p className="mt-2 text-[var(--color-text-muted)]">
              {offer.job.location} · {offer.job.modality} · cierre {offer.job.closingDate}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.info("La edición de ofertas se conectará luego con el backend.")}>Editar</Button>
          <Button variant="outline" onClick={() => toast.info("El cierre de la oferta todavía es una acción visual.")}>Cerrar</Button>
          <Link href={ROUTES.EMPRESA.OFERTA_POSTULANTES(offer.id)}>
            <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white">Ver postulantes</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[var(--color-border-subtle)]"><CardContent className="p-5"><p className="text-sm text-[var(--color-text-muted)]">Postulaciones</p><p className="mt-2 text-3xl font-semibold text-[var(--color-text-heading)]">{offer.applicationsCount}</p></CardContent></Card>
        <Card className="border-[var(--color-border-subtle)]"><CardContent className="p-5"><p className="text-sm text-[var(--color-text-muted)]">En revisión</p><p className="mt-2 text-3xl font-semibold text-[var(--color-text-heading)]">{offer.reviewingCount}</p></CardContent></Card>
        <Card className="border-[var(--color-border-subtle)]"><CardContent className="p-5"><p className="text-sm text-[var(--color-text-muted)]">Entrevistas</p><p className="mt-2 text-3xl font-semibold text-[var(--color-text-heading)]">{offer.interviewCount}</p></CardContent></Card>
        <Card className="border-[var(--color-border-subtle)]"><CardContent className="p-5"><p className="text-sm text-[var(--color-text-muted)]">Contratados</p><p className="mt-2 text-3xl font-semibold text-[var(--color-text-heading)]">{offer.hiredCount}</p></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-[var(--color-border-subtle)] shadow-sm">
          <CardHeader>
            <CardTitle className="font-[var(--font-heading)] text-xl text-[var(--color-text-heading)]">Descripción de la vacante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="leading-7 text-[var(--color-text-body)]">{offer.job.description}</p>
            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--color-text-heading)]">Requisitos</p>
              <ul className="space-y-2 text-sm text-[var(--color-text-body)]">
                {offer.job.requirements.map((requirement) => (
                  <li key={requirement} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--color-text-heading)]">Habilidades clave</p>
              <div className="flex flex-wrap gap-2">
                {offer.job.skills.map((skill) => (
                  <Badge key={skill} className="bg-[var(--color-brand-light)] text-[var(--color-brand)] border-0 hover:bg-[var(--color-brand-light)]">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border-subtle)] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-[var(--font-heading)] text-xl text-[var(--color-text-heading)]">Postulantes recientes</CardTitle>
            <Link href={ROUTES.EMPRESA.OFERTA_POSTULANTES(offer.id)} className="text-sm font-medium text-[var(--color-brand)]">Pipeline</Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {applicants.length ? (
              applicants.slice(0, 3).map((applicant) => (
                <Link key={applicant.id} href={ROUTES.EMPRESA.POSTULANTE_DETAIL(applicant.id)} className="block rounded-2xl border border-[var(--color-border-subtle)] p-4 hover:border-[var(--color-brand)]/30">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--color-text-heading)]">{applicant.nombres} {applicant.apellidos}</p>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{applicant.carrera} · {applicant.ciudad}</p>
                    </div>
                    <span className="rounded-full bg-[var(--color-brand-light)] px-3 py-1 text-xs font-semibold text-[var(--color-brand)]">{applicant.match}%</span>
                  </div>
                  <div className="mt-3">
                    <ApplicantStatusBadge status={applicant.status} />
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--color-border-subtle)] p-6 text-sm text-[var(--color-text-muted)]">
                Aún no hay postulantes para esta oferta.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
