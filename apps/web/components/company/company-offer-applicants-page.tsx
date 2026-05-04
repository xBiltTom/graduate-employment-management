"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { applicationStatuses } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import { ApplicantStatusBadge } from "@/components/company/applicant-status-badge";

type ApplicantRecord = {
  id: string;
  nombres: string;
  apellidos: string;
  carrera: string;
  skills: string[];
  match: number;
  status: string;
  hasCv: boolean;
};

const columns = [
  applicationStatuses.applied,
  applicationStatuses.reviewing,
  applicationStatuses.interview,
  applicationStatuses.hired,
  applicationStatuses.rejected,
];

const labelMap = {
  [applicationStatuses.applied]: "Postulados",
  [applicationStatuses.reviewing]: "En revisión",
  [applicationStatuses.interview]: "Entrevista",
  [applicationStatuses.hired]: "Contratados",
  [applicationStatuses.rejected]: "Rechazados",
} as const;

const nextStatusMap = {
  [applicationStatuses.applied]: applicationStatuses.reviewing,
  [applicationStatuses.reviewing]: applicationStatuses.interview,
  [applicationStatuses.interview]: applicationStatuses.hired,
  [applicationStatuses.hired]: applicationStatuses.rejected,
  [applicationStatuses.rejected]: applicationStatuses.applied,
} as const;

export function CompanyOfferApplicantsPage({
  offerTitle,
  applicants,
}: {
  offerTitle: string;
  applicants: ApplicantRecord[];
}) {
  const [items, setItems] = useState(applicants);

  const grouped = useMemo(() => {
    return columns.map((column) => ({
      column,
      items: items.filter((item) => item.status === column),
    }));
  }, [items]);

  const moveApplicant = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: nextStatusMap[item.status as keyof typeof nextStatusMap] }
          : item,
      ),
    );

    toast.success("Estado actualizado solo localmente.");
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">Pipeline de selección</p>
        <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">{offerTitle}</h1>
        <p className="text-[var(--color-text-muted)]">Organiza candidatos por etapa y revisa sus perfiles sin salir del flujo de reclutamiento.</p>
      </div>

      {items.length ? (
        <div className="grid gap-4 xl:grid-cols-5">
          {grouped.map((group) => (
            <Card key={group.column} className="border-[var(--color-border-subtle)] bg-white shadow-sm">
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base text-[var(--color-text-heading)]">{labelMap[group.column]}</CardTitle>
                  <Badge variant="outline">{group.items.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {group.items.length ? (
                  group.items.map((applicant) => (
                    <div key={applicant.id} className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-page)] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link href={ROUTES.EMPRESA.POSTULANTE_DETAIL(applicant.id)} className="font-semibold text-[var(--color-text-heading)] hover:text-[var(--color-brand)]">
                            {applicant.nombres} {applicant.apellidos}
                          </Link>
                          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{applicant.carrera}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--color-brand)]">{applicant.match}%</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {applicant.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} className="bg-white text-[var(--color-text-body)] border border-[var(--color-border-subtle)] hover:bg-white">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <ApplicantStatusBadge status={applicant.status} />
                        <Button size="sm" variant="outline" onClick={() => moveApplicant(applicant.id)}>
                          Mover
                        </Button>
                      </div>
                      <p className="mt-3 text-xs text-[var(--color-text-muted)]">{applicant.hasCv ? "CV disponible" : "CV pendiente"}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[var(--color-border-subtle)] p-4 text-sm text-[var(--color-text-muted)]">
                    Sin candidatos en esta etapa.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-[var(--color-border-subtle)] border-dashed shadow-sm">
          <CardContent className="p-8 text-center text-[var(--color-text-muted)]">
            Aún no hay postulantes para esta oferta.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
