"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, Pencil, Plus, Search, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCompanyOffers } from "@/lib/mock-data";
import { offerStatuses } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";

const offerStatusLabel = {
  [offerStatuses.draft]: "Borrador",
  [offerStatuses.pendingReview]: "En revisión",
  [offerStatuses.approved]: "Aprobada",
  [offerStatuses.rejected]: "Rechazada",
  [offerStatuses.active]: "Activa",
  [offerStatuses.closed]: "Cerrada",
  [offerStatuses.expired]: "Expirada",
} as const;

const offerStatusClass = {
  [offerStatuses.draft]: "bg-slate-100 text-slate-700",
  [offerStatuses.pendingReview]: "bg-amber-100 text-amber-700",
  [offerStatuses.approved]: "bg-sky-100 text-sky-700",
  [offerStatuses.rejected]: "bg-rose-100 text-rose-700",
  [offerStatuses.active]: "bg-emerald-100 text-emerald-700",
  [offerStatuses.closed]: "bg-slate-200 text-slate-700",
  [offerStatuses.expired]: "bg-slate-200 text-slate-700",
} as const;

export function CompanyOffersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const offers = useMemo(() => {
    return mockCompanyOffers.filter((offer) => {
      if (!offer.job) return false;

      const matchesStatus = status === "all" || offer.status === status;
      const matchesSearch = offer.job.title.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [search, status]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">Mis ofertas</h1>
          <p className="text-[var(--color-text-muted)]">Gestiona tus vacantes activas, revisa resultados y abre nuevas oportunidades.</p>
        </div>
        <Link href={ROUTES.EMPRESA.NUEVA_OFERTA}>
          <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva oferta
          </Button>
        </Link>
      </div>

      <Card className="border-[var(--color-border-subtle)] shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por puesto..."
              className="h-11 border-[var(--color-border-subtle)] bg-white pl-9"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <Tabs value={status} onValueChange={setStatus} className="w-full">
            <TabsList className="h-auto w-full flex-wrap justify-start border border-[var(--color-border-subtle)] bg-[var(--color-surface-page)] p-1">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value={offerStatuses.active}>Activas</TabsTrigger>
              <TabsTrigger value={offerStatuses.pendingReview}>En revisión</TabsTrigger>
              <TabsTrigger value={offerStatuses.closed}>Cerradas</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {offers.length ? (
        <div className="space-y-4">
          {offers.map((offer) => (
            <Card key={offer.id} className="border-[var(--color-border-subtle)] shadow-sm">
              <CardContent className="p-6 space-y-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={ROUTES.EMPRESA.OFERTA_DETAIL(offer.id)} className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-text-heading)] hover:text-[var(--color-brand)]">
                        {offer.job?.title}
                      </Link>
                      <Badge className={`${offerStatusClass[offer.status as keyof typeof offerStatusClass]} border-0`}>
                        {offerStatusLabel[offer.status as keyof typeof offerStatusLabel]}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {offer.job?.location} · {offer.job?.modality} · cierre {offer.job?.closingDate}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={ROUTES.EMPRESA.OFERTA_DETAIL(offer.id)}>
                      <Button variant="outline" className="border-[var(--color-border-subtle)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-[var(--color-border-subtle)]"
                      onClick={() => toast.info("La edición real llegará en una fase posterior.")}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[var(--color-border-subtle)]"
                      onClick={() => toast.info("El cierre de ofertas será conectado al backend más adelante.")}
                    >
                      Cerrar
                    </Button>
                    <Link href={ROUTES.EMPRESA.OFERTA_POSTULANTES(offer.id)}>
                      <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white">
                        <Users className="h-4 w-4 mr-2" />
                        Postulantes
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl bg-[var(--color-surface-page)] p-4 text-sm">
                    <p className="text-[var(--color-text-muted)]">Postulaciones</p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--color-text-heading)]">{offer.applicationsCount}</p>
                  </div>
                  <div className="rounded-2xl bg-[var(--color-surface-page)] p-4 text-sm">
                    <p className="text-[var(--color-text-muted)]">En revisión</p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--color-text-heading)]">{offer.reviewingCount}</p>
                  </div>
                  <div className="rounded-2xl bg-[var(--color-surface-page)] p-4 text-sm">
                    <p className="text-[var(--color-text-muted)]">Entrevistas</p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--color-text-heading)]">{offer.interviewCount}</p>
                  </div>
                  <div className="rounded-2xl bg-[var(--color-surface-page)] p-4 text-sm">
                    <p className="text-[var(--color-text-muted)]">Contratados</p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--color-text-heading)]">{offer.hiredCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-[var(--color-border-subtle)] border-dashed shadow-sm">
          <CardHeader>
            <CardTitle className="font-[var(--font-heading)] text-xl text-[var(--color-text-heading)]">No encontramos ofertas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-8">
            <p className="text-[var(--color-text-muted)]">Ajusta los filtros o crea una nueva oferta para iniciar tu pipeline de selección.</p>
            <Link href={ROUTES.EMPRESA.NUEVA_OFERTA}>
              <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white">Crear oferta</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
